/* ===========================================================
   Straßenwärter-Helfer – report.js v10.0
   Modular (mount/unmount), stabil, A5-optimiertes PDF
   =========================================================== */

/* ---------------------------
   Kleine DOM-/Date-Helfer
---------------------------- */
const $  = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

function h(tag, attrs={}, html=""){
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k==="class") e.className=v; else e.setAttribute(k,v);
  }
  if (html) e.innerHTML = html;
  return e;
}

function todayPretty(){
  const d = new Date();
  const wd = d.toLocaleDateString("de-DE",{weekday:"long"});
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear();
  return `${wd}, ${dd}.${mm}.${yyyy}`;
}

/** sehr robustes Parsen (dd.mm.yy/yy, oder beliebiger Text) */
function parseAnyDate(txt){
  if (!txt) return new Date();
  const m = String(txt).match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
  if (m){
    let d = parseInt(m[1],10), mo=parseInt(m[2],10)-1, y=parseInt(m[3],10);
    if (y<100) y += 2000;
    const dt=new Date(y,mo,d);
    if (!isNaN(dt.getTime())) return dt;
  }
  const dt2 = new Date(txt);
  if (!isNaN(dt2.getTime())) return dt2;
  return new Date();
}

/* ---------------------------
   Stammdaten
---------------------------- */
const SM_LIST       = ["SM Berenbostel","SM Sarstedt","SM Stadthagen"];
const BEZIRKE_BB    = ["(Land 1) Wedemark","(Land 2) Neustadt","(Stadt) Hannover"];
const ORANGE_NUM    = ["701","702","703","686","685","675","680","691","681"];
const BUND          = ["B3","B6","B65","B442"];
const LAND          = ["L190","L191","L192","L193","L310","L360","L380","L382","L383","L390"];

/* ---------------------------
   State pro Mount-Instanz
---------------------------- */
function createState(){
  return {
    meisterei: null,
    taetigkeit: null, // Kolonne | Streckenkontrolle | Hof
    bezirk: null,
    leitung: "",
    datum: todayPretty(),
    temperatur: (Math.random()*10+10).toFixed(1),
  };
}

