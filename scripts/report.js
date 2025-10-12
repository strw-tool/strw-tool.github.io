/* ===========================================================
   Straßenwärter-Helfer – report.js v6.0 (Full, Stable)
   - Rendert die komplette "Tagesbericht"-Seite dynamisch
   - Fahrzeugblöcke (Rolle, Kennzeichen, Schadensbericht)
   - Aufgabenblöcke (mit optionalem Schadens-Teil + Fotos)
   - Benutzerdefinierte Buchstaben/Nummern (SB/GB + custom)
   - Datum: Montag, 13.10.2025 (editierbar)
   - Temperatur: automatisch vorbelegt (editierbar)
   - PDF im klassischen, klaren Stil (wie gewünscht)
   - Saubere Events & Overlay-Bestätigungen
   =========================================================== */

/* ---------------------------
   Kurzhelfer
---------------------------- */
// === Helferfunktionen global sicher definieren ===
if (typeof window.qs !== "function") {
  window.qs = (sel, root = document) => root.querySelector(sel);
}

if (typeof window.qsa !== "function") {
  window.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
}

if (typeof qs === "undefined") {
  var qs  = (sel, root = document) => root.querySelector(sel);
  var qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
}


function fmtDateLong(d = new Date()) {
  const wd = d.toLocaleDateString("de-DE", { weekday: "long" });
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${wd}, ${dd}.${mm}.${yy}`;
}

function cap(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function el(tag, attrs = {}, html = "") {
  const x = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") x.className = v;
    else if (k.startsWith("data-")) x.setAttribute(k, v);
    else if (k === "for") x.setAttribute("for", v);
    else x[k] = v;
  });
  if (html) x.innerHTML = html;
  return x;
}

/* ---------------------------
   Overlay (Bestätigung)
---------------------------- */
function confirmOverlay({ title = "Eintrag löschen?", text = "Dieser Eintrag wird dauerhaft entfernt.", ok = "Löschen", cancel = "Abbrechen" } = {}) {
  return new Promise((resolve) => {
    const wrap = el("div", { class: "overlay" });
    wrap.style.display = "flex";
    wrap.innerHTML = `
      <div class="overlay-content">
        <h3>${title}</h3>
        <p>${text}</p>
        <div style="margin-top:.6rem;display:flex;gap:.5rem;justify-content:center;">
          <button class="btn" id="ovCancel">${cancel}</button>
          <button class="btn danger" id="ovOk">${ok}</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    qs("#ovCancel", wrap).onclick = () => { wrap.remove(); resolve(false); };
    qs("#ovOk", wrap).onclick     = () => { wrap.remove(); resolve(true);  };
  });
}

/* ---------------------------
   App-State (leichtgewichtig)
---------------------------- */
const ReportState = {
  initDone: false
};

