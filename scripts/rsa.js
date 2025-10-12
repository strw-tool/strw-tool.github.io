/* ===========================================
   Straßenwärter-Helfer – rsa.js (Variante 1)
   Externe FGSV-Regelpläne mit Direktlinks
   =========================================== */

(function () {

  const SOURCES = [
    {
      id: "FGSV_B",
      label: "RSA 2021 – Regelpläne Teil B (FGSV)",
      url: "https://www.fgsv-verlag.de/pub/media/pdf/Regelplaene_B_Auszug_RSA_2021_FGSV%20370.pdf"
    },
    {
      id: "FGSV_C",
      label: "RSA 2021 – Regelpläne Teil C (FGSV)",
      url: "https://www.fgsv-verlag.de/pub/media/pdf/Regelplaene_C_Auszug_RSA_2021_FGSV%20370.pdf"
    },
    {
      id: "FGSV_D",
      label: "RSA 2021 – Regelpläne Teil D (FGSV)",
      url: "https://www.fgsv-verlag.de/pub/media/pdf/Regelplaene_D_Auszug_RSA_2021_FGSV%20370.pdf"
    },
    {
      id: "CUSTOM",
      label: "Eigene PDF-URL …",
      url: "custom"
    }
  ];

  const LS_KEY_URL = "rsa_current_url";
  const LS_KEY_ID  = "rsa_current_id";
  const LS_KEY_FAV = "rsa_favs";

  window.loadRSATab = function loadRSATab(main) {
    const container = main || document.getElementById("mainContent");
    if (!container) return;

    const savedId  = localStorage.getItem(LS_KEY_ID);
    const savedUrl = localStorage.getItem(LS_KEY_URL);
    let current = SOURCES.find(s => s.id === savedId) || SOURCES[0];
    let currentUrl = savedUrl || current.url;

    container.innerHTML = `
      <section class="card fade-in">
        <div class="section-title"><h2>🚧 RSA-Regelpläne – Direktzugriff</h2></div>

        <div class="card" style="padding:0.8rem;">
          <label for="rsaSelect">Quelle auswählen:</label>
          <select id="rsaSelect">
            ${SOURCES.map(s => `<option value="${s.id}">${s.label}</option>`).join("")}
          </select>

          <div id="customBox" style="display:none;margin-top:.6rem;">
            <input id="customInput" placeholder="https://… (PDF-Link)">
            <button class="btn accent" id="loadCustom">📄 Laden</button>
          </div>

          <div id="openHint" style="margin-top:.8rem;color:var(--muted);font-size:.95rem;">
            Externe FGSV-Regelpläne können aus rechtlichen Gründen
            <b>nicht eingebettet</b> werden. Bitte über den Button öffnen.
          </div>

          <div style="margin-top:.8rem;display:flex;gap:.6rem;flex-wrap:wrap;">
            <button class="btn accent" id="openDirect">🔗 PDF in neuem Tab öffnen</button>
            <button class="btn ghost" id="resetBtn">♻️ Zurücksetzen</button>
          </div>
        </div>

        <div class="card" id="pdfContainer" style="padding:0;overflow:hidden;margin-top:1rem;">
          <iframe id="rsaFrame" src="" width="100%" height="740" style="border:0;display:none;"></iframe>
          <div id="noFrameMsg" style="padding:1rem;color:var(--muted);">
            Kein PDF geladen. Wähle eine Quelle oder öffne sie in einem neuen Tab.
          </div>
        </div>
      </section>
    `;

    // DOM-Referenzen
    const rsaSelect   = document.getElementById("rsaSelect");
    const customBox   = document.getElementById("customBox");
    const customInput = document.getElementById("customInput");
    const loadCustom  = document.getElementById("loadCustom");
    const openDirect  = document.getElementById("openDirect");
    const resetBtn    = document.getElementById("resetBtn");
    const frame       = document.getElementById("rsaFrame");
    const msgBox      = document.getElementById("noFrameMsg");
    const hint        = document.getElementById("openHint");

    rsaSelect.value = current.id;
    if (current.id === "CUSTOM") {
      customBox.style.display = "block";
      frame.style.display = "block";
      msgBox.style.display = "none";
      hint.style.display = "none";
      frame.src = currentUrl;
    }

    rsaSelect.onchange = () => {
      const sel = SOURCES.find(s => s.id === rsaSelect.value);
      if (!sel) return;
      current = sel;
      currentUrl = sel.url;
      localStorage.setItem(LS_KEY_ID, sel.id);
      localStorage.setItem(LS_KEY_URL, sel.url);

      if (sel.id === "CUSTOM") {
        customBox.style.display = "block";
        frame.style.display = "block";
        msgBox.style.display = "none";
        hint.style.display = "none";
      } else {
        customBox.style.display = "none";
        frame.style.display = "none";
        msgBox.style.display = "block";
        hint.style.display = "block";
      }
    };

    loadCustom.onclick = () => {
      const url = (customInput.value || "").trim();
      if (!/^https?:\/\//.test(url)) {
        alert("Bitte eine gültige URL eingeben (https://…).");
        return;
      }
      currentUrl = url;
      localStorage.setItem(LS_KEY_ID, "CUSTOM");
      localStorage.setItem(LS_KEY_URL, url);
      frame.src = url;
      frame.style.display = "block";
      msgBox.style.display = "none";
      hint.style.display = "none";
    };

    openDirect.onclick = () => {
      if (!currentUrl || current.id === "CUSTOM") {
        alert("Bitte zuerst eine Quelle auswählen oder eine eigene URL laden.");
        return;
      }
      window.open(currentUrl, "_blank");
    };

    resetBtn.onclick = () => {
      const def = SOURCES[0];
      current = def;
      currentUrl = def.url;
      rsaSelect.value = def.id;
      localStorage.setItem(LS_KEY_ID, def.id);
      localStorage.setItem(LS_KEY_URL, def.url);
      customBox.style.display = "none";
      frame.style.display = "none";
      msgBox.style.display = "block";
      hint.style.display = "block";
    };
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab='rsa']");
    if (btn) setTimeout(() => window.loadRSATab(document.getElementById("mainContent")), 50);
  });

})();