/* ===========================================================
   Tagesbericht-Widget
=========================================================== */
window.Tagesbericht = (function(){

  let mounted = false;
  let rootEl  = null;
  let S       = createState();   // lokaler State je Mount

  /* ---------- Styles nur 1× global injizieren ---------- */
  function injectStylesOnce(){
    if ($('#report-v10-css')) return;
    const css = `
    :root{
      --orange:#fb923c;
      --orange-strong:#f97316;
      --green:#16a34a;
      --green-dark:#15803d;
      --blue:#3b82f6;
      --bg-dark:#0f172a;
      --bg-card:rgba(255,255,255,0.06);
      --bg-inner:rgba(255,255,255,0.12);
      --border-light:rgba(255,255,255,0.15);
      --text-light:#e2e8f0;
      --text-muted:#94a3b8;
    }

    /* Grundlayout – angepasst an dunkles Dashboard */
    .rb-card{
      background:var(--bg-card);
      border:1px solid var(--border-light);
      border-radius:12px;
      padding:16px;
      box-shadow:0 4px 15px rgba(0,0,0,.3);
      color:var(--text-light);
    }
    .rb-card.inner{
      background:var(--bg-inner);
    }
    .rb-box{
      background:rgba(255,255,255,0.05);
      border:1px solid var(--border-light);
      border-radius:10px;
      padding:.6rem;
      color:var(--text-light);
    }
    .rb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
    .rb-group2{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
    .rb-btnrow{display:flex;flex-wrap:wrap;gap:.4rem}
    .rb-hide{display:none !important}
    .rb-title{color:var(--orange);margin:.2rem 0;font-weight:700}
    .rb-sub{margin:.2rem 0 1rem 0;color:var(--text-muted)}
    label{display:block;font-weight:600;color:var(--text-light);margin-bottom:.25rem}
    input,textarea{
      width:100%;
      padding:.5rem;
      border-radius:10px;
      border:1px solid var(--border-light);
      background:rgba(255,255,255,0.1);
      color:#f1f5f9;
    }
    input:focus,textarea:focus{
      outline:none;
      border-color:var(--blue);
      box-shadow:0 0 0 2px rgba(59,130,246,.3);
    }
    .rb-btn{
      cursor:pointer;
      border:1px solid var(--orange);
      background:rgba(251,146,60,0.1);
      color:var(--orange);
      padding:.45rem .9rem;
      border-radius:10px;
      font-weight:600;
      letter-spacing:.2px;
      transition:.15s;
    }
    .rb-btn:hover{filter:brightness(1.1)}
    .rb-btn.active{
      background:var(--green-dark);
      border-color:var(--green);
      color:#fff;
    }
    .rb-btn.accent{background:var(--blue);border-color:#2563eb;color:#fff}
    .rb-btn.danger{background:#dc2626;border-color:#b91c1c;color:#fff}
    .rb-btn.small{padding:.25rem .6rem;font-size:.9em}
    .rb-pill{font-size:.85rem;font-weight:700;color:var(--orange);margin-bottom:.25rem}
    .rb-blue{background:rgba(59,130,246,0.15);border-color:#2563eb;color:#bfdbfe}
    .rb-green{background:rgba(34,197,94,0.15);border-color:#16a34a;color:#bbf7d0}
    .rb-plate{background:rgba(251,146,60,0.1);border-color:var(--orange-strong);color:var(--orange)}
    .rb-role{margin-top:.5rem;display:flex;gap:1rem;align-items:center}
    .rb-radio{cursor:pointer;color:var(--text-light)}
    .rb-free{display:flex;gap:.4rem;margin-top:.5rem}
    .rb-right{text-align:right}
    .rb-mt{margin-top:.7rem}
    .fade-in{animation:fade .18s ease-out}@keyframes fade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
    `;
    const tag = h("style",{id:"report-v10-css"},css);
    document.head.appendChild(tag);
  }

  /* ---------- Mount ---------- */
  function mount(containerSelector="#mainContent"){
    if (mounted) unmount();        // sauberes Re-Mount
    injectStylesOnce();
    rootEl = $(containerSelector) || document.body;
    S = createState();
    mounted = true;
    render();
  }

  /* ---------- Unmount ---------- */
  function unmount(){
    if (!mounted) return;
    if (rootEl) rootEl.innerHTML = "";
    rootEl = null;
    mounted = false;
  }

  /* ---------- Render ---------- */
  function render(){
    if (!rootEl) return;
    rootEl.innerHTML = `
    <section class="rb-card fade-in">
      <h2 class="rb-title">🧾 Tagesbericht</h2>
      <p class="rb-sub"></p>

      <div class="rb-grid2">
        <div>
          <label for="rb-datum">Datum:</label>
          <div style="display:flex;gap:.4rem;align-items:center;">
            <input id="rb-datum" value="${S.datum}">
            <input id="rb-date-picker" type="date" style="width:38px;opacity:0;cursor:pointer;">
          </div>
        </div>
        <div>
          <label for="rb-temp">Temperatur (°C):</label>
          <input id="rb-temp" type="number" step="0.1" value="${S.temperatur}">
        </div>
      </div>

      <h3>1) Straßenmeisterei</h3>
      <div id="rb-sm" class="rb-btnrow"></div>

      <div id="rb-t-wrap" class="rb-mt rb-hide">
        <h3>2) Tätigkeit</h3>
        <div id="rb-t" class="rb-btnrow"></div>
      </div>

      <div id="rb-b-wrap" class="rb-mt rb-hide">
        <h3>3) Bezirk</h3>
        <div id="rb-b" class="rb-btnrow"></div>
      </div>

      <div id="rb-l-wrap" class="rb-mt rb-hide">
        <h3>Leitung</h3>
        <input id="rb-leitung" placeholder="Name der Leitung">
      </div>

      <div id="rb-fz-wrap" class="rb-mt rb-hide">
        <h3>🚚 Fahrzeuge</h3>
        <div class="rb-card inner">
          <div class="rb-box">
            <div class="rb-pill">Orange</div>
            <div id="rb-orange" class="rb-btnrow"></div>
          </div>
          <div class="rb-box rb-mt">
            <div class="rb-pill">Dienst</div>
            <div id="rb-dienst" class="rb-btnrow"></div>
          </div>
          <div class="rb-role">
            <label class="rb-radio"><input type="radio" name="rb-rolle" value="Beifahrer" checked> Beifahrer</label>
            <label class="rb-radio"><input type="radio" name="rb-rolle" value="Fahrer"> Fahrer</label>
          </div>
        </div>
        <button id="rb-add-vchg" class="rb-btn accent rb-mt" type="button">+ Fahrzeugwechsel</button>
        <div id="rb-vlist" class="rb-mt"></div>
      </div>

      <div id="rb-str-wrap" class="rb-mt rb-hide">
        <h3>🛣️ Straße wählen</h3>
        <div class="rb-group2">
          <div><div class="rb-pill">Bundesstraße</div><div id="rb-bund" class="rb-btnrow"></div></div>
          <div><div class="rb-pill">Landesstraße</div><div id="rb-land" class="rb-btnrow"></div></div>
        </div>
        <div class="rb-free"><input id="rb-free" placeholder="Beliebige Straße"><button id="rb-free-add" class="rb-btn">Hinzufügen</button></div>
      </div>

      <h3 class="rb-mt">🛠️ Aufgabenbeschreibung</h3>
      <div id="rb-tasklist"></div>
      <div class="rb-right rb-mt">
        <button id="rb-add-task" class="rb-btn">+ Aufgabe hinzufügen</button>
      </div>

      <button id="rb-pdf" class="rb-btn accent rb-mt">📄 PDF erstellen</button>
    </section>`;

    // Aktionen
    initHeader();
    renderSMButtons();
    renderTaetigkeitButtons();
    renderBezirkButtons();
    renderVehicleSelectors();
    renderStreetButtons();
    bindGlobalButtons();
  }

/* ---------- Kopf-Inputs ---------- */
function initHeader(){
  const dateInput = $("#rb-datum");
  const picker = $("#rb-date-picker");
  const tempInput = $("#rb-temp");

  // 🌡️ Temperatur automatisch abrufen (Open-Meteo)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        const temp = data?.current_weather?.temperature;
        if (typeof temp === "number") {
          S.temperatur = temp.toFixed(1);
          tempInput.value = S.temperatur;
        }
      } catch (err) {
        console.warn("Temperatur konnte nicht geladen werden:", err);
      }
    });
  }

  // Temperatur bleibt editierbar
  tempInput.addEventListener("input", e => {
    S.temperatur = e.target.value;
  });

  // 🗓️ Manuelle Datumseingabe (Text)
  dateInput.addEventListener("input", e => {
    S.datum = e.target.value;
  });

  // 📅 Datepicker (sichtbar als kleiner Button)
  picker.style.width = "28px";
  picker.style.height = "28px";
  picker.style.opacity = "1";
  picker.style.cursor = "pointer";
  picker.style.border = "1px solid rgba(255,255,255,0.25)";
  picker.style.borderRadius = "6px";
  picker.style.background = "rgba(255,255,255,0.1)";

  picker.addEventListener("change", e => {
    const val = e.target.value;
    if (!val) return;
    const d = new Date(val);
    if (isNaN(d)) return;
    const wd = d.toLocaleDateString("de-DE", { weekday: "long" });
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const formatted = `${wd}, ${dd}.${mm}.${yyyy}`;
    S.datum = formatted;
    dateInput.value = formatted;
  });
}

  /* ---------- 1) Meisterei ---------- */
  function renderSMButtons(){
    const row = $("#rb-sm"); row.innerHTML = "";
    SM_LIST.forEach(name=>{
      const b = h("button",{class:"rb-btn"},name);
      b.onclick = ()=>{
        activate(row,b); S.meisterei=name;

        // Tätigkeiten sichtbar
        $("#rb-t-wrap").classList.remove("rb-hide");

        // bei Wechsel reset
        S.taetigkeit=null; S.bezirk=null;
        $("#rb-tasklist").innerHTML="";
        $("#rb-l-wrap").classList.add("rb-hide");
        $("#rb-b-wrap").classList.add("rb-hide");
        $("#rb-fz-wrap").classList.add("rb-hide");
        $("#rb-str-wrap").classList.add("rb-hide");
      };
      row.appendChild(b);
    });
  }

  /* ---------- 2) Tätigkeit ---------- */
  function renderTaetigkeitButtons(){
    const row = $("#rb-t"); row.innerHTML="";
    ["Kolonne","Streckenkontrolle","Hof"].forEach(t=>{
      const b = h("button",{class:"rb-btn"},t);
      b.onclick=()=>{
        activate(row,b); S.taetigkeit=t;

        $("#rb-l-wrap").classList.remove("rb-hide");
        const isBB = (S.meisterei==="SM Berenbostel");
        const isHof = (t==="Hof");

        toggle("#rb-b-wrap", isBB && !isHof);
        toggle("#rb-fz-wrap", isBB && !isHof);
        toggle("#rb-str-wrap", isBB && !isHof);

        $("#rb-tasklist").innerHTML="";

        // Hof → direkt ersten Aufgabenblock anlegen (Überschrift + Beschreibung)
        if (isHof) addTaskBlock(null,true);
      };
      row.appendChild(b);
    });

    // Leitung input
    $("#rb-leitung").oninput = e => S.leitung = e.target.value;
  }

  /* ---------- 3) Bezirke ---------- */
  function renderBezirkButtons(){
    const row = $("#rb-b"); row.innerHTML="";
    BEZIRKE_BB.forEach(z=>{
      const b=h("button",{class:"rb-btn"},z);
      b.onclick=()=>{ activate(row,b); S.bezirk=z; };
      row.appendChild(b);
    });
  }

  /* ---------- 4) Fahrzeuge ---------- */