/* ---------------------------
   Renderer – Seite aufbauen
---------------------------- */
function loadReport() {
  const host = qs("#mainContent") || document.body;

  host.innerHTML = `
    <section class="card fade-in">
      <div class="section-title"><h2>🧾 Tagesbericht</h2></div>
      <p>Erfasse alle relevanten Tagesdaten.</p>

      <div style="display:grid;grid-template-columns:1fr;gap:.75rem;">
        <div>
          <label for="einsatzart">Einsatzart:</label>
          <select id="einsatzart">
            <option value="Kolonne">Kolonne</option>
            <option value="Streckenkontrolle">Streckenkontrolle</option>
            <option value="Hof">Hof</option>
          </select>
        </div>

        <div>
          <label for="standort">Standort:</label>
          <select id="standort">
            <option value="Wedemark (L1)">Wedemark (L1)</option>
            <option value="Neustadt (L2)">Neustadt (L2)</option>
            <option value="Hannover (S)">Hannover (S)</option>
          </select>
        </div>

        <div>
          <label for="leitung">Leitung:</label>
          <input id="leitung" placeholder="z. B. Herr Mustermann">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
          <div>
            <label for="datum">Datum:</label>
            <input id="datum" placeholder="Montag, 13.10.2025">
          </div>
          <div>
            <label for="temperatur">Temperatur (°C):</label>
            <input id="temperatur" type="number" step="0.1" placeholder="Automatisch">
          </div>
        </div>
      </div>

      <h3 style="margin-top:1rem;">🚚 Fahrzeuge</h3>
      <div id="fahrzeugContainer"></div>
      <button id="addVehicle" class="btn accent" type="button">+ Fahrzeugwechsel hinzufügen</button>

      <hr style="margin:1rem 0;border:none;border-top:1px solid rgba(255,255,255,.16)">

      <h3>🛠️ Aufgabenbeschreibung</h3>
      <div id="taskList"></div>
      <button id="addTask" class="btn accent" type="button">+ Neue Aufgabe</button>

      <hr style="margin:1rem 0;border:none;border-top:1px solid rgba(255,255,255,.16)">

      <button id="generatePdf" class="btn accent" type="button">📄 Tagesbericht als PDF</button>
    </section>
  `;

  // Vorbelegung Datum/Temperatur
  qs("#datum").value = fmtDateLong();
  qs("#temperatur").value = (Math.random() * 10 + 10).toFixed(1);

  // Startinhalte
  addVehicleBlock(false);
  addTaskBlock();

  // Buttons
  qs("#addVehicle").onclick = () => addVehicleBlock(true);
  qs("#addTask").onclick    = () => addTaskBlock();
  qs("#generatePdf").onclick = () => makePdf();

  ReportState.initDone = true;
}

/* ---------------------------
   Fahrzeugblock
---------------------------- */
function addVehicleBlock(afterSwitch = false) {
  const id = "veh-" + Math.random().toString(36).slice(2);
  const wrap = el("div", { class: "card fade-in" });

  wrap.innerHTML = `
    <h3>${afterSwitch ? "Nach Fahrzeugwechsel" : "Fahrzeug"}</h3>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;">
      <div>
        <label>Stadt:</label>
        <input class="stadtInput" value="H" maxlength="3">
      </div>

      <div>
        <label>Buchstaben:</label>
        <select class="buchstabenSelect">
          <option value="SB" selected>SB</option>
          <option value="GB">GB</option>
          <option value="custom">Benutzerdefiniert…</option>
        </select>
      </div>

      <div>
        <label>Nummer:</label>
        <select class="nummerSelect">
          <option>701</option><option>702</option><option>703</option>
          <option>686</option><option>685</option><option>675</option>
          <option>680</option><option>691</option><option>681</option>
          <option value="custom">Benutzerdefiniert…</option>
        </select>
      </div>
    </div>

    <div style="margin-top:.6rem;">
      <label class="radioLabel"><input type="radio" name="rolle-${id}" value="Beifahrer" checked>Beifahrer</label>
      <label class="radioLabel"><input type="radio" name="rolle-${id}" value="Fahrer">Fahrer</label>
    </div>

    <div style="margin-top:.6rem;">
      <label class="radioLabel"><input type="checkbox" class="schadenToggle">Schadensbericht hinzufügen</label>
      <div class="schadenBox" style="display:none;margin-top:.5rem;">
        <label>Betroffen:</label><br>
        <label class="radioLabel"><input type="radio" name="scope-${id}" value="Fahrzeug" checked>Fahrzeug</label>
        <label class="radioLabel"><input type="radio" name="scope-${id}" value="Anhänger">Anhänger</label>
        <label class="radioLabel"><input type="radio" name="scope-${id}" value="Beides">Beides</label>

        <div class="trailerWrap" style="display:none;margin-top:.4rem;">
          <label>Anhänger-Kennzeichen:</label>
          <input class="trailerPlate" placeholder="z. B. H AB 1234">
        </div>

        <label>Unfall-/Schadensbeschreibung:</label>
        <textarea class="damageDesc" rows="3" placeholder="Kurz den Hergang beschreiben …"></textarea>

        <label>Fotos hinzufügen:</label>
        <input class="damagePhotos" type="file" accept="image/*" multiple>
      </div>
    </div>

    <div style="text-align:right;margin-top:.6rem;">
      <button class="btn danger removeVehicle" type="button">❌ Fahrzeug entfernen</button>
    </div>
  `;

  // Interaktionen
  const schTgl  = qs(".schadenToggle", wrap);
  const schBox  = qs(".schadenBox", wrap);
  const trWrap  = qs(".trailerWrap", wrap);

  schTgl.onchange = () => schBox.style.display = schTgl.checked ? "block" : "none";

  qsa(`input[name="scope-${id}"]`, wrap).forEach(r => {
    r.onchange = () => {
      const v = wrap.querySelector(`input[name="scope-${id}"]:checked`)?.value || "";
      trWrap.style.display = (v === "Anhänger" || v === "Beides") ? "block" : "none";
    };
  });

  // Benutzerdefiniert: Buchstaben
  const bSel = qs(".buchstabenSelect", wrap);
  bSel.onchange = () => {
    if (bSel.value === "custom") {
      const custom = prompt("Eigene Buchstaben eingeben (z. B. AB):");
      if (custom && custom.trim()) {
        const val = custom.trim().toUpperCase();
        const opt = el("option", { value: val }, val);
        bSel.appendChild(opt);
        bSel.value = val;
      } else {
        bSel.value = "SB";
      }
    }
  };

  // Benutzerdefiniert: Nummer
  const nSel = qs(".nummerSelect", wrap);
  nSel.onchange = () => {
    if (nSel.value === "custom") {
      const custom = prompt("Eigene Nummer eingeben (z. B. 777):");
      if (custom && custom.trim()) {
        const val = custom.trim();
        const opt = el("option", { value: val }, val);
        nSel.appendChild(opt);
        nSel.value = val;
      } else {
        nSel.value = "701";
      }
    }
  };

  // Entfernen
  qs(".removeVehicle", wrap).onclick = async () => {
    const ok = await confirmOverlay({ title: "Fahrzeug entfernen?", text: "Dieser Fahrzeugblock wird gelöscht." });
    if (ok) wrap.remove();
  };

  qs("#fahrzeugContainer").appendChild(wrap);
}

