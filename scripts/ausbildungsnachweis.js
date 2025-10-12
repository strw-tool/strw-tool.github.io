(function () {
  const tabName = "ausbildungsnachweis";

  function render(container) {
    container.innerHTML = `
      <section class="ausbildungsnachweis">
        <h2>📚 Ausbildungsnachweis</h2>
        <p>Fülle die Felder aus und lade Fotos hoch. Das PDF wird automatisch mit der Originalvorlage erstellt.</p>

        <div class="form-grid">
          <label>👤 Name<input id="azubiName" type="text"></label>
          <label>📄 Nr. des Verzeichnisses<input id="azubiVerzeichnis" type="text"></label>

          <label>📆 Ausbildungsjahr
            <select id="azubiJahrSelect">
              <option value="1">1. Lehrjahr</option>
              <option value="2">2. Lehrjahr</option>
              <option value="3">3. Lehrjahr</option>
              <option value="custom">Eigene Eingabe</option>
            </select>
            <input id="azubiJahrCustom" type="text" placeholder="z. B. -4-" style="display:none;margin-top:4px;">
          </label>

          <label>🏢 Ausbildungsbetrieb<input id="azubiBetrieb" type="text"></label>
        </div>

        <div class="upload-box">
          <label>📸 Fotos (beliebige Formate)
            <input id="azubiFotos" type="file" accept="image/*" multiple>
          </label>
          <div id="fotoPreview" class="foto-preview"></div>
        </div>

        <button id="exportAzubiPDF" class="btn">📄 PDF erstellen</button>
        <div id="exportStatus" class="status"></div>
      </section>
    `;

    const jahrSelect = document.getElementById("azubiJahrSelect");
    const jahrCustom = document.getElementById("azubiJahrCustom");
    jahrSelect.addEventListener("change", () => {
      jahrCustom.style.display = jahrSelect.value === "custom" ? "block" : "none";
    });

    const fotoInput = document.getElementById("azubiFotos");
    const fotoPreview = document.getElementById("fotoPreview");
    const status = document.getElementById("exportStatus");
    const exportBtn = document.getElementById("exportAzubiPDF");
    let uploadedImages = [];

    fotoInput.addEventListener("change", async (e) => {
      uploadedImages = [];
      fotoPreview.innerHTML = "";
      const files = Array.from(e.target.files);

      for (const file of files) {
        const converted = await convertToPng(file);
        uploadedImages.push(converted);
        const img = document.createElement("img");
        img.src = converted;
        img.style.maxWidth = "100px";
        img.style.margin = "3px";
        fotoPreview.appendChild(img);
      }
    });

    exportBtn.addEventListener("click", async () => {
      const name = val("azubiName");
      const verzeichnis = val("azubiVerzeichnis");
      const betrieb = val("azubiBetrieb");
      const jahrValue =
        jahrSelect.value === "custom"
          ? val("azubiJahrCustom")
          : jahrSelect.value
            ? `-${jahrSelect.value}-`
            : "";

      if (!name || !verzeichnis || !jahrValue || !betrieb)
        return msg("⚠️ Bitte alle Felder ausfüllen!", true);

      msg("📦 Lade PDF-Bibliothek ...");
      await ensurePdfLib();

      const tplPath = "assets/09 Ausbildungsnachweis.pdf";
      const res = await fetch(tplPath);
      if (!res.ok) return msg("❌ Vorlage fehlt: " + tplPath, true);

      const bytes = await res.arrayBuffer();
      const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
      const pdf = await PDFDocument.load(bytes);
      const helv = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      // === Seite 1 ===
      const p1 = pages[0];
      p1.drawText(name,        { x: 70,  y: 755, size: 11, font: helv, color: rgb(0, 0, 0) });
      p1.drawText(verzeichnis, { x: 388, y: 755, size: 11, font: helv, color: rgb(0, 0, 0) });
      p1.drawText(jahrValue,   { x: 115, y: 725, size: 11, font: helv, color: rgb(0, 0, 0) });
      p1.drawText(betrieb,     { x: 310, y: 725, size: 11, font: helv, color: rgb(0, 0, 0) });

      // === Seite 2 – Bilder (automatische Konvertierung) ===
      const p2 = pages[1];
      const { width, height } = p2.getSize();
      const boxX = 55;
      const boxY = 180;
      const boxW = width - 140;
      const boxH = height - 310;
      const cols = 2;
      const gap = 10;
      const cellW = (boxW - gap * (cols - 1)) / cols;
      const cellH = 150;
      let x = boxX, y = boxY + boxH - cellH;

      for (let i = 0; i < uploadedImages.length; i++) {
        const data = uploadedImages[i];
        try {
          const buf = await fetch(data).then((r) => r.arrayBuffer());
          const img = await pdf.embedPng(buf); // alle konvertiert zu PNG
          const scale = Math.min(cellW / img.width, cellH / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          if (i > 0 && i % cols === 0) { x = boxX; y -= cellH + gap; }
          p2.drawImage(img, { x, y, width: w, height: h });
          x += cellW + gap;
        } catch (err) {
          console.warn("Bild konnte nicht eingebettet werden:", err);
        }
      }

      const finalBytes = await pdf.save();
      downloadPDF(finalBytes, `Ausbildungsnachweis_${name.replace(/\s+/g, "_")}.pdf`);
      msg("✅ PDF erfolgreich erstellt!");
    });

    // Hilfsfunktionen
    function val(id) { return document.getElementById(id)?.value.trim(); }
    function msg(t, err = false) { status.style.color = err ? "#f87171" : "#fff"; status.textContent = t; }

    async function convertToPng(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  async function ensurePdfLib() {
    if (!window.PDFLib) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
        s.onload = resolve;
        s.onerror = () => reject(new Error("PDF-Lib konnte nicht geladen werden"));
        document.head.appendChild(s);
      });
    }
  }

  function downloadPDF(bytes, filename) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  if (!window.AppModules) window.AppModules = {};
  window.AppModules[tabName] = { render };
})();