function renderVehicleSelectors(){
  const oRow = $("#rb-orange"), dRow = $("#rb-dienst");
  if (!oRow || !dRow) return;
  oRow.innerHTML = ""; dRow.innerHTML = "";

  // ORANGE-Fahrzeuge
  ORANGE_NUM.forEach(n=>{
    const b = h("button",{class:"rb-btn rb-plate"},`Orange-${n}`);
    b.onclick = ()=>{ 
      activate(oRow,b); 
      oRow.dataset.sel = `Orange-${n}`; 
      delete dRow.dataset.sel; 
      clear(dRow);
      $("#rb-orange-custom").value = ""; // Reset eigenes Feld
    };
    oRow.appendChild(b);
  });

  // Benutzerdefiniertes Feld für Orange
  const orangeInput = h("input", {
    id: "rb-orange-custom",
    type: "text",
    placeholder: "Eigene Nummer",
    style: "margin-top:6px;width:100%;padding:.3rem;border-radius:6px;border:1px solid #ccc;text-align:center;"
  });
  orangeInput.oninput = (e)=>{
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Nur Zahlen
    if (e.target.value) {
      oRow.dataset.sel = `Orange-${e.target.value}`;
      clear(oRow);
    }
  };
  oRow.parentNode.appendChild(orangeInput);

  // Dienst-Fahrzeuge
  const dienst = h("button",{class:"rb-btn rb-plate"},"Dienst-717");
  dienst.onclick = ()=>{ 
    activate(dRow,dienst); 
    dRow.dataset.sel = "Dienst-717"; 
    delete oRow.dataset.sel; 
    clear(oRow);
    $("#rb-dienst-custom").value = ""; 
  };
  dRow.appendChild(dienst);

  // Benutzerdefiniertes Feld für Dienst
  const dienstInput = h("input", {
    id: "rb-dienst-custom",
    type: "text",
    placeholder: "Eigene Nummer",
    style: "margin-top:6px;width:100%;padding:.3rem;border-radius:6px;border:1px solid #ccc;text-align:center;"
  });
  dienstInput.oninput = (e)=>{
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value) {
      dRow.dataset.sel = `Dienst-${e.target.value}`;
      clear(dRow);
    }
  };
  dRow.parentNode.appendChild(dienstInput);

  const add=$("#rb-add-vchg");
  if (add) add.onclick=addVehicleBlock;
}



