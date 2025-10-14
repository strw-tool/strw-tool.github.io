/* ==========================================================================
   Straßenwärter Tool – Projekt-Dokumentation v3.2
   (Basierend auf v3.1)
   Änderungen:
   - Leitung kann einzeln gelöscht werden (v3.2 FIX)
   - Arbeitsschritte werden nach Hinzufügen sofort angezeigt (v3.2 FIX)
   - PDF-Fotos strukturierte Kachelansicht (v3.2 FIX)
   ========================================================================== */

function loadProjectDoc() {
  // Verhindere Doppel-Initialisierung
  if (document.querySelector(".project-v31")) return;

  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="project-v31 fade-in">
    <!-- Projekt-Manager -->
    <div class="pm card glass-strong">
      <div class="pm-head">
        <h2>📘 Projekt-Dokumentation Beta-Version</h2>
        <div class="pm-actions">
          <button class="btn accent" id="pmNew">+ Neues Projekt</button>
          <button class="btn" id="pmExportAll">⬇️ Alle Projekte (JSON)</button>
          <label class="filebox">⬆️ Importieren
            <input id="pmImportAll" type="file" accept="application/json">
          </label>
          <button class="btn" id="pmPDFAll">🖨️ PDF (alle Projekte)</button>
        </div>
      </div>
      <div id="pmList" class="pm-list"></div>
    </div>

    <!-- Schnellzugriff -->
    <div class="quickbar">
      <button class="qbtn" data-pane="p-general">Allgemein</button>
      <button class="qbtn" data-pane="p-members">Mitglieder</button>
      <button class="qbtn" data-pane="p-materials">Materialien</button>
      <button class="qbtn" data-pane="p-tools">Werkzeuge/Fahrzeuge</button>
      <button class="qbtn" data-pane="p-photos">Fotodoku</button>
      <button class="qbtn" data-pane="p-time">Zeit & Schritte</button>
      <button class="qbtn" data-pane="p-export">Export</button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab active" data-pane="p-general">Allgemein</button>
      <button class="tab" data-pane="p-members">Mitglieder</button>
      <button class="tab" data-pane="p-materials">Materialien</button>
      <button class="tab" data-pane="p-tools">Werkzeuge/Fahrzeuge</button>
      <button class="tab" data-pane="p-photos">Fotodoku</button>
      <button class="tab" data-pane="p-time">Zeit & Schritte</button>
      <button class="tab" data-pane="p-export">Export</button>
    </div>

    <!-- Allgemein -->
    <div class="pane show" id="p-general">
      <div class="card glass-strong">
        <div class="row gap wrap">
          <h3 class="grow">🗂️ Aktives Projekt: <span id="activeProjectName">–</span></h3>
          <div><label class="muted">Projekt wählen:</label>
            <select id="pmSelector"></select>
          </div>
        </div>

        <div class="grid">
          <label>Projektname
            <input id="projName" type="text" placeholder="z. B. Deckensanierung L380">
          </label>
          <label>Projektnummer
            <input id="projNumber" type="text" placeholder="z. B. 23-017">
          </label>

          <label>Ort
            <select id="projOrt">
              <option value="">– bitte auswählen –</option>
              <option>Land 1</option>
              <option>Land 2</option>
              <option>Stadt</option>
            </select>
          </label>
          <label>Beginn (Datum)
            <input id="projStart" type="date">
          </label>
          <label>Ende (Datum)
            <input id="projEnd" type="date">
          </label>

          <label>Straße
            <input id="projStrasse" type="text" placeholder="z. B. L380">
          </label>
          <label>Abschnitt
            <input id="projAbschnitt" type="text" placeholder="z. B. km 3,5 – 5,2">
          </label>
          <label>Station
            <input id="projStation" type="text" placeholder="z. B. 3+500">
          </label>
        </div>

        <label>Beschreibung / Ablauf</label>
        <textarea id="projDesc" rows="6" placeholder="Kurzbeschreibung, Ziele, Ablauf, Besonderheiten …"></textarea>

        <div class="inline-info">
          <div><b>Leitung:</b> <span id="leadersBadge">–</span></div>
          <div><b>Mitglieder gesamt:</b> <span id="membersCount">0</span></div>
        </div>

        <div class="row gap mt">
          <button class="btn accent" id="saveGeneral">💾 Speichern</button>
        </div>
      </div>
    </div>

    <!-- Mitglieder -->
    <div class="pane" id="p-members">
      <div class="card glass-strong">
        <h3>👥 Mitgliederliste & Leitung</h3>
        <div class="row gap">
          <input id="memName" type="text" placeholder="Name eingeben…">
          <button class="btn accent" id="memAdd">+ Hinzufügen</button>
        </div>

        <div class="leaders card glass-light">
          <h4>Leitungsteam</h4>
          <div id="leadersList" class="badges"></div>
        </div>

        <div class="muted sm">Mitglieder, die als Leitung markiert sind, erscheinen nur im Leitungsteam.</div>
        <div id="memList" class="list"></div>
      </div>
    </div>

    <!-- Materialien -->
    <div class="pane" id="p-materials">
      <div class="card glass-strong">
        <h3>🧱 Materialliste (Soll / Ist / Abweichung)</h3>

        <div class="row wrap gap">
          <input id="matName" type="text" placeholder="Material (z. B. AC 11)">
          <span class="unit-field">
            <select id="matUnitSel">
              <option value="">– Einheit wählen –</option>
              <option value="t">t (Tonnen)</option>
              <option value="kg">kg (Kilogramm)</option>
              <option value="m²">m² (Quadratmeter)</option>
              <option value="m³">m³ (Kubikmeter)</option>
              <option value="m">m (Meter)</option>
              <option value="Stk">Stk (Stück)</option>
              <option value="L">L (Liter)</option>
              <option value="Psch">Psch (Pauschal)</option>
              <option value="km">km (Kilometer)</option>
              <option value="Sack">Sack</option>
              <option value="Eimer">Eimer</option>
              <option value="Andere">Andere…</option>
            </select>
            <input id="matUnitCustom" class="hidden" type="text" placeholder="Eigene Einheit…">
          </span>
          <input id="matQtyPlan" type="number" step="0.01" placeholder="Menge Soll">
          <input id="matCostPlan" type="number" step="0.01" placeholder="€/E Soll">
          <input id="matQtyReal" type="number" step="0.01" placeholder="Menge Ist">
          <input id="matCostReal" type="number" step="0.01" placeholder="€/E Ist">
          <label class="chk"><input id="matNeeded" type="checkbox"><span>Benötigt?</span></label>
          <button class="btn accent" id="matAdd">+ Material</button>
        </div>

        <div class="table-wrap">
          <table class="tbl" id="matTable">
            <thead>
              <tr>
                <th>Material</th><th>Einheit</th>
                <th>Menge Soll</th><th>€/E Soll</th><th>Summe Soll</th>
                <th>Menge Ist</th><th>€/E Ist</th><th>Summe Ist</th>
                <th>Δ %</th><th>Benötigt</th><th></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="right"><b>Gesamt Soll:</b></td>
                <td id="sumPlan">0,00 €</td>
                <td colspan="3" class="right"><b>Gesamt Ist:</b></td>
                <td id="sumReal" colspan="2">0,00 €</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <!-- Werkzeuge/Fahrzeuge + RSA/VZ -->
    <div class="pane" id="p-tools">
      <div class="card glass-strong">
        <h3>🧰 Werkzeuge</h3>
        <div class="row gap">
          <input id="toolName" type="text" placeholder="z. B. Rüttelplatte">
          <button class="btn accent" id="toolAdd">+ Werkzeug</button>
        </div>
        <div id="toolList" class="list"></div>

        <h3 class="mt">🚛 Fahrzeuge</h3>
        <div class="row gap">
          <input id="vehName" type="text" placeholder="Fahrzeug (z. B. Lkw 7,5t)">
          <input id="vehPlate" type="text" placeholder="Kennzeichen (z. B. H-AB 1234)">
          <button class="btn accent" id="vehAdd">+ Fahrzeug</button>
        </div>
        <div id="vehList" class="list"></div>

        <div class="grid mt">
          <div class="card glass-light">
            <h4>📐 RSA-Pläne</h4>
            <div class="row gap">
              <input id="rsaText" type="text" placeholder="z. B. B I/2-1">
              <button class="btn" id="rsaAdd">+ Hinzufügen</button>
            </div>
            <div id="rsaList" class="chips"></div>
          </div>

          <div class="card glass-light">
            <h4>🚦 VZ-Zeichen</h4>
            <div class="row gap">
              <input id="vzText" type="text" placeholder="z. B. VZ 123 'Baustelle'">
              <input id="vzCount" type="number" min="1" value="1" style="max-width:100px">
              <button class="btn" id="vzAdd">+ Hinzufügen</button>
            </div>
            <div id="vzList" class="chips"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fotodoku -->
    <div class="pane" id="p-photos">
      <div class="card glass-strong">
        <h3>📷 Fotodokumentation</h3>
        <h4>Kacheln (Galerie)</h4>
        <div class="row gap">
          <input id="galInput" type="file" accept="image/*" multiple>
          <button class="btn" id="galClear">🗑️ Galerie leeren</button>
        </div>
        <div id="galPreview" class="gallery tiles"></div>

        <hr class="sep">
        <h4>Vorher / Nachher – mehrere Paare</h4>
        <div class="row gap">
          <button class="btn accent" id="baAdd">+ Vorher/Nachher-Paar</button>
        </div>
        <div id="baList" class="ba-list"></div>
      </div>
    </div>

    <!-- Zeit & Schritte -->
    <div class="pane" id="p-time">
      <div class="card glass-strong">
        <h3>⏱️ Zeitkalkulation & Arbeitsschritte</h3>

        <div class="grid">
          <label>Gesamt – Soll (h)
            <input id="timePlan" type="number" step="0.1" placeholder="z. B. 6.5">
          </label>
          <label>Gesamt – Ist (h)
            <input id="timeReal" type="number" step="0.1" placeholder="z. B. 7.25">
          </label>
          <div class="inline-info"><b>Abweichung gesamt:</b> <span id="timeDelta">0,00 h</span></div>
        </div>

        <h4 class="mt-sm">Arbeitsschritte (+ eigene Zeit)</h4>
        <div class="row gap">
          <input id="stepText" type="text" placeholder="z. B. Fräsen">
          <input id="stepPlan" type="number" step="0.1" placeholder="Soll h" style="max-width:120px">
          <input id="stepReal" type="number" step="0.1" placeholder="Ist h" style="max-width:120px">
          <button class="btn accent" id="stepAdd">+ Schritt</button>
        </div>
        <div id="stepsList" class="list checklist"></div>

        <!-- Nebenrechner -->
        <div class="card glass-light mini-timecalc">
          <div class="section-title"><h4>⏱️ Zeit-Nebenrechner</h4></div>
          <div class="timecalc-grid">
            <label>Beginn:</label>
            <input type="time" id="timeStart">
            <label>Ende:</label>
            <input type="time" id="timeEnd">
            <button id="btnTimeCalc" class="btn accent">=</button>
            <p id="timeResult" class="mini-result"></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Export -->
    <div class="pane" id="p-export">
      <div class="card glass-strong">
        <h3>📦 Export / Import (aktuelles Projekt)</h3>
        <div class="row wrap gap">
          <button class="btn accent" id="btnExportJSON">⬇️ JSON exportieren</button>
          <label class="filebox">⬆️ JSON importieren
            <input id="importJSON" type="file" accept="application/json">
          </label>
          <button class="btn" id="btnPDF">🖨️ PDF exportieren</button>
        </div>
        <p class="muted">Export enthält alle Inhalte (Bilder als Data-URL). Import stellt das Projekt wieder her.</p>
      </div>
    </div>
  </section>
  `;

  /* ===================== STATE & HELPERS ===================== */
  const LS_KEY = "project_doc_v31";
  const E = id => document.getElementById(id);
  const num = v => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const toPngData = file => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        c.getContext("2d").drawImage(img, 0, 0);
        res(c.toDataURL("image/png"));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });

  function defaultProject() {
    return {
      id: uid(),
      general: { name:"", number:"", ort:"", start:"", end:"", strasse:"", abschnitt:"", station:"", desc:"" },
      members: [], // {id,name,leader}
      materials: [], // {id,name,unit,qtyPlan,costPlan,qtyReal,costReal,needed}
      tools: [], // {id,name,used}
      vehicles: [], // {id,name,plate}
      rsa: [], // {id,text}
      vz: [], // {id,text,count}
      gallery: [], // [dataURL]
      beforeAfter: [], // [{id,before,after}]
      time: { plan:"", real:"" },
      steps: [] // {id,text,done,plan,real}
    };
  }

  function loadStore() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (s && Array.isArray(s.projects) && s.projects.length) return s;
    } catch {}
    return { projects: [ defaultProject() ], currentId: null };
  }

  function saveStore() { localStorage.setItem(LS_KEY, JSON.stringify(store)); }

  let store = loadStore();
  if (!store.currentId) store.currentId = store.projects[0].id;

  const current = () => store.projects.find(p => p.id === store.currentId);

  /* ===================== PROJECT MANAGER ===================== */
  function renderPMList() {
    const list = E("pmList");
    if (!store.projects.length) {
      list.innerHTML = `<p class="muted">Noch keine Projekte vorhanden.</p>`;
      return;
    }
    list.innerHTML = store.projects.map((p, i) => {
      const g = p.general || {};
      const leaders = (p.members || []).filter(m => m.leader).map(m => m.name).join(", ") || "–";
      return `
        <div class="pm-item ${p.id===store.currentId?'active':''}">
          <div class="pm-index">${i+1}.</div>
          <div class="pm-info">
            <div class="pm-title">${g.name || "Unbenanntes Projekt"}</div>
            <div class="pm-meta">
              <span>Nr: ${g.number||"–"}</span>
              <span>Ort: ${g.ort||"–"}</span>
              <span>Zeitraum: ${g.start||"–"} – ${g.end||"–"}</span>
              <span>Leitung: ${leaders}</span>
            </div>
          </div>
          <div class="pm-btns">
            <button class="btn" data-edit="${p.id}">Bearbeiten</button>
            <button class="btn danger" data-del="${p.id}">Löschen</button>
          </div>
        </div>
      `;
    }).join("");

    list.querySelectorAll("[data-edit]").forEach(b=>{
      b.onclick = () => { store.currentId = b.dataset.edit; saveStore(); renderAll(); };
    });
    list.querySelectorAll("[data-del]").forEach(b=>{
      b.onclick = () => {
        const id = b.dataset.del;
        store.projects = store.projects.filter(p => p.id !== id);
        if (!store.projects.length) store.projects.push(defaultProject());
        if (!store.projects.find(p => p.id === store.currentId)) store.currentId = store.projects[0].id;
        saveStore(); renderAll();
      };
    });
  }

  function renderPMSelector() {
    const sel = E("pmSelector");
    sel.innerHTML = store.projects.map(p => {
      const name = p.general?.name || "Unbenannt";
      return `<option value="${p.id}" ${p.id===store.currentId?'selected':''}>${name}</option>`;
    }).join("");
    sel.onchange = () => { store.currentId = sel.value; saveStore(); renderAll(); };
  }

  E("pmNew").onclick = () => {
    const p = defaultProject();
    store.projects.push(p);
    store.currentId = p.id;
    saveStore();
    renderAll();
  };

  /* ===================== GENERAL & MEMBERS ===================== */
  function renderGeneral() {
    const p = current();
    const g = p.general;
    E("activeProjectName").textContent = g.name || "–";
    E("projName").value = g.name || "";
    E("projNumber").value = g.number || "";
    E("projOrt").value = g.ort || "";
    E("projStart").value = g.start || "";
    E("projEnd").value = g.end || "";
    E("projStrasse").value = g.strasse || "";
    E("projAbschnitt").value = g.abschnitt || "";
    E("projStation").value = g.station || "";
    E("projDesc").value = g.desc || "";

    const leaders = (p.members||[]).filter(m=>m.leader).map(m=>m.name);
    E("leadersBadge").textContent = leaders.length ? leaders.join(", ") : "–";
    E("membersCount").textContent = (p.members||[]).length;
  }

  E("saveGeneral").onclick = () => {
    const p = current();
    p.general = {
      name: E("projName").value.trim(),
      number: E("projNumber").value.trim(),
      ort: E("projOrt").value,
      start: E("projStart").value,
      end: E("projEnd").value,
      strasse: E("projStrasse").value.trim(),
      abschnitt: E("projAbschnitt").value.trim(),
      station: E("projStation").value.trim(),
      desc: E("projDesc").value.trim(),
    };
    saveStore(); renderPMList(); renderPMSelector(); renderGeneral();
  };

  // Mitglieder
  function renderMembers() {
    const p = current();
    const box = E("memList"); box.innerHTML = "";
    (p.members||[]).filter(m=>!m.leader).forEach(m=>{
      const row = document.createElement("div"); row.className = "item";
      row.innerHTML = `
        <input class="mem-input" value="${m.name}" data-id="${m.id}">
        <label class="chk"><input type="checkbox" ${m.leader?"checked":""} data-leader="${m.id}"><span>Leitung</span></label>
        <button class="btn danger" data-del="${m.id}">🗑</button>
      `;
      box.appendChild(row);
    });

    // 🧩 v3.2 FIX #1 – Leitung kann einzeln gelöscht werden
    const leadersWrap = E("leadersList"); leadersWrap.innerHTML = "";
    (p.members||[]).filter(m=>m.leader).forEach(m=>{
      const b = document.createElement("span");
      b.className = "badge";
      b.innerHTML = `${m.name} <button class="badge-x" data-unlead="${m.id}">✕</button>`;
      leadersWrap.appendChild(b);
    });

    // Events
    leadersWrap.querySelectorAll("[data-unlead]").forEach(btn=>{
      btn.onclick = () => {
        const mm = p.members.find(x=>x.id===btn.dataset.unlead);
        if (mm) { mm.leader = false; saveStore(); renderMembers(); renderPMList(); renderGeneral(); }
      };
    });

    box.querySelectorAll(".mem-input").forEach(inp=>{
      inp.oninput = () => {
        const mm = p.members.find(x=>x.id===inp.dataset.id);
        if (mm) { mm.name = inp.value; saveStore(); renderPMList(); renderGeneral(); }
      };
    });
    box.querySelectorAll("[data-leader]").forEach(ch=>{
      ch.onchange = () => {
        const mm = p.members.find(x=>x.id===ch.dataset.leader);
        if (mm) { mm.leader = ch.checked; saveStore(); renderMembers(); renderPMList(); renderGeneral(); }
      };
    });
    box.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick = () => {
        p.members = p.members.filter(x=>x.id!==btn.dataset.del);
        saveStore(); renderMembers(); renderPMList(); renderGeneral();
      };
    });
  }

  E("memAdd").onclick = () => {
    const name = E("memName").value.trim(); if (!name) return;
    const p = current();
    p.members.push({id:uid(), name, leader:false});
    E("memName").value=""; saveStore(); renderMembers(); renderPMList(); renderGeneral();
  };

  /* ===================== MATERIALS / TOOLS / VEHICLES ===================== */
  function planSum(m){ return num(m.qtyPlan)*num(m.costPlan); }
  function realSum(m){ return num(m.qtyReal)*num(m.costReal); }
  function deviationPct(m){
    const ps=planSum(m), rs=realSum(m);
    if (ps===0 && rs===0) return 0;
    if (ps===0 && rs>0) return 100;
    return ((rs-ps)/ps)*100;
  }

  // (… hier geht’s weiter mit Materiallisten, Tools, Vehicles, etc. – unverändert …)
  // Export/Import/ PDF – ALLE Projekte
  E("pmExportAll").onclick = () => {
    const blob = new Blob([JSON.stringify(store)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Projekte_Dokumentation.json";
    a.click();
  };

  E("pmImportAll").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data && Array.isArray(data.projects)) {
        store = data;
        if (!store.projects.length) store.projects = [ defaultProject() ];
        if (!store.currentId || !store.projects.find(p=>p.id===store.currentId)) store.currentId = store.projects[0].id;
        saveStore(); renderAll(); alert("✅ Projekte importiert.");
      } else throw 0;
    } catch { alert("❌ Ungültige oder beschädigte Datei."); }
    e.target.value = "";
  };

  E("pmPDFAll").onclick = () => exportPDF(true);

  /* ===================== TABS (delegiert, 1 Listener) ===================== */
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest(".project-v31 .tab, .project-v31 .qbtn");
    if (!btn || !btn.dataset.pane) return;
    const pane = btn.dataset.pane;
    document.querySelectorAll(".project-v31 .tab").forEach(b=>b.classList.toggle("active", b.dataset.pane===pane));
    document.querySelectorAll(".project-v31 .pane").forEach(p=>p.classList.toggle("show", p.id===pane));
  });

  /* ===================== MATERIALIEN ===================== */
  function renderMaterials(){
    const p = current();
    const tbody = E("matTable").querySelector("tbody");
    tbody.innerHTML="";
    let sumP=0, sumR=0;

    (p.materials||[]).forEach(mat=>{
      const pSum = planSum(mat), rSum = realSum(mat);
      sumP += pSum; sumR += rSum;
      const dev = deviationPct(mat);
      const devColor = dev>0 ? "#ef4444" : "#10b981";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input class="cell" data-id="${mat.id}" data-k="name"  value="${mat.name||""}"></td>
        <td>
          <select class="cell sel unit-sel" data-id="${mat.id}" data-k="unit">
            ${unitOptions(mat.unit)}
          </select>
          <input class="cell unit-custom ${showCustom(mat.unit)?'':'hidden'}" data-id="${mat.id}" data-k="unitCustom" placeholder="Eigene Einheit…" value="${showCustom(mat.unit)?(mat.unit||''):''}">
        </td>
        <td><input class="cell num" data-id="${mat.id}" data-k="qtyPlan" value="${mat.qtyPlan||""}"></td>
        <td><input class="cell num" data-id="${mat.id}" data-k="costPlan" value="${mat.costPlan||""}"></td>
        <td>${pSum.toLocaleString("de-DE",{minimumFractionDigits:2})} €</td>
        <td><input class="cell num" data-id="${mat.id}" data-k="qtyReal" value="${mat.qtyReal||""}"></td>
        <td><input class="cell num" data-id="${mat.id}" data-k="costReal" value="${mat.costReal||""}"></td>
        <td>${rSum.toLocaleString("de-DE",{minimumFractionDigits:2})} €</td>
        <td style="color:${devColor}">${dev.toFixed(1).replace(".",",")} %</td>
        <td class="center"><input type="checkbox" ${mat.needed?"checked":""} data-need="${mat.id}"></td>
        <td><button class="btn danger" data-del="${mat.id}">🗑</button></td>
      `;
      tbody.appendChild(tr);
    });

    E("sumPlan").textContent = sumP.toLocaleString("de-DE",{minimumFractionDigits:2})+" €";
    E("sumReal").textContent = sumR.toLocaleString("de-DE",{minimumFractionDigits:2})+" €";

    // Events
    tbody.querySelectorAll(".cell").forEach(inp=>{
      inp.oninput = () => {
        const p = current();
        const m = p.materials.find(x=>x.id===inp.dataset.id);
        if (!m) return;
        const key = inp.dataset.k;
        m[key] = inp.value;

        // Wenn unitCustom genutzt wird, setze m.unit = custom
        if (inp.classList.contains("unit-custom")) m.unit = inp.value;

        saveStore(); renderMaterials();
      };
    });

    tbody.querySelectorAll(".unit-sel").forEach(sel=>{
      sel.onchange = () => {
        const p = current();
        const m = p.materials.find(x=>x.id===sel.dataset.id);
        if (!m) return;
        const v = sel.value;
        const ci = sel.parentElement.querySelector(".unit-custom");
        if (v === "Andere") {
          ci.classList.remove("hidden"); ci.value = ""; ci.focus(); m.unit = "";
        } else {
          if (ci) { ci.classList.add("hidden"); ci.value=""; }
          m.unit = v;
        }
        saveStore(); renderMaterials();
      };
    });

    tbody.querySelectorAll("[data-need]").forEach(ch=>{
      ch.onchange = () => {
        const p = current();
        const m = p.materials.find(x=>x.id===ch.dataset.need);
        if (m) { m.needed = ch.checked; saveStore(); }
      };
    });

    tbody.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick = () => {
        const p = current();
        p.materials = p.materials.filter(x=>x.id!==btn.dataset.del);
        saveStore(); renderMaterials();
      };
    });
  }

  function unitOptions(val){
    const opts = ["","t","kg","m²","m³","m","Stk","L","Psch","km","Sack","Eimer","Andere"];
    return opts.map(o=>{
      const show = (o==="Andere") ? (!val || (!opts.includes(val))) : (o===val);
      const sel = show ? 'selected' : '';
      const label = o==="" ? "– Einheit wählen –"
        : o==="Psch" ? "Psch (Pauschal)"
        : o==="Andere" ? "Andere…"
        : o;
      return `<option value="${o}" ${sel}>${label}</option>`;
    }).join("");
  }
  function showCustom(val){
    const standard = ["","t","kg","m²","m³","m","Stk","L","Psch","km","Sack","Eimer","Andere"];
    return val && !standard.includes(val);
  }

  E("matUnitSel").addEventListener("change", ()=>{
    const sel = E("matUnitSel");
    const custom = E("matUnitCustom");
    if (sel.value === "Andere") { custom.classList.remove("hidden"); custom.focus(); }
    else { custom.classList.add("hidden"); custom.value=""; }
  });

  E("matAdd").onclick = () => {
    const p = current();
    const unitSel = E("matUnitSel");
    const unitCustom = E("matUnitCustom");
    const unitVal = unitSel.value === "Andere" ? (unitCustom.value.trim() || "Einheit") : unitSel.value;

    const name = E("matName").value.trim();
    if (!name) return;

    p.materials.push({
      id: uid(),
      name,
      unit: unitVal,
      qtyPlan: E("matQtyPlan").value,
      costPlan: E("matCostPlan").value,
      qtyReal: E("matQtyReal").value,
      costReal: E("matCostReal").value,
      needed: E("matNeeded").checked
    });

    ["matName","matQtyPlan","matCostPlan","matQtyReal","matCostReal"].forEach(id=>E(id).value="");
    unitSel.value = ""; unitCustom.value=""; unitCustom.classList.add("hidden");
    E("matNeeded").checked=false;
    saveStore(); renderMaterials();
  };

  /* ===================== WERKZEUGE / FAHRZEUGE / RSA / VZ ===================== */
  function renderTools(){
    const p = current();

    const tlist = E("toolList"); tlist.innerHTML="";
    (p.tools||[]).forEach(t=>{
      const row = document.createElement("div"); row.className="item";
      row.innerHTML = `
        <input class="tool-input" value="${t.name}" data-id="${t.id}">
        <label class="chk"><input type="checkbox" ${t.used?"checked":""} data-used="${t.id}"><span>benutzt</span></label>
        <button class="btn danger" data-del="${t.id}">🗑</button>
      `;
      tlist.appendChild(row);
    });
    tlist.querySelectorAll(".tool-input").forEach(inp=>{
      inp.oninput = ()=>{ const t=p.tools.find(x=>x.id===inp.dataset.id); if (t){ t.name=inp.value; saveStore(); } };
    });
    tlist.querySelectorAll("[data-used]").forEach(ch=>{
      ch.onchange=()=>{ const t=p.tools.find(x=>x.id===ch.dataset.used); if (t){ t.used=ch.checked; saveStore(); } };
    });
    tlist.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick=()=>{ p.tools=p.tools.filter(x=>x.id!==btn.dataset.del); saveStore(); renderTools(); };
    });

    const vlist = E("vehList"); vlist.innerHTML="";
    (p.vehicles||[]).forEach(v=>{
      const row = document.createElement("div"); row.className="item";
      row.innerHTML = `
        <input class="veh-name" data-id="${v.id}" value="${v.name||""}" placeholder="Fahrzeug">
        <input class="veh-plate" data-id="${v.id}" value="${v.plate||""}" placeholder="Kennzeichen">
        <button class="btn danger" data-delv="${v.id}">🗑</button>
      `;
      vlist.appendChild(row);
    });
    vlist.querySelectorAll(".veh-name").forEach(inp=>{
      inp.oninput=()=>{ const v=p.vehicles.find(x=>x.id===inp.dataset.id); if (v){ v.name=inp.value; saveStore(); } };
    });
    vlist.querySelectorAll(".veh-plate").forEach(inp=>{
      inp.oninput=()=>{ const v=p.vehicles.find(x=>x.id===inp.dataset.id); if (v){ v.plate=inp.value; saveStore(); } };
    });
    vlist.querySelectorAll("[data-delv]").forEach(btn=>{
      btn.onclick=()=>{ p.vehicles=p.vehicles.filter(x=>x.id!==btn.dataset.delv); saveStore(); renderTools(); };
    });

    const rlist = E("rsaList"); rlist.innerHTML="";
    (p.rsa||[]).forEach(r=>{
      const chip = document.createElement("span"); chip.className="chip";
      chip.innerHTML = `${r.text}<button class="chip-x" data-rdel="${r.id}">✕</button>`;
      rlist.appendChild(chip);
    });
    rlist.querySelectorAll("[data-rdel]").forEach(x=>{
      x.onclick=()=>{ p.rsa = p.rsa.filter(i=>i.id!==x.dataset.rdel); saveStore(); renderTools(); };
    });

    const vzlist = E("vzList"); vzlist.innerHTML="";
    (p.vz||[]).forEach(v=>{
      const chip = document.createElement("span"); chip.className="chip";
      chip.innerHTML = `${v.text} ×${v.count}<button class="chip-x" data-vdel="${v.id}">✕</button>`;
      vzlist.appendChild(chip);
    });
    vzlist.querySelectorAll("[data-vdel]").forEach(x=>{
      x.onclick=()=>{ p.vz = p.vz.filter(i=>i.id!==x.dataset.vdel); saveStore(); renderTools(); };
    });
  }

  E("toolAdd").onclick = () => {
    const p = current();
    const name = E("toolName").value.trim(); if (!name) return;
    p.tools.push({id:uid(), name, used:false});
    E("toolName").value=""; saveStore(); renderTools();
  };
  E("vehAdd").onclick = () => {
    const p = current();
    const name = E("vehName").value.trim(), plate = E("vehPlate").value.trim();
    if (!name && !plate) return;
    p.vehicles.push({id:uid(), name, plate});
    E("vehName").value=""; E("vehPlate").value=""; saveStore(); renderTools();
  };
  E("rsaAdd").onclick = () => {
    const p = current();
    const text = E("rsaText").value.trim(); if (!text) return;
    p.rsa.push({id:uid(), text}); E("rsaText").value=""; saveStore(); renderTools();
  };
  E("vzAdd").onclick = () => {
    const p = current();
    const text = E("vzText").value.trim(); if (!text) return;
    const count = Math.max(1, parseInt(E("vzCount").value||"1",10));
    p.vz.push({id:uid(), text, count}); E("vzText").value=""; E("vzCount").value=1; saveStore(); renderTools();
  };

  /* ===================== GALERIE ===================== */
  function renderGallery() {
    const p = current();
    const wrap = E("galPreview"); wrap.innerHTML="";
    (p.gallery||[]).forEach((src,i)=>{
      const fig = document.createElement("figure"); fig.className="tile";
      fig.innerHTML = `<img src="${src}"><figcaption><button class="btn danger" data-gdel="${i}">🗑</button></figcaption>`;
      wrap.appendChild(fig);
    });
    wrap.querySelectorAll("[data-gdel]").forEach(btn=>{
      btn.onclick=()=>{ p.gallery.splice(parseInt(btn.dataset.gdel,10),1); saveStore(); renderGallery(); };
    });
  }
  E("galInput").addEventListener("change", async (e)=>{
    const p = current();
    for (const f of e.target.files) p.gallery.push(await toPngData(f));
    e.target.value=""; saveStore(); renderGallery();
  });
  E("galClear").onclick = ()=>{ const p=current(); p.gallery=[]; saveStore(); renderGallery(); };

  /* ===================== VORHER / NACHHER ===================== */
  function renderBA(){
    const p = current();
    const list = E("baList"); list.innerHTML="";
    (p.beforeAfter||[]).forEach(pair=>{
      const el=document.createElement("div"); el.className="ba-item card glass-light";
      el.innerHTML = `
        <div class="row wrap gap">
          <label class="filebox">Vorher<input data-bf="${pair.id}" type="file" accept="image/*"></label>
          <label class="filebox">Nachher<input data-af="${pair.id}" type="file" accept="image/*"></label>
          <button class="btn danger" data-badel="${pair.id}">🗑 Paar</button>
        </div>
        <div class="ba-preview">
          <div><span>Vorher</span><img id="b-prev-${pair.id}" src="${pair.before||""}"></div>
          <div><span>Nachher</span><img id="a-prev-${pair.id}" src="${pair.after||""}"></div>
        </div>
      `;
      list.appendChild(el);

      el.querySelector("[data-bf]").onchange = async (ev)=>{
        const f=ev.target.files[0]; if(!f) return;
        const pjt = current(); const pr = pjt.beforeAfter.find(x=>x.id===pair.id);
        pr.before = await toPngData(f); saveStore(); el.querySelector("#b-prev-"+pair.id).src=pr.before;
      };
      el.querySelector("[data-af]").onchange = async (ev)=>{
        const f=ev.target.files[0]; if(!f) return;
        const pjt = current(); const pr = pjt.beforeAfter.find(x=>x.id===pair.id);
        pr.after = await toPngData(f); saveStore(); el.querySelector("#a-prev-"+pair.id).src=pr.after;
      };
      el.querySelector("[data-badel]").onclick = ()=>{
        const pjt = current();
        pjt.beforeAfter = pjt.beforeAfter.filter(x=>x.id!==pair.id);
        saveStore(); renderBA();
      };
    });
  }
  E("baAdd").onclick = ()=>{ const p=current(); p.beforeAfter.push({id:uid(), before:"", after:""}); saveStore(); renderBA(); };

  /* ===================== ZEIT & SCHRITTE ===================== */
  function renderTime(){
    const p = current();
    E("timePlan").value = p.time.plan || "";
    E("timeReal").value = p.time.real || "";
    const d = num(p.time.real) - num(p.time.plan);
    E("timeDelta").textContent = `${d.toFixed(2).replace(".",",")} h`;
  }
  E("timePlan").oninput = ()=>{ const p=current(); p.time.plan = E("timePlan").value; saveStore(); renderTime(); };
  E("timeReal").oninput = ()=>{ const p=current(); p.time.real = E("timeReal").value; saveStore(); renderTime(); };

  function renderSteps(){
    const p = current();
    const box = E("stepsList"); box.innerHTML="";
    (p.steps||[]).forEach(s=>{
      const d = num(s.real)-num(s.plan);
      const row=document.createElement("div"); row.className="item";
      row.innerHTML=`
        <label class="chk"><input type="checkbox" ${s.done?"checked":""} data-done="${s.id}"><span></span></label>
        <input class="step-input" value="${s.text}" data-id="${s.id}">
        <input class="step-plan" type="number" step="0.1" value="${s.plan||""}" data-id="${s.id}" data-k="plan" placeholder="Soll h">
        <input class="step-real" type="number" step="0.1" value="${s.real||""}" data-id="${s.id}" data-k="real" placeholder="Ist h">
        <span class="badge ${d>0?"bad-red":"bad-green"}">Δ ${d.toFixed(2).replace(".",",")} h</span>
        <button class="btn danger" data-del="${s.id}">🗑</button>
      `;
      box.appendChild(row);
    });
    box.querySelectorAll(".step-input").forEach(inp=>{
      inp.oninput=()=>{ const pjt=current(); const s=pjt.steps.find(x=>x.id===inp.dataset.id); s.text=inp.value; saveStore(); };
    });
    box.querySelectorAll(".step-plan,.step-real").forEach(inp=>{
      inp.oninput=()=>{ const pjt=current(); const s=pjt.steps.find(x=>x.id===inp.dataset.id); s[inp.dataset.k]=inp.value; saveStore(); renderSteps(); };
    });
    box.querySelectorAll("[data-done]").forEach(ch=>{
      ch.onchange=()=>{ const pjt=current(); const s=pjt.steps.find(x=>x.id===ch.dataset.done); s.done=ch.checked; saveStore(); };
    });
    box.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick=()=>{ const pjt=current(); pjt.steps = pjt.steps.filter(x=>x.id!==btn.dataset.del); saveStore(); renderSteps(); };
    });
  }

  // v3.2 FIX – Nach Hinzufügen sofort anzeigen + Zeit updaten + scrollen
  E("stepAdd").onclick = ()=>{
    const p = current();
    const text = E("stepText").value.trim(); if (!text) return;
    p.steps.push({id:uid(), text, done:false, plan:E("stepPlan").value, real:E("stepReal").value});
    ["stepText","stepPlan","stepReal"].forEach(id=>E(id).value="");
    saveStore(); renderSteps(); renderTime();
    setTimeout(()=>{ E("stepsList").lastElementChild?.scrollIntoView({behavior:"smooth",block:"end"}); }, 50);
  };

  // Nebenrechner
  E("btnTimeCalc").addEventListener("click", () => {
    const start = E("timeStart").value;
    const end = E("timeEnd").value;
    const out = E("timeResult");
    if (!start || !end) { out.textContent="Bitte Start und Ende eingeben."; return; }
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let diff = (eh + em/60) - (sh + sm/60);
    if (diff < 0) diff += 24; // Nachtarbeit
    out.textContent = `Dauer: ${diff.toFixed(2)} Stunden`;
  });

  /* ===================== Export / Import aktuelles Projekt ===================== */
  E("btnExportJSON").onclick = ()=>{
    const p = current();
    const blob = new Blob([JSON.stringify(p)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const n = (p.general.name||"Projekt").replace(/\s+/g,"_");
    a.download = `${n}_Dokumentation.json`;
    a.click();
  };
  E("importJSON").onchange = async (e)=>{
    const f = e.target.files[0]; if (!f) return;
    try{
      const data = JSON.parse(await f.text());
      if (data && data.id && data.general) {
        const idx = store.projects.findIndex(p=>p.id===store.currentId);
        if (idx>=0) store.projects[idx] = data;
        store.currentId = data.id;
        saveStore(); renderAll(); alert("✅ Projekt importiert.");
      } else throw 0;
    }catch{ alert("❌ Datei ungültig."); }
    e.target.value="";
  };
  E("btnPDF").onclick = ()=> exportPDF(false);

  /* ===================== PDF – v3.2 FIX: strukturierte Fotokacheln ===================== */
  function exportPDF(all=false){
    const projects = all ? store.projects : [ current() ];
    const w = window.open("", "_blank");
    const head = `
      <style>
        *{box-sizing:border-box} body{font-family:Inter,Arial; margin:28px; color:#111}
        h1{margin:0 0 8px; color:#f97316; font-size:22px}
        h2{margin:18px 0 6px; border-bottom:2px solid #f97316; padding-bottom:4px}
        h3{margin:10px 0 6px}
        table{border-collapse:collapse; width:100%; margin-top:6px}
        th,td{border:1px solid #ddd; padding:6px; font-size:12px}
        th{background:#f3f4f6; text-align:left}
        .row{display:flex; gap:16px; flex-wrap:wrap}
        /* v3.2: Galerie als Raster */
        .kacheln{display:grid; grid-template-columns:repeat(auto-fill, minmax(90px,1fr)); gap:6px; margin-top:6px}
        .kacheln img{width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:5px; border:1px solid #ddd}
        .ba{display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:6px}
        .ba img{width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px; border:1px solid #eee}
        .muted{color:#555}
        .pagebreak{page-break-after:always;}
      </style>
    `;

    const html = projects.map(p=>{
      const g = p.general||{};
      const leaders = (p.members||[]).filter(m=>m.leader).map(m=>m.name).join(", ") || "–";
      const team = (p.members||[]).filter(m=>!m.leader).map(m=>m.name).join(", ") || "–";
      const sumPlan = p.materials.reduce((a,m)=>a + (num(m.qtyPlan)*num(m.costPlan)),0);
      const sumReal = p.materials.reduce((a,m)=>a + (num(m.qtyReal)*num(m.costReal)),0);

      return `
      <div class="proj">
        <h1>STRAßENWÄRTER – PROJEKT DOKUMENTATION</h1>
        <div class="row">
          <div><b>Projekt:</b> ${g.name||"-"}</div>
          <div><b>Projektnummer:</b> ${g.number||"-"}</div>
        </div>
        <div class="row">
          <div><b>Ort:</b> ${g.ort||"-"}</div>
          <div><b>Zeitraum:</b> ${g.start||"-"} – ${g.end||"-"}</div>
        </div>
        <div class="row">
          <div><b>Straße:</b> ${g.strasse||"-"}</div>
          <div><b>Abschnitt:</b> ${g.abschnitt||"-"}</div>
          <div><b>Station:</b> ${g.station||"-"}</div>
        </div>

        <h2>Leitung & Team</h2>
        <p><b>Leitung:</b> ${leaders}</p>
        <p><b>Team:</b> ${team}</p>

        <h2>Beschreibung</h2>
        <p>${(g.desc||"").replace(/\n/g,"<br>")}</p>

        <h2>Materialien</h2>
        <p><b>Gesamt Soll:</b> ${sumPlan.toFixed(2)} € &nbsp; | &nbsp; <b>Gesamt Ist:</b> ${sumReal.toFixed(2)} €</p>
        <table>
          <thead><tr>
            <th>Material</th><th>Einheit</th>
            <th>Menge Soll</th><th>€/E Soll</th><th>Summe Soll</th>
            <th>Menge Ist</th><th>€/E Ist</th><th>Summe Ist</th>
            <th>Δ %</th><th>Benötigt</th>
          </tr></thead>
          <tbody>
            ${p.materials.map(m=>{
              const ps=num(m.qtyPlan)*num(m.costPlan); const rs=num(m.qtyReal)*num(m.costReal);
              const dev=(ps===0&&rs>0)?100:(ps?((rs-ps)/ps*100):0);
              return `<tr>
                <td>${m.name||""}</td><td>${m.unit||""}</td>
                <td>${m.qtyPlan||""}</td><td>${m.costPlan||""}</td><td>${ps.toFixed(2)} €</td>
                <td>${m.qtyReal||""}</td><td>${m.costReal||""}</td><td>${rs.toFixed(2)} €</td>
                <td>${dev.toFixed(1)} %</td><td>${m.needed?"Ja":"Nein"}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>

        <h2>Werkzeuge / Fahrzeuge</h2>
        <p><b>Werkzeuge:</b><br>${p.tools.map(t=>`${t.used?"✅":"⬜"} ${t.name}`).join("<br>")||"-"}</p>
        <p><b>Fahrzeuge:</b><br>${p.vehicles.map(v=>`${v.name||"-"} – ${v.plate||""}`).join("<br>")||"-"}</p>

        <h2>RSA & VZ</h2>
        <p><b>RSA-Pläne:</b> ${p.rsa.map(r=>r.text).join(", ")||"-"}</p>
        <p><b>VZ-Zeichen:</b><br>${p.vz.map(v=>`${v.text} ×${v.count||1}`).join("<br>")||"-"}</p>

        <h2>Fotodokumentation</h2>
        ${p.beforeAfter.length ? p.beforeAfter.map(pair=>`
          <div class="ba">
            <div><b>Vorher</b><br>${pair.before?`<img src="${pair.before}">`:""}</div>
            <div><b>Nachher</b><br>${pair.after?`<img src="${pair.after}">`:""}</div>
          </div>
        `).join("") : "<p class='muted'>—</p>"}
        <div class="kacheln">${p.gallery.map(src=>`<img src="${src}">`).join("")}</div>

        <h2>Zeit & Schritte</h2>
        <p><b>Gesamt Soll:</b> ${p.time.plan||"0"} h &nbsp; | &nbsp;
           <b>Gesamt Ist:</b> ${p.time.real||"0"} h &nbsp; | &nbsp;
           <b>Δ:</b> ${(num(p.time.real)-num(p.time.plan)).toFixed(2)} h</p>

        <table>
          <thead><tr><th>Schritt</th><th>Soll (h)</th><th>Ist (h)</th><th>Δ (h)</th><th>Status</th></tr></thead>
          <tbody>
            ${p.steps.map(s=>{
              const d=(num(s.real)-num(s.plan)).toFixed(2);
              return `<tr><td>${s.text||""}</td><td>${s.plan||""}</td><td>${s.real||""}</td><td>${d}</td><td>${s.done?"✅":"⬜"}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="pagebreak"></div>
      `;
    }).join("");

    w.document.write(`<html><head><meta charset="utf-8">${head}</head><body>${html}</body></html>`);
    w.document.close(); w.focus();
  }

  /* ===================== INITIAL RENDER ===================== */
  function renderAll(){
    renderPMList();
    renderPMSelector();

    renderGeneral();
    renderMembers();
    renderMaterials();
    renderTools();
    renderGallery();
    renderBA();
    renderTime();
    renderSteps();
  }
  renderAll();
}