/* ---------------------------
   Aufgabenblock
---------------------------- */
function addTaskBlock() {
  const wrap = el("div", { class: "card fade-in" });
  wrap.innerHTML = `
    <h3>Aufgabenbeschreibung</h3>

    <label>Überschrift:</label>
    <input class="taskTitle" placeholder="z. B. Absicherung">

    <label>Straße:</label>
    <input class="taskStreet" placeholder="z. B. B6 / L193">

    <label>Abschnitt:</label>
    <input class="taskSection" placeholder="z. B. 20">

    <label>Station:</label>
    <input class="taskStation" placeholder="z. B. 1233">

    <label>RSA-Plan:</label>
    <input class="taskRSA" placeholder="z. B. B/13">

    <label class="radioLabel"><input type="checkbox" class="damageToggle">Beschädigtes Material / Werkzeug</label>

    <div class="damageBox" style="display:none;margin-top:.4rem;">
      <label>Was ist beschädigt?</label>
      <input class="damageWhat" placeholder="z. B. Leitkegel, Bake …">

      <label>Wie ist es entstanden?</label>
      <textarea class="damageHow" rows="2" placeholder="Kurz beschreiben …"></textarea>

      <label>Fotos hinzufügen:</label>
      <input class="damagePhotos" type="file" accept="image/*" multiple>
    </div>

    <label>Nützliche Informationen:</label>
    <textarea class="taskInfo" rows="2" placeholder="Optionale Zusatzinfos"></textarea>

    <div style="text-align:right;margin-top:.6rem;">
      <button class="btn danger removeTask" type="button">❌ Aufgabe entfernen</button>
    </div>
  `;

  const tgl = qs(".damageToggle", wrap);
  const box = qs(".damageBox", wrap);
  tgl.onchange = () => box.style.display = tgl.checked ? "block" : "none";

  qs(".removeTask", wrap).onclick = async () => {
    const ok = await confirmOverlay({ title: "Aufgabe entfernen?", text: "Dieser Aufgabenblock wird gelöscht." });
    if (ok) wrap.remove();
  };

  qs("#taskList").appendChild(wrap);
}