function addVehicleBlock() {
  const vlist = $("#rb-vlist");
  const idx = vlist.children.length + 1;

  const blk = h("div", { class: "rb-card" });
  blk.innerHTML = `
    <div class="rb-row">
      <div class="rb-col">
        <h4>Orange</h4>
        <div id="rb-o-${idx}" class="rb-btn-row"></div>
      </div>
      <div class="rb-col">
        <h4>Dienst</h4>
        <div id="rb-d-${idx}" class="rb-btn-row"></div>
      </div>
    </div>
    <div class="rb-row rb-role">
      <label><input type="radio" name="rb-r-${idx}" value="Beifahrer" checked> Beifahrer</label>
      <label><input type="radio" name="rb-r-${idx}" value="Fahrer"> Fahrer</label>
    </div>
  `;
  vlist.appendChild(blk);

  // Buttons erzeugen
  const oRow = $(`#rb-o-${idx}`), dRow = $(`#rb-d-${idx}`);
  ORANGE_NUM.forEach(n => {
    const b = h("button", { class: "rb-btn rb-plate" }, `Orange-${n}`);
    b.onclick = () => { activate(oRow, b); oRow.dataset.sel = `Orange-${n}`; };
    oRow.appendChild(b);
  });

  const dienst = h("button", { class: "rb-btn rb-plate" }, "Dienst-717");
  dienst.onclick = () => { activate(dRow, dienst); dRow.dataset.sel = "Dienst-717"; };
  dRow.appendChild(dienst);

  // Benutzerdefinierte Felder (Orange & Dienst)
  const orangeInput = h("input", {
    type: "text",
    placeholder: "Eigene Nummer (Orange)",
    style: "margin-top:6px;width:100%;padding:.3rem;border-radius:6px;border:1px solid #ccc;text-align:center;"
  });
  orangeInput.oninput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value) {
      oRow.dataset.sel = `Orange-${e.target.value}`;
      clear(oRow);
    }
  };
  oRow.parentNode.appendChild(orangeInput);

  const dienstInput = h("input", {
    type: "text",
    placeholder: "Eigene Nummer (Dienst)",
    style: "margin-top:6px;width:100%;padding:.3rem;border-radius:6px;border:1px solid #ccc;text-align:center;"
  });
  dienstInput.oninput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value) {
      dRow.dataset.sel = `Dienst-${e.target.value}`;
      clear(dRow);
    }
  };
  dRow.parentNode.appendChild(dienstInput);
}



  /* ---------- 5) Straßen ---------- */
  function renderStreetButtons(){
    const b=$("#rb-bund"), l=$("#rb-land");
    if (!b || !l) return;
    b.innerHTML=""; l.innerHTML="";
    BUND.forEach(s=>b.appendChild(streetBtn(s,"rb-blue")));
    LAND.forEach(s=>l.appendChild(streetBtn(s,"rb-green")));
    $("#rb-free-add").onclick=()=>{
      if (S.meisterei!=="SM Berenbostel" || S.taetigkeit==="Hof") return;
      const v=$("#rb-free").value.trim(); if (v) addTaskBlock(v,false);
    };
  }
  function streetBtn(label, cls){
    const b=h("button",{class:`rb-btn ${cls}`},label);
    b.onclick=()=>{ if (S.meisterei!=="SM Berenbostel" || S.taetigkeit==="Hof") return; addTaskBlock(label,false); };
    return b;
  }

  /* ---------- 6) Aufgaben ---------- */
  function addTaskBlock(streetText, hofOnly){
    const blk=h("div",{class:"rb-card fade-in rb-task"});
    blk.innerHTML=`
      <label>Überschrift:</label>
      <input class="t-title" placeholder="z. B. Absicherung">

      ${hofOnly ? "" : `
        <label>Straße:</label>
        <input class="t-street" value="${streetText||""}">
        <div class="rb-grid2">
          <div><label>Abschnitt:</label><input class="t-section"></div>
          <div><label>Station:</label><input class="t-station"></div>
        </div>
        <label>RSA-Plan:</label>
        <input class="t-rsa">
      `}

      <label>${hofOnly ? "Beschreibung:" : "Nützliche Informationen:"}</label>
      <textarea class="t-info" rows="2"></textarea>

      <div class="rb-right rb-mt"><button class="rb-btn danger small">❌ Entfernen</button></div>
    `;
    $(".rb-btn.danger",blk).onclick=()=>blk.remove();
    $("#rb-tasklist").appendChild(blk);
  }

  function bindGlobalButtons(){
    $("#rb-add-task").onclick=()=>{
      const isHof = (S.taetigkeit === "Hof");
      addTaskBlock(null, isHof);
    };
    $("#rb-pdf").onclick = makePdf;
  }