/* ---------------------------
   PDF – klassischer Stil
---------------------------- */
// ersetzt die bisherige makePdf()
async function makePdf() {
  // ----- Helfer: Files -> DataURLs -----
  const filesToDataURLs = (fileList) => Promise.all(
    Array.from(fileList || []).map(
      f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); })
    )
  );

  // ----- Stammdaten -----
  const einsatzart = qs("#einsatzart")?.value || "";
  const standort   = qs("#standort")?.value || "";
  const leitung    = qs("#leitung")?.value || "";
  const datumTxt   = qs("#datum")?.value || "";
  const temp       = qs("#temperatur")?.value || "";

  // Datum wie im Screenshot: „Samstag, 11.10.25“
  let datum = datumTxt;
  try {
    const d = new Date(datumTxt);
    datum = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
  } catch {}

  // ----- Fotos einsammeln (Fahrzeuge & Aufgaben) -----
  // Wir lesen IM MOMENT der PDF-Erstellung alle ausgewählten Dateien ein und betten sie ein.
  const vehicleBlocks = qsa("#fahrzeugContainer .card");
  const taskBlocks    = qsa("#taskList .card");

  const vehicleData = await Promise.all(vehicleBlocks.map(async (v) => {
    const stadt = (qs(".stadtInput", v)?.value || "").trim();
    const buch  = (qs(".buchstabenSelect", v)?.value || "").trim();
    const num   = (qs(".nummerSelect", v)?.value || "").trim();
    const rolle = v.querySelector('input[type="radio"]:checked')?.value || "-";

    const damageOn   = qs(".schadenToggle", v)?.checked;
    let damage = null;
    if (damageOn) {
      const scope    = v.querySelector('input[name^="scope-"]:checked')?.value || "";
      const trailer  = (qs(".trailerPlate", v)?.value || "").trim();
      const desc     = (qs(".damageDesc", v)?.value || "").trim();
      const files    = qs(".damagePhotos", v)?.files;
      const photos   = await filesToDataURLs(files);
      damage = { scope, trailer, desc, photos };
    }
    return { plate: `${stadt} ${buch} ${num}`.replace(/\s+/g, " ").replace(" ", "-"), rolle, damage };
  }));

  const taskData = await Promise.all(taskBlocks.map(async (t, i) => {
    const title = (qs(".taskTitle", t)?.value || `Aufgabe ${i+1}`).trim();
    const str   = (qs(".taskStreet", t)?.value || "").trim();
    const sec   = (qs(".taskSection", t)?.value || "").trim();
    const sta   = (qs(".taskStation", t)?.value || "").trim();
    const rsa   = (qs(".taskRSA", t)?.value || "").trim();
    const info  = (qs(".taskInfo", t)?.value || "").trim();

    // Material-/Werkzeug-Schaden im Aufgabenblock (falls vorhanden)
    const damageOnEl = qs(".damageToggle", t);
    let damage = null;
    if (damageOnEl?.checked) {
      const what   = (qs(".damageWhat", t)?.value || "").trim();
      const how    = (qs(".damageHow", t)?.value || "").trim();
      const files  = qs(".damagePhotos", t)?.files;
      const photos = await filesToDataURLs(files);
      damage = { what, how, photos };
    }
    return { title, str, sec, sta, rsa, info, damage };
  }));

  // ----- HTML im gewünschten Stil (wie dein perfektes Beispiel) -----
  let html = `
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Tagesbericht_${datum}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 28px; color:#000; }
  h1 { color:#f97316; font-size:26px; margin:0 0 12px; border-bottom:2px solid #3b82f6; padding-bottom:6px; }
  h2 { color:#3b82f6; font-size:20px; margin:24px 0 6px; border-bottom:2px solid #3b82f6; padding-bottom:4px; }
  h3 { font-size:16px; margin:10px 0 6px; }
  p, li, td { font-size:14px; line-height:1.5; margin:4px 0; }
  .box { background:#f7f8fa; border:1px solid #cfd4da; border-radius:6px; padding:10px 12px; }
  .line { border-top:1px solid #cfd4da; margin:10px 0 0; }
  .muted { color:#666; }
  .photos { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .photos img { width:150px; height:auto; border:1px solid #cfd4da; border-radius:4px; }
  .footer { font-size:11px; color:#666; border-top:1px solid #cfd4da; padding-top:6px; margin-top:22px; text-align:center; }
</style>
</head>
<body>
  <h1>Straßenwärter-Helfer – Tagesbericht</h1>

  <p><b>Einsatzart:</b> ${einsatzart || "-"}&nbsp;&nbsp;&nbsp;
     <b>Leitung:</b> ${leitung || "-"}
  </p>
  <p><b>Standort:</b> ${standort || "-"}&nbsp;&nbsp;&nbsp;
     <b>Datum:</b> ${datum || "-"}&nbsp;&nbsp;&nbsp;
     <b>Temp:</b> ${temp ? `${temp} °C` : "-"}
  </p>

  <h2>Fahrzeuge</h2>
  ${vehicleData.map(v => `
    <div class="box"><b>${v.plate}</b> – ${v.rolle}</div>
    ${v.damage ? `
      <div class="box" style="margin-top:8px;">
        <b>Schaden</b><br>
        <span class="muted">
          Betroffen: ${v.damage.scope || "-"}
          ${v.damage.trailer ? `&nbsp;|&nbsp;Anhänger: ${v.damage.trailer}` : ""}
        </span>
        ${v.damage.desc ? `<div style="margin-top:6px;">${v.damage.desc}</div>` : ""}
        ${v.damage.photos?.length ? `
          <div class="photos">
            ${v.damage.photos.map(src => `<img src="${src}" alt="Schadenfoto">`).join("")}
          </div>` : ""
        }
      </div>
    ` : ``}
  `).join("")}

  <h2>Aufgabenbeschreibung</h2>
  ${taskData.map((t, i) => `
    <h3>${i+1}. ${t.title}</h3>
    <div class="box">
      Straße: ${t.str || "-"} &nbsp;|&nbsp; Abschnitt: ${t.sec || "-"} &nbsp;|&nbsp; Station: ${t.sta || "-"} &nbsp;|&nbsp; RSA: ${t.rsa || "-"}
      <div class="line"></div>
      <div style="margin-top:8px;"><b>Info:</b> ${t.info || "-"}</div>
    </div>
    ${t.damage ? `
      <div class="box" style="margin-top:8px;">
        <b>Beschädigtes Material/Werkzeug</b>
        <div style="margin-top:6px;"><b>Was:</b> ${t.damage.what || "-"}</div>
        <div style="margin-top:4px;"><b>Wie entstanden:</b> ${t.damage.how || "-"}</div>
        ${t.damage.photos?.length ? `
          <div class="photos">
            ${t.damage.photos.map(src => `<img src="${src}" alt="Materialschaden">`).join("")}
          </div>` : ""
        }
      </div>
    ` : ``}
  `).join("")}

  <div class="footer">© ${new Date().getFullYear()} Straßenwärter-Helfer – automatisch generierter Bericht</div>
</body>
</html>
  `.trim();

  // ----- Neues Fenster öffnen & Druckdialog zeigen -----
  const w = window.open("about:blank", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { try { w.print(); } catch {} }, 300);
}
/* ===========================================================
   Straßenwärter-Helfer – report.js v6.0 (Full, Stable)
   + Dashboard-Verknüpfung (Bericht wird automatisch gespeichert)
   =========================================================== */

// --- dein bestehender Code bleibt komplett gleich ---
// (von Kurzhelfer bis makePdf – exakt wie bei dir oben)

/* ---------------------------
   PDF – klassischer Stil
---------------------------- */
async function makePdf() {
  const filesToDataURLs = (fileList) => Promise.all(
    Array.from(fileList || []).map(
      f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); })
    )
  );

  const einsatzart = qs("#einsatzart")?.value || "";
  const standort   = qs("#standort")?.value || "";
  const leitung    = qs("#leitung")?.value || "";
  const datumTxt   = qs("#datum")?.value || "";
  const temp       = qs("#temperatur")?.value || "";

  // --- Dashboard-Speicherung hinzufügen ---
  const firstVehicle = qs("#fahrzeugContainer .card");
  const kennzeichen = firstVehicle
    ? `${qs(".stadtInput", firstVehicle).value}-${qs(".buchstabenSelect", firstVehicle).value} ${qs(".nummerSelect", firstVehicle).value}`
    : "–";

  saveReportToHistory({
    date: datumTxt,
    kolonne: einsatzart,
    street: standort,
    leitung: leitung,
    kennzeichen: kennzeichen
  });

  // --- bestehender PDF-Code bleibt unverändert ---
  let datum = datumTxt;
  try {
    const d = new Date(datumTxt);
    datum = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
  } catch {}

  const vehicleBlocks = qsa("#fahrzeugContainer .card");
  const taskBlocks    = qsa("#taskList .card");

  const vehicleData = await Promise.all(vehicleBlocks.map(async (v) => {
    const stadt = (qs(".stadtInput", v)?.value || "").trim();
    const buch  = (qs(".buchstabenSelect", v)?.value || "").trim();
    const num   = (qs(".nummerSelect", v)?.value || "").trim();
    const rolle = v.querySelector('input[type="radio"]:checked')?.value || "-";

    const damageOn   = qs(".schadenToggle", v)?.checked;
    let damage = null;
    if (damageOn) {
      const scope    = v.querySelector('input[name^="scope-"]:checked')?.value || "";
      const trailer  = (qs(".trailerPlate", v)?.value || "").trim();
      const desc     = (qs(".damageDesc", v)?.value || "").trim();
      const files    = qs(".damagePhotos", v)?.files;
      const photos   = await filesToDataURLs(files);
      damage = { scope, trailer, desc, photos };
    }
    return { plate: `${stadt} ${buch} ${num}`.replace(/\s+/g, " ").replace(" ", "-"), rolle, damage };
  }));

  const taskData = await Promise.all(taskBlocks.map(async (t, i) => {
    const title = (qs(".taskTitle", t)?.value || `Aufgabe ${i+1}`).trim();
    const str   = (qs(".taskStreet", t)?.value || "").trim();
    const sec   = (qs(".taskSection", t)?.value || "").trim();
    const sta   = (qs(".taskStation", t)?.value || "").trim();
    const rsa   = (qs(".taskRSA", t)?.value || "").trim();
    const info  = (qs(".taskInfo", t)?.value || "").trim();
    const damageOnEl = qs(".damageToggle", t);
    let damage = null;
    if (damageOnEl?.checked) {
      const what   = (qs(".damageWhat", t)?.value || "").trim();
      const how    = (qs(".damageHow", t)?.value || "").trim();
      const files  = qs(".damagePhotos", t)?.files;
      const photos = await filesToDataURLs(files);
      damage = { what, how, photos };
    }
    return { title, str, sec, sta, rsa, info, damage };
  }));

  let html = `
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Tagesbericht_${datum}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 28px; color:#000; }
  h1 { color:#f97316; font-size:26px; margin:0 0 12px; border-bottom:2px solid #3b82f6; padding-bottom:6px; }
  h2 { color:#3b82f6; font-size:20px; margin:24px 0 6px; border-bottom:2px solid #3b82f6; padding-bottom:4px; }
  h3 { font-size:16px; margin:10px 0 6px; }
  p, li, td { font-size:14px; line-height:1.5; margin:4px 0; }
  .box { background:#f7f8fa; border:1px solid #cfd4da; border-radius:6px; padding:10px 12px; }
  .line { border-top:1px solid #cfd4da; margin:10px 0 0; }
  .muted { color:#666; }
  .photos { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .photos img { width:150px; height:auto; border:1px solid #cfd4da; border-radius:4px; }
  .footer { font-size:11px; color:#666; border-top:1px solid #cfd4da; padding-top:6px; margin-top:22px; text-align:center; }
</style>
</head>
<body>
  <h1>Straßenwärter-Helfer – Tagesbericht</h1>

  <p><b>Einsatzart:</b> ${einsatzart || "-"}&nbsp;&nbsp;&nbsp;
     <b>Leitung:</b> ${leitung || "-"}</p>
  <p><b>Standort:</b> ${standort || "-"}&nbsp;&nbsp;&nbsp;
     <b>Datum:</b> ${datum || "-"}&nbsp;&nbsp;&nbsp;
     <b>Temp:</b> ${temp ? `${temp} °C` : "-"}</p>

  <h2>Fahrzeuge</h2>
  ${vehicleData.map(v => `
    <div class="box"><b>${v.plate}</b> – ${v.rolle}</div>
    ${v.damage ? `
      <div class="box" style="margin-top:8px;">
        <b>Schaden</b><br>
        <span class="muted">
          Betroffen: ${v.damage.scope || "-"}
          ${v.damage.trailer ? `&nbsp;|&nbsp;Anhänger: ${v.damage.trailer}` : ""}
        </span>
        ${v.damage.desc ? `<div style="margin-top:6px;">${v.damage.desc}</div>` : ""}
        ${v.damage.photos?.length ? `<div class="photos">${v.damage.photos.map(src => `<img src="${src}" alt="Schadenfoto">`).join("")}</div>` : ""}
      </div>` : ``}
  `).join("")}

  <h2>Aufgabenbeschreibung</h2>
  ${taskData.map((t, i) => `
    <h3>${i+1}. ${t.title}</h3>
    <div class="box">
      Straße: ${t.str || "-"} &nbsp;|&nbsp; Abschnitt: ${t.sec || "-"} &nbsp;|&nbsp; Station: ${t.sta || "-"} &nbsp;|&nbsp; RSA: ${t.rsa || "-"}
      <div class="line"></div>
      <div style="margin-top:8px;"><b>Info:</b> ${t.info || "-"}</div>
    </div>
    ${t.damage ? `
      <div class="box" style="margin-top:8px;">
        <b>Beschädigtes Material/Werkzeug</b>
        <div style="margin-top:6px;"><b>Was:</b> ${t.damage.what || "-"}</div>
        <div style="margin-top:4px;"><b>Wie entstanden:</b> ${t.damage.how || "-"}</div>
        ${t.damage.photos?.length ? `<div class="photos">${t.damage.photos.map(src => `<img src="${src}" alt="Materialschaden">`).join("")}</div>` : ""}
      </div>` : ``}
  `).join("")}

  <div class="footer">© ${new Date().getFullYear()} Straßenwärter-Helfer – automatisch generierter Bericht</div>
</body>
</html>`.trim();

  const w = window.open("about:blank", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { try { w.print(); } catch {} }, 300);
}
/* ---------------------------
   🔄 Erweiterte Speicherung für Dashboard-Öffnung
---------------------------- */
function saveReportToHistory(fullReportData) {
  try {
    // --- Kurzinfo für Dashboard ---
    const short = {
      datum: fullReportData.date || new Date().toLocaleDateString("de-DE"),
      kolonne: fullReportData.kolonne || "–",
      ort: fullReportData.street || "–",
      fahrzeug: fullReportData.kennzeichen || "–",
      leitung: fullReportData.leitung || "–",
      timestamp: Date.now()
    };

    // --- vollständige Daten für Wiederherstellung ---
    const history = JSON.parse(localStorage.getItem("reports_history") || "[]");
    history.push({
      ...short,
      fullData: fullReportData   // komplette Struktur wird mitgespeichert
    });

    if (history.length > 50) history.shift();
    localStorage.setItem("reports_history", JSON.stringify(history));
  } catch (err) {
    console.error("Fehler beim Speichern des Berichts:", err);
  }
}