/* ---------- PDF (A5 komprimiert, Seitenumbrüche blockweise) ---------- */

// Kurzhelfer (damit $ / $$ funktionieren)
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $$(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function makePdf() {
  // 🧭 Datumsparser – robust gegen alle Varianten
  function parseAnyDate(dstr) {
    if (!dstr) return new Date();
    dstr = dstr.replace(/[A-Za-zäöüÄÖÜ,]/g, "").trim();
    const parts = dstr.split(/[.\s/,-]/).filter(Boolean);
    if (parts.length >= 3) {
      const [dd, mm, yyyy] = parts;
      const y = yyyy.length === 2 ? "20" + yyyy : yyyy;
      return new Date(`${y}-${mm}-${dd}`);
    }
    const d = new Date(dstr);
    return isNaN(d) ? new Date() : d;
  }

  const d = parseAnyDate(S.datum);
  const day = d.getDate();
  const month = d.toLocaleString("de-DE", { month: "long" });
  const year = d.getFullYear();
  const wday = d.toLocaleString("de-DE", { weekday: "long" });

  const taetigkeit = S.taetigkeit || "";
  const leiter = $("#rb-leitung")?.value || "";

  const prim = $("#rb-orange")?.dataset.sel || $("#rb-dienst")?.dataset.sel || "–";
  const primRole = (document.querySelector('input[name="rb-rolle"]:checked')?.value) || "–";

  const wechsel = $$("#rb-vlist .rb-card").map(blk => {
    const o = $('[id^="rb-o-"]', blk);
    const d2 = $('[id^="rb-d-"]', blk);
    let f = "–";
    if (d2?.dataset.sel) f = d2.dataset.sel;
    if (o?.dataset.sel) f = o.dataset.sel;
    const r = ($('input[name^="rb-r-"]:checked', blk)?.value) || "–";
    return { f, r };
  });

  const tasks = $$("#rb-tasklist .rb-task").map(t => ({
    title: $(".t-title", t)?.value || "",
    street: $(".t-street", t)?.value || "",
    section: $(".t-section", t)?.value || "",
    station: $(".t-station", t)?.value || "",
    rsa: $(".t-rsa", t)?.value || "",
    info: $(".t-info", t)?.value || "",
  }));

  // 📄 Kompaktes CSS für PDF (Layout feinjustiert)
  const compactCSS = `
  @page {
    size: auto;
    margin: 6mm;
  }

  html, body {
    font-family: Arial, sans-serif;
    color: #111;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* ⬅ bleibt oben für A5 */
  }

  /* A5 Standardgröße */
  .pdf-wrapper {
    width: 148mm;
    max-height: 210mm;
    transform-origin: top center;
    margin: 0 auto;
    page-break-inside: avoid;
    transition: all 0.3s ease;
  }

  /* 🖨️ Automatische Skalierung für A4 */
  @media print {
    body {
      justify-content: center;
      align-items: flex-start; /* bleibt oben */
    }

    @media (min-width: 200mm) {
      .pdf-wrapper {
        transform: scale(1.42);
        margin-top: -25mm; /* ⬅ schiebt den Inhalt nach oben */
      }
    }
  }

  /* 🧭 Vorschau-Anpassung (auch für Bildschirmansicht A4) */
  @media screen and (min-width: 800px) {
    .pdf-wrapper {
      transform: scale(1.35);
      transform-origin: top center;
      margin-top: -20mm; /* ebenfalls leicht nach oben */
    }
  }


    

  /* Kopfbereich im dynamischen 2-Spalten-Layout */
  .hdr {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .left-date {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  .date-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1;
  }

  .m {
    color: #3b82f6;
    font-size: 18px;
    font-weight: 700;
    text-transform: capitalize;
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  .y { font-size: 11px; color: #555; }
  .d { font-size: 56px; color: #b45309; font-weight: 800; line-height: .9; margin-top: -4px; }
  .wd { font-size: 16px; font-weight: 700; margin-bottom: 4px; }

  /* Tätigkeit & Leitung dynamisch positioniert */
  .taskhead {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: center;
    margin-top: 0;
  }

  /* Standard: über Fahrzeuge-Spalte (rechte Seite) */
  .taskhead.right {
    align-items: center;
    justify-self: center;
  }

  /* Sonderfall Hof → mittig über gesamter Seite */
  .taskhead.center {
    grid-column: 1 / span 2;
    align-items: center;
    justify-self: center;
    margin-top: 4px;
  }

  .taetigkeit {
    font-size: 22px;
    font-weight: 800;
    color: #b45309;
    line-height: 1.1;
  }

  .leiter {
    font-size: 14px;
    font-weight: 500;
    color: #000;
    margin-top: 2px;
  }



    /* --- Layout danach --- */
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      align-items: start;
      margin-top: 2mm;
    }

    h2 {
      color: #3b82f6;
      border-bottom: 1.6px solid #3b82f6;
      margin: 6px 0 3px;
      font-size: 13px;
    }

    .box {
      background: #f8fafc;
      border: 1px solid #cfd4da;
      border-radius: 5px;
      padding: 5px;
      margin-bottom: 4px;
    }

    .muted { color: #555; }

    .rowline {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 6px 10px;
    }

    .task {
      break-inside: avoid-page;
      page-break-inside: avoid;
      margin-bottom: 4px;
    }

    body, .box { font-size: 11px; }
  `;



const html = `
<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Tagesbericht</title>
<style>${compactCSS}</style></head><body>
  <div class="pdf-wrapper">
    <div class="hdr">
    <div class="left-date">
      <div class="date-block">
        <div class="m">${month}<span class="y"> ${year}</span></div>
        <div class="d">${day}</div>
      </div>
      <div class="wd">${wday}</div>
    </div>
    <div class="taskhead">
      <div class="taetigkeit">${taetigkeit}</div>
      <div class="leiter">${leiter}</div>
    </div>
  </div>

  <div class="two-cols">
    <div class="col">
      <h2>Meisterei & Daten</h2>
      <div class="box">
        <b>Meisterei:</b> ${S.meisterei || "-"}<br>
        ${(S.meisterei === "SM Berenbostel" && S.taetigkeit !== "Hof") ? `<b>Bezirk:</b> ${S.bezirk || "-"}<br>` : ""}
        <b>Temperatur:</b> ${S.temperatur || "-"} °C
      </div>
    </div>
    <div class="col">
      <h2>Fahrzeuge</h2>
      <div class="box"><b>${prim}</b> – ${primRole}</div>
      ${wechsel.map(w => `
        <div class="box"><b>${w.f}</b> – ${w.r} <span class="muted">(Wechsel)</span></div>
      `).join("")}
    </div>
  </div>

  <h2>Aufgaben</h2>
  ${tasks.length ? tasks.map(t => `
    <div class="box task">
      <b>${t.title || "Aufgabe"}</b><br>
      ${S.taetigkeit === "Hof" ? `
        <div class="muted">${t.info || "-"}</div>
      ` : `
        <div class="rowline">
          <span><b>Straße:</b> ${t.street || "-"}</span>
          <span><b>Abschnitt:</b> ${t.section || "-"}</span>
          <span><b>Station:</b> ${t.station || "-"}</span>
          <span><b>RSA:</b> ${t.rsa || "-"}</span>
        </div>
        <div class="muted" style="margin-top:3px;">${t.info || "-"}</div>
      `}
    </div>
  `).join("") : `<div class="box">Noch keine Aufgaben erfasst.</div>`}
      </div> <!-- end pdf-wrapper -->
</body></html>`.trim();

  // PDF-Fenster öffnen
  const w = window.open("about:blank", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();

  // 🔧 Druckfenster stabil öffnen und danach automatisch schließen
  setTimeout(() => {
    try {
      w.focus();
      w.print();
      setTimeout(() => {
        try { w.close(); } catch {}
        window.focus();
      }, 2500);
    } catch (err) {
      console.error("PDF-Druckfehler:", err);
      try { w.close(); } catch {}
      window.focus();
    }
  }, 300);
}

  /* ---------- kleine UI-Helfer ---------- */
  function activate(container, btn){ $$(".rb-btn",container).forEach(x=>x.classList.remove("active")); btn.classList.add("active"); }
  function clear(container){ $$(".rb-btn",container).forEach(x=>x.classList.remove("active")); }
  function toggle(sel, on){ const n=$(sel); if(n) n.classList.toggle("rb-hide", !on); }

/* ---------- öffentliche API ---------- */
  return { mount, unmount, addTaskBlock };
})();


/* Optionales Auto-Mount, wenn ein Container vorhanden ist.
   Entferne das, wenn dein Router selbst Tagesbericht.mount() aufruft. */


/* Für andere Tabs:
   - Beim Öffnen des Tagesberichts:  Tagesbericht.mount('#mainContent')
   - Beim Verlassen (optional):      Tagesbericht.unmount()
*/
