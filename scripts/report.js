/* ==========================================================================
   Straßenwärter Tool – Tagesbericht (report.js) v2.1
   - SM-Auswahl: Berenbostel, Sarstedt, Stadthagen
   - Tätigkeit: Kolonne | Streckenkontrolle | Hof
   - Bezirke (nur Berenbostel): Wedemark, Neustadt, Hannover
   - Leitung
   - Fahrzeuge:
       * Berenbostel: vordefinierte Kennzeichenliste + "Beliebiges Kennzeichen"
       * Auswahl-Checkbox pro Fahrzeug
       * Rolle: Fahrer/Beifahrer (Beifahrer standardmäßig)
       * Fahrzeugwechsel (bearbeiten), Entfernen
       * Schäden: per Aktiv-Häkchen einblendbar, mit Text + Bild (+ löschen)
   - Straßen (nur Berenbostel): B3,B6,B65,B442 | L190,L191,L192,L193,L310,L360,L380,L382,L383,L390 + Freitext
   - Aufgabenblock pro Straße (bei Hof: Aufgaben ohne Straße, ohne Abschnitt/Station/RSA)
       * Felder: Überschrift, (Straße), Abschnitt, Station, RSA, Info
       * Materialschäden: per Aktiv-Häkchen sichtbar + Text + Bild (+ löschen)
   - Temperatur: automatisch vorbelegt (Heuristik + Erinnerung), editierbar
   - Export/Import JSON, PDF-Export
   ========================================================================== */

function loadReport() {
  if (document.querySelector(".report-v21")) return; // Doppelinit verhindern

  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="report-v21 fade-in">
    <!-- Kopf -->
    <div class="card glass-strong">
      <div class="row gap wrap">
        <h2 class="grow">📒 Tagesbericht</h2>
        <label>Datum
          <input id="repDate" type="date">
        </label>
        <label>Temperatur (°C)
          <input id="repTemp" type="number" step="0.1" placeholder="z. B. 15.0">
        </label>
      </div>
    </div>

    <!-- SM -->
    <div class="card glass-strong">
      <h3>🏢 Straßenmeisterei</h3>
      <div class="btn-group" id="smGroup">
        <button class="btn sm-btn" data-sm="Berenbostel">SM Berenbostel</button>
        <button class="btn sm-btn" data-sm="Sarstedt">SM Sarstedt</button>
        <button class="btn sm-btn" data-sm="Stadthagen">SM Stadthagen</button>
      </div>
      <div class="muted sm">Wähle die Meisterei, dann die Tätigkeit. Weitere Bereiche werden eingeblendet.</div>
    </div>

    <!-- Tätigkeit -->
    <div class="card glass-strong hidden" id="taetigkeitCard">
      <h3>🧭 Tätigkeit</h3>
      <div class="btn-group">
        <button class="btn act-btn" data-act="Kolonne">Kolonne</button>
        <button class="btn act-btn" data-act="Streckenkontrolle">Streckenkontrolle</button>
        <button class="btn act-btn" data-act="Hof">Hof</button>
      </div>
    </div>

    <!-- Bezirk (nur BB, nicht Hof) -->
    <div class="card glass-strong hidden" id="bezirkCard">
      <h3>🗺️ Bezirk (nur SM Berenbostel)</h3>
      <div class="btn-group" id="bezirkGroup"></div>
    </div>

    <!-- Leitung -->
    <div class="card glass-strong hidden" id="leitungCard">
      <h3>👷 Leitung</h3>
      <div class="row gap">
        <input id="leitungName" type="text" placeholder="Name der Leitung …">
      </div>
    </div>

    <!-- Fahrzeuge (nicht Hof) -->
    <div class="card glass-strong hidden" id="fahrzeugeCard">
      <h3>🚛 Fahrzeuge</h3>
      <div id="vehPresetWrap" class="card glass-light">
        <h4>Vorauswahl – SM Berenbostel</h4>
        <div class="muted sm">Wähle Kennzeichen oder füge ein beliebiges hinzu.</div>
        <div class="btn-group" id="vehPresetGroup"></div>
        <div class="row gap mt-sm">
          <input id="vehCustomPlate" type="text" placeholder="Beliebiges Kennzeichen …">
          <button class="btn" id="vehCustomAdd">+ Hinzufügen</button>
        </div>
      </div>

      <div class="muted sm mt-sm">Gewählte Fahrzeuge erscheinen unten – dort Rolle, Wechsel, Schäden verwalten.</div>
      <div id="vehList" class="list"></div>
    </div>

    <!-- Straßen (nur BB, nicht Hof) -->
    <div class="card glass-strong hidden" id="strassenCard">
      <h3>🛣️ Straße wählen (nur SM Berenbostel)</h3>
      <div class="row wrap gap">
        <div class="card glass-light" style="flex:1;min-width:260px">
          <h4>🟦 Bundesstraßen</h4>
          <div class="btn-group" id="bundGroup"></div>
        </div>
        <div class="card glass-light" style="flex:1;min-width:260px">
          <h4>🟩 Landesstraßen</h4>
          <div class="btn-group" id="landGroup"></div>
        </div>
      </div>
      <div class="row gap mt-sm">
        <input id="customRoad" type="text" placeholder="Andere Straße eingeben …">
        <button class="btn" id="customRoadAdd">+ Übernehmen</button>
      </div>
      <div class="muted sm">Wähle eine Straße (oder gib eine ein), um eine Aufgabe anzulegen.</div>
    </div>

    <!-- Aufgaben -->
    <div class="card glass-strong hidden" id="aufgabenCard">
      <div class="row gap wrap">
        <h3 class="grow">🧱 Aufgaben</h3>
        <div id="hofAddBtnWrap" class="hidden">
          <button class="btn accent" id="hofAddTask">+ Aufgabe (ohne Straße)</button>
        </div>
      </div>
      <div id="tasksWrap" class="tasks-wrap"></div>
    </div>

    <!-- Export -->
    <div class="card glass-strong">
      <h3>📦 Export / Import</h3>
      <div class="row wrap gap">
        <button class="btn" id="btnExport">⬇️ JSON exportieren</button>
        <label class="filebox">⬆️ JSON importieren
          <input id="btnImport" type="file" accept="application/json">
        </label>
        <button class="btn" id="btnPDF">🖨️ PDF exportieren</button>
      </div>
    </div>
  </section>
  `;

  /* ===================== Konstanten ===================== */
  const LS_KEY = "report_v21_state";
  const TEMP_LAST_KEY = "report_v21_lastTemp";

  const ROADS_BUND = ["B3","B6","B65","B442"];
  const ROADS_LAND = ["L190","L191","L192","L193","L310","L360","L380","L382","L383","L390"];
  const BEZIRKE_BB = ["(Land 1) Wedemark","(Land 2) Neustadt","(Stadt) Hannover"];

  const VEH_BB_PLATES = [
    "H-SB-701","H-SB-702","H-SB-703","H-SB-686","H-SB-685",
    "H-SB-675","H-SB-680","H-SB-681","H-SB-691"
  ];

  /* ===================== Utils ===================== */
  const E = id => document.getElementById(id);
  const uid = () => Math.random().toString(36).slice(2,9);
  const show = (el, v) => el.classList.toggle("hidden", !v);
  const escapeHTML = s => (s||"").replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

  function todayISO(){
    const d = new Date();
    const pad = v => String(v).padStart(2,"0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  function toPngData(file){
    return new Promise(res=>{
      const fr = new FileReader();
      fr.onload = ()=> {
        const img = new Image();
        img.onload = ()=>{
          const c = document.createElement("canvas");
          c.width = img.width; c.height = img.height;
          c.getContext("2d").drawImage(img, 0, 0);
          res(c.toDataURL("image/png"));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  // Temperatur "wie vorher": erinnere letzten Nutzerwert, sonst heuristische Schätzung nach Tageszeit
  function autoTemperature(){
    try {
      const saved = JSON.parse(localStorage.getItem(TEMP_LAST_KEY) || "null");
      if (saved && saved.date === todayISO() && typeof saved.temp === "number") return String(saved.temp);
    } catch {}
    const h = new Date().getHours();
    // einfache, stimmige Heuristik nach Tageszeit (editierbar)
    let t = 15;
    if (h >= 6 && h < 10) t = 12;
    else if (h >= 10 && h < 15) t = 17;
    else if (h >= 15 && h < 18) t = 19;
    else if (h >= 18 && h < 22) t = 16;
    else t = 10;
    return String(t);
  }

  /* ===================== State ===================== */
  function defaultState(){
    return {
      date: todayISO(),
      temp: "", // wird unten auto gesetzt falls leer
      sm: "",
      taetigkeit: "",
      bezirk: "",
      leitung: "",
      // ausgewählte Fahrzeuge (array), unabhängig von SM-Preselection
      fahrzeuge: [], // {id, plate, name, rolle: "Fahrer"|"Beifahrer", damageActive, damages:[{id,text,img}]}
      aufgaben: []   // {id,strasse,ueberschrift,abschnitt,station,rsa,info, matDamageActive, materialDamages:[{id,text,img}]}
    };
  }

  function loadStore(){
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (s && typeof s === "object") {
        if (!Array.isArray(s.fahrzeuge)) s.fahrzeuge = [];
        if (!Array.isArray(s.aufgaben)) s.aufgaben = [];
        return s;
      }
    } catch {}
    return defaultState();
  }
  function saveStore(){
    localStorage.setItem(LS_KEY, JSON.stringify(store));
    // Letzten Temperaturwert merken (als Komfort-Feature)
    const t = parseFloat(store.temp);
    if (!isNaN(t)) localStorage.setItem(TEMP_LAST_KEY, JSON.stringify({date: todayISO(), temp: t}));
  }

  let store = loadStore();
  if (!store.temp) { store.temp = autoTemperature(); saveStore(); }

  /* ===================== Render ===================== */
  function setActiveInGroup(groupEl, value, attr){
    if (!groupEl) return;
    groupEl.querySelectorAll(`[data-${attr}]`).forEach(btn=>{
      btn.classList.toggle("active", btn.dataset[attr] === value);
    });
  }

  function renderHeader(){
    E("repDate").value = store.date || todayISO();
    E("repTemp").value = store.temp || "";
  }

  function renderSM(){
    setActiveInGroup(E("smGroup"), store.sm, "sm");
    show(E("taetigkeitCard"), !!store.sm);
  }

  function renderAct(){
    document.querySelectorAll(".act-btn").forEach(btn=>{
      btn.classList.toggle("active", btn.dataset.act === store.taetigkeit);
    });
    const isSMBB = store.sm === "Berenbostel";
    const isHof = store.taetigkeit === "Hof";

    show(E("bezirkCard"), isSMBB && !isHof && !!store.taetigkeit);
    show(E("leitungCard"), !!store.taetigkeit);
    show(E("fahrzeugeCard"), !isHof && !!store.taetigkeit);
    show(E("strassenCard"), isSMBB && !isHof && !!store.taetigkeit);
    show(E("aufgabenCard"), !!store.taetigkeit);
    show(E("vehPresetWrap"), store.sm === "Berenbostel" && !isHof);

    show(E("hofAddBtnWrap"), isHof);
  }

  function renderBezirk(){
    E("bezirkGroup").innerHTML = BEZIRKE_BB.map(b=>(
      `<button class="btn bez-btn ${store.bezirk===b?'active':''}" data-bez="${b}">${b}</button>`
    )).join("");
  }

  function renderVehPreset(){
    // Buttons zum schnellen Hinzufügen
    E("vehPresetGroup").innerHTML = VEH_BB_PLATES.map(p => {
      const already = store.fahrzeuge.find(v => v.plate === p);
      return `<button class="btn ${already?'active':''}" data-addplate="${p}">${p}</button>`;
    }).join("");
  }

  function renderVehicles(){
    const list = E("vehList");
    list.innerHTML = "";
    if (!store.fahrzeuge.length){
      list.innerHTML = `<p class="muted sm">Noch keine Fahrzeuge ausgewählt.</p>`;
      return;
    }
    store.fahrzeuge.forEach(v=>{
      const row = document.createElement("div");
      row.className = "item veh-item";
      row.innerHTML = `
        <div class="veh-top row gap wrap">
          <div class="row gap">
            <label class="chk"><input type="checkbox" checked disabled><span>Ausgewählt</span></label>
            <input class="veh-plate" data-id="${v.id}" value="${escapeHTML(v.plate)}" placeholder="Kennzeichen">
            <input class="veh-name"  data-id="${v.id}" value="${escapeHTML(v.name||"")}" placeholder="Fahrzeug (optional)">
          </div>
          <div class="row gap">
            <div class="radiogroup" data-id="${v.id}">
              <label class="radio"><input type="radio" name="rolle-${v.id}" value="Fahrer" ${v.rolle==="Fahrer"?"checked":""}><span>Fahrer</span></label>
              <label class="radio"><input type="radio" name="rolle-${v.id}" value="Beifahrer" ${v.rolle!=="Fahrer"?"checked":""}><span>Beifahrer</span></label>
            </div>
            <button class="btn" data-wechsel="${v.id}">Fahrzeugwechsel</button>
            <button class="btn danger" data-delv="${v.id}">🗑 Entfernen</button>
          </div>
        </div>

        <div class="card glass-light mt-sm">
          <label class="chk">
            <input type="checkbox" data-vdam-act="${v.id}" ${v.damageActive?"checked":""}>
            <span>🔧 Beschädigung vorhanden</span>
          </label>

          <div class="vdam-wrap ${v.damageActive?"":"hidden"}" id="vdam-${v.id}">
            <div class="row gap wrap mt-sm">
              <input class="vdam-text" data-id="${v.id}" type="text" placeholder="Beschreibung der Beschädigung …" style="flex:1">
              <label class="filebox">Bild
                <input class="vdam-img" data-id="${v.id}" type="file" accept="image/*">
              </label>
              <button class="btn" data-vdam-add="${v.id}">+ Eintrag</button>
            </div>
            <div class="chips imgchips" id="vdamList-${v.id}">
              ${renderVehicleDamageChips(v.damages||[], v.id)}
            </div>
          </div>
        </div>
      `;
      list.appendChild(row);
    });

    // Bindings
    list.querySelectorAll(".veh-plate").forEach(inp=>{
      inp.oninput = ()=>{ const v=getVeh(inp.dataset.id); if(v){ v.plate = inp.value.trim(); saveStore(); } };
    });
    list.querySelectorAll(".veh-name").forEach(inp=>{
      inp.oninput = ()=>{ const v=getVeh(inp.dataset.id); if(v){ v.name = inp.value.trim(); saveStore(); } };
    });
    list.querySelectorAll("[data-delv]").forEach(btn=>{
      btn.onclick = ()=>{ store.fahrzeuge = store.fahrzeuge.filter(x=>x.id!==btn.dataset.delv); saveStore(); renderVehicles(); };
    });
    list.querySelectorAll("[data-wechsel]").forEach(btn=>{
      btn.onclick = ()=>{ const v=getVeh(btn.dataset.wechsel); if(!v) return; const np = prompt("Neues Kennzeichen für Fahrzeug:", v.plate||""); if(np!==null){ v.plate=np.trim(); saveStore(); renderVehicles(); } };
    });
    list.querySelectorAll(".radiogroup").forEach(rg=>{
      rg.addEventListener("change", e=>{
        const v=getVeh(rg.dataset.id); if(!v) return;
        if (e.target && e.target.name === `rolle-${v.id}`) { v.rolle = e.target.value; saveStore(); }
      });
    });
    list.querySelectorAll("[data-vdam-act]").forEach(ch=>{
      ch.onchange = ()=>{
        const v=getVeh(ch.dataset.vdamAct); if(!v) return;
        v.damageActive = ch.checked; if (!v.damageActive) v.damages = v.damages || [];
        saveStore(); renderVehicles();
      };
    });
    list.querySelectorAll("[data-vdam-add]").forEach(btn=>{
      btn.onclick = async ()=>{
        const id = btn.dataset.vdamAdd;
        const wrap = E(`vdam-${id}`);
        const text = wrap.querySelector(`.vdam-text[data-id="${id}"]`).value.trim();
        const fileIn = wrap.querySelector(`.vdam-img[data-id="${id}"]`);
        let img=""; if (fileIn && fileIn.files && fileIn.files[0]) img = await toPngData(fileIn.files[0]);
        if (!text && !img) return;
        const v=getVeh(id); if(!v) return;
        if (!Array.isArray(v.damages)) v.damages=[];
        v.damages.push({id:uid(), text, img});
        wrap.querySelector(`.vdam-text[data-id="${id}"]`).value="";
        if (fileIn) fileIn.value="";
        saveStore(); renderVehicles();
      };
    });
    list.querySelectorAll("[data-del-vdam]").forEach(btn=>{
      btn.onclick = ()=>{
        const id=btn.dataset.tid, did=btn.dataset.delVdam;
        const v=getVeh(id); if (!v?.damages) return;
        v.damages = v.damages.filter(x=>x.id!==did);
        saveStore(); renderVehicles();
      };
    });
  }

  function renderVehicleDamageChips(arr, vehId){
    return (arr||[]).map(d=>`
      <span class="chip imgchip">
        ${d.img?`<img class="chip-thumb" src="${d.img}">`:""}
        <span>${escapeHTML(d.text||"")}</span>
        <button class="chip-x" data-del-vdam="${d.id}" data-tid="${vehId}">✕</button>
      </span>
    `).join("");
  }

  function getVeh(id){ return store.fahrzeuge.find(v=>v.id===id); }

  function renderRoadButtons(){
    E("bundGroup").innerHTML = ROADS_BUND.map(r=>`<button class="btn road-btn blue" data-road="${r}">${r}</button>`).join("");
    E("landGroup").innerHTML = ROADS_LAND.map(r=>`<button class="btn road-btn green" data-road="${r}">${r}</button>`).join("");
  }

  function renderTasks(){
    const wrap = E("tasksWrap");
    wrap.innerHTML = "";
    if (!store.aufgaben.length) {
      wrap.innerHTML = `<p class="muted sm">Noch keine Aufgaben erfasst.</p>`;
      return;
    }
    const isHof = store.taetigkeit === "Hof";

    store.aufgaben.forEach(t=>{
      const card = document.createElement("div");
      card.className = "card glass-light task-card";
      card.innerHTML = `
        <div class="row gap wrap">
          <h4 class="grow">🧱 Aufgabe</h4>
          <button class="btn danger" data-deltask="${t.id}">🗑 Aufgabe</button>
        </div>

        <div class="grid">
          <label>Überschrift
            <input class="task-ue" data-id="${t.id}" type="text" placeholder="z. B. Deckensanierung" value="${t.ueberschrift||""}">
          </label>

          ${isHof ? "" : `
          <label>Straße
            <input class="task-strasse" data-id="${t.id}" type="text" placeholder="z. B. B6" value="${t.strasse||""}">
          </label>
          <label>Abschnitt
            <input class="task-abschnitt" data-id="${t.id}" type="text" placeholder="z. B. km 2,0 – 4,0" value="${t.abschnitt||""}">
          </label>
          <label>Station
            <input class="task-station" data-id="${t.id}" type="text" placeholder="z. B. 2+300" value="${t.station||""}">
          </label>
          <label>RSA-Plan
            <input class="task-rsa" data-id="${t.id}" type="text" placeholder="z. B. B I/2-1" value="${t.rsa||""}">
          </label>
          `}
        </div>

        <label>Nützliche Informationen</label>
        <textarea class="task-info" data-id="${t.id}" rows="4" placeholder="Freitext …">${t.info||""}</textarea>

        <!-- Materialschäden (aktivierbar) -->
        <div class="card glass-strong mt">
          <label class="chk">
            <input type="checkbox" data-mdam-act="${t.id}" ${t.matDamageActive?"checked":""}>
            <span>🧱 Beschädigung am Material?</span>
          </label>

          <div class="mdam-wrap ${t.matDamageActive?"":"hidden"}" id="mdam-${t.id}">
            <div class="row gap wrap mt-sm">
              <input class="mdam-text" data-id="${t.id}" type="text" placeholder="Beschreibung des Mangels/Defekts …" style="flex:1">
              <label class="filebox">Bild
                <input class="mdam-img" data-id="${t.id}" type="file" accept="image/*">
              </label>
              <button class="btn" data-mdam-add="${t.id}">+ Eintrag</button>
            </div>
            <div class="chips imgchips" id="mdamList-${t.id}">
              ${renderMatDamageChips(t.materialDamages||[], t.id)}
            </div>
          </div>
        </div>
      `;
      wrap.appendChild(card);

      // Bindings
      card.querySelector(".task-ue").oninput = e => { const tt=getTask(t.id); tt.ueberschrift=e.target.value; saveStore(); };
      if (!isHof) {
        card.querySelector(".task-strasse").oninput = e => { const tt=getTask(t.id); tt.strasse=e.target.value; saveStore(); };
        card.querySelector(".task-abschnitt").oninput = e => { const tt=getTask(t.id); tt.abschnitt=e.target.value; saveStore(); };
        card.querySelector(".task-station").oninput = e => { const tt=getTask(t.id); tt.station=e.target.value; saveStore(); };
        card.querySelector(".task-rsa").oninput = e => { const tt=getTask(t.id); tt.rsa=e.target.value; saveStore(); };
      }
      card.querySelector(".task-info").oninput = e => { const tt=getTask(t.id); tt.info=e.target.value; saveStore(); };

      // Material damage activate
      card.querySelector(`[data-mdam-act="${t.id}"]`).onchange = (e)=>{
        const tt=getTask(t.id); tt.matDamageActive = e.target.checked; saveStore(); renderTasks();
      };
      // Add material damage
      card.querySelector(`[data-mdam-add="${t.id}"]`).onclick = async ()=>{
        const wrap = E(`mdam-${t.id}`);
        const text = wrap.querySelector(`.mdam-text[data-id="${t.id}"]`).value.trim();
        const fileIn = wrap.querySelector(`.mdam-img[data-id="${t.id}"]`);
        let img=""; if (fileIn && fileIn.files && fileIn.files[0]) img = await toPngData(fileIn.files[0]);
        if (!text && !img) return;
        const tt=getTask(t.id);
        if (!Array.isArray(tt.materialDamages)) tt.materialDamages=[];
        tt.materialDamages.push({id:uid(), text, img});
        wrap.querySelector(`.mdam-text[data-id="${t.id}"]`).value="";
        if (fileIn) fileIn.value="";
        saveStore(); renderTasks();
      };
      // delete chips (material)
      card.querySelectorAll("[data-del-mdam]").forEach(btn=>{
        btn.onclick = ()=>{
          const tid=btn.dataset.tid, did=btn.dataset.delMdam;
          const tt=getTask(tid); if (!tt?.materialDamages) return;
          tt.materialDamages = tt.materialDamages.filter(x=>x.id!==did);
          saveStore(); renderTasks();
        };
      });

      // Delete entire task
      card.querySelector(`[data-deltask="${t.id}"]`).onclick = ()=>{
        store.aufgaben = store.aufgaben.filter(x=>x.id!==t.id);
        saveStore(); renderTasks();
      };
    });
  }

  function renderMatDamageChips(arr, taskId){
    return (arr||[]).map(d=>`
      <span class="chip imgchip">
        ${d.img?`<img class="chip-thumb" src="${d.img}">`:""}
        <span>${escapeHTML(d.text||"")}</span>
        <button class="chip-x" data-del-mdam="${d.id}" data-tid="${taskId}">✕</button>
      </span>
    `).join("");
  }

  function getTask(id){ return store.aufgaben.find(x=>x.id===id); }

  /* ===================== Events – Header ===================== */
  E("repDate").oninput = ()=>{ store.date = E("repDate").value; saveStore(); };
  E("repTemp").oninput = ()=>{ store.temp = E("repTemp").value; saveStore(); };

  /* ===================== Events – SM & Tätigkeit & Bezirk ===================== */
  E("smGroup").addEventListener("click", e=>{
    const btn = e.target.closest(".sm-btn"); if (!btn) return;
    store.sm = btn.dataset.sm;
    // Wechsel der SM: Fahrzeuge zurücksetzen (sonst stimmt die Liste nicht)
    store.fahrzeuge = [];
    saveStore();
    renderSM(); renderAct(); renderVehPreset(); renderVehicles();
  });

  document.querySelectorAll(".act-btn").forEach(btn=>{
    btn.onclick = ()=>{
      store.taetigkeit = btn.dataset.act;
      if (store.taetigkeit === "Hof") store.bezirk = "";
      saveStore();
      renderAct();
      if (store.sm === "Berenbostel" && store.taetigkeit !== "Hof") {
        renderBezirk();
      }
    };
  });

  E("bezirkCard").addEventListener("click", e=>{
    const btn = e.target.closest(".bez-btn"); if (!btn) return;
    store.bezirk = btn.dataset.bez;
    saveStore(); renderBezirk();
  });

  /* ===================== Events – Leitung ===================== */
  E("leitungName").oninput = ()=>{ store.leitung = E("leitungName").value.trim(); saveStore(); };

  /* ===================== Events – Fahrzeuge ===================== */
  // Preset hinzufügen (BB)
  E("vehPresetWrap").addEventListener("click", e=>{
    const b = e.target.closest("[data-addplate]"); if (!b) return;
    const plate = b.dataset.addplate;
    if (!store.fahrzeuge.find(v=>v.plate===plate)){
      store.fahrzeuge.push({
        id: uid(),
        plate,
        name: "", rolle: "Beifahrer",
        damageActive: false, damages: []
      });
      saveStore(); renderVehPreset(); renderVehicles();
    }
  });

  // Custom plate
  E("vehCustomAdd").onclick = ()=>{
    const p = E("vehCustomPlate").value.trim(); if (!p) return;
    store.fahrzeuge.push({ id: uid(), plate:p, name:"", rolle:"Beifahrer", damageActive:false, damages:[] });
    E("vehCustomPlate").value = "";
    saveStore(); renderVehPreset(); renderVehicles();
  };

  /* ===================== Events – Straßenwahl ===================== */
  E("strassenCard").addEventListener("click", e=>{
    const btn = e.target.closest(".road-btn"); if (!btn) return;
    const road = btn.dataset.road || "";
    if (!road) return;
    addTask(road);
  });
  E("customRoadAdd").onclick = ()=>{
    const road = E("customRoad").value.trim(); if (!road) return;
    addTask(road);
    E("customRoad").value = "";
  };
  function addTask(road){
    if (store.taetigkeit === "Hof") return;
    store.aufgaben.push({
      id: uid(),
      strasse: road || "",
      ueberschrift: "",
      abschnitt: "",
      station: "",
      rsa: "",
      info: "",
      matDamageActive: false,
      materialDamages: []
    });
    saveStore(); renderTasks();
    setTimeout(()=>{ E("tasksWrap").lastElementChild?.scrollIntoView({behavior:"smooth", block:"end"}); }, 30);
  }

  // Hof – Aufgabe ohne Straße
  E("hofAddTask").onclick = ()=>{
    if (store.taetigkeit !== "Hof") return;
    store.aufgaben.push({
      id: uid(),
      strasse: "", // keine Straße
      ueberschrift: "",
      abschnitt: "", // wird nicht genutzt/angezeigt
      station: "",
      rsa: "",
      info: "",
      matDamageActive: false,
      materialDamages: []
    });
    saveStore(); renderTasks();
    setTimeout(()=>{ E("tasksWrap").lastElementChild?.scrollIntoView({behavior:"smooth", block:"end"}); }, 30);
  };

  /* ===================== Export / Import ===================== */
  E("btnExport").onclick = ()=>{
    const blob = new Blob([JSON.stringify(store)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Tagesbericht_${store.date||todayISO()}.json`;
    a.click();
  };
  E("btnImport").onchange = async (e)=>{
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data && typeof data === "object") {
        store = data;
        if (!Array.isArray(store.fahrzeuge)) store.fahrzeuge = [];
        if (!Array.isArray(store.aufgaben)) store.aufgaben = [];
        if (!store.date) store.date = todayISO();
        if (!store.temp) store.temp = autoTemperature();
        saveStore(); renderAll(); alert("✅ Bericht importiert.");
      } else throw 0;
    } catch { alert("❌ Ungültige oder beschädigte Datei."); }
    e.target.value = "";
  };

  /* ===================== PDF ===================== */
  E("btnPDF").onclick = ()=> exportPDF();

  function exportPDF(){
    const w = window.open("", "_blank");
    const head = `
      <style>
        *{box-sizing:border-box} body{font-family:Inter,Arial; margin:26px; color:#111}
        h1{margin:0 0 8px; color:#f97316; font-size:22px}
        h2{margin:16px 0 6px; border-bottom:2px solid #f97316; padding-bottom:4px}
        h3{margin:10px 0 6px}
        table{border-collapse:collapse; width:100%; margin-top:6px}
        th,td{border:1px solid #ddd; padding:6px; font-size:12px}
        th{background:#f3f4f6; text-align:left}
        .row{display:flex; gap:16px; flex-wrap:wrap}
        .muted{color:#555}
        .kacheln{display:grid; grid-template-columns:repeat(auto-fill, minmax(90px,1fr)); gap:6px; margin-top:6px}
        .kacheln img{width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:5px; border:1px solid #ddd}
        .sect{margin:10px 0 14px}
        .task{border:1px solid #e5e7eb; border-radius:8px; padding:10px; margin-bottom:10px}
        .task h3{margin-top:0}
      </style>
    `;

    const header = `
      <h1>STRAßENWÄRTER – TAGESBERICHT</h1>
      <div class="row">
        <div><b>Datum:</b> ${store.date||"-"}</div>
        <div><b>Temperatur:</b> ${store.temp?store.temp+" °C":"-"}</div>
      </div>
      <div class="row">
        <div><b>Meisterei:</b> ${store.sm||"-"}</div>
        <div><b>Tätigkeit:</b> ${store.taetigkeit||"-"}</div>
        <div><b>Bezirk:</b> ${store.bezirk||"-"}</div>
        <div><b>Leitung:</b> ${store.leitung||"-"}</div>
      </div>
    `;

    // Fahrzeuge (mit Rolle) + Fahrzeugschäden
    const vehInfo = store.fahrzeuge.length
      ? store.fahrzeuge.map(v=>`${escapeHTML(v.plate)}${v.name?(" – "+escapeHTML(v.name)):""} (${v.rolle||"Beifahrer"})`).join("<br>")
      : "—";

    const vehDamages = store.fahrzeuge.flatMap(v=>{
      if (!v.damageActive || !Array.isArray(v.damages) || !v.damages.length) return [];
      // markiere pro Fahrzeug
      return [{_veh:v, items:v.damages}];
    });

    const vehDamageHTML = vehDamages.length ? `
      <div class="sect">
        <h2>Fahrzeugbeschädigungen</h2>
        ${vehDamages.map(entry=>{
          const v = entry._veh, items = entry.items;
          return `
            <h3>${escapeHTML(v.plate)}${v.name?(" – "+escapeHTML(v.name)):""} (${v.rolle||"Beifahrer"})</h3>
            <div class="kacheln">
              ${items.map(d=> d.img ? `<figure><img src="${d.img}"><figcaption style="font-size:11px">${escapeHTML(d.text||"")}</figcaption></figure>` : `<div>${escapeHTML(d.text||"")}</div>`).join("")}
            </div>
          `;
        }).join("")}
      </div>
    ` : "";

    const tasksHTML = store.aufgaben.map(t=>{
      const isHof = store.taetigkeit === "Hof";
      const dm = (t.materialDamages||[]);
      return `
        <div class="task">
          ${t.ueberschrift ? `<h3>${escapeHTML(t.ueberschrift)}</h3>` : ""}
          ${!isHof && t.strasse ? `<p><b>Straße:</b> ${escapeHTML(t.strasse)}</p>` : ""}
          ${!isHof ? `
            <div class="row">
              <div><b>Abschnitt:</b> ${escapeHTML(t.abschnitt||"-")}</div>
              <div><b>Station:</b> ${escapeHTML(t.station||"-")}</div>
              <div><b>RSA-Plan:</b> ${escapeHTML(t.rsa||"-")}</div>
            </div>
          ` : ""}
          ${t.info ? `<div class="sect"><b>Info:</b><br>${escapeHTML(t.info).replace(/\n/g,"<br>")}</div>` : ""}

          ${dm.length ? `
            <div class="sect">
              <b>Beschädigungen – Materialien</b>
              <div class="kacheln">
                ${dm.map(d=> d.img ? `<figure><img src="${d.img}"><figcaption style="font-size:11px">${escapeHTML(d.text||"")}</figcaption></figure>` : `<div>${escapeHTML(d.text||"")}</div>`).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    const html = `
      ${header}
      <h2>Fahrzeuge</h2>
      <p>${vehInfo}</p>
      ${vehDamageHTML}
      <h2>Aufgaben</h2>
      ${tasksHTML || "<p class='muted'>—</p>"}
    `;

    w.document.write(`<html><head><meta charset="utf-8">${head}</head><body>${html}</body></html>`);
    w.document.close(); w.focus();
  }

  /* ===================== Initiale Road/Preset-Befüllung ===================== */
  function renderAll(){
    renderHeader();
    renderSM();
    renderAct();
    if (store.sm === "Berenbostel" && store.taetigkeit !== "Hof" && store.taetigkeit) renderBezirk();
    renderVehPreset();
    renderVehicles();
    renderRoadButtons();
    renderTasks();
  }
  renderAll();

  /* ===================== Hilfsstyles (klein & lokal) ===================== */
  (function injectLocalStyles(){
    const style = document.createElement("style");
    style.textContent = `
      .report-v21 .hidden{display:none!important}
      .report-v21 .btn-group{display:flex;flex-wrap:wrap;gap:.4rem}
      .report-v21 .btn.active{border-color:#f97316;box-shadow:0 0 0 2px rgba(249,115,22,.15)}
      .report-v21 .btn.blue{background:#e0f2fe;border-color:#93c5fd}
      .report-v21 .btn.green{background:#dcfce7;border-color:#86efac}
      .report-v21 .tasks-wrap{display:grid;gap:.8rem}
      .report-v21 .chips.imgchips{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.4rem}
      .report-v21 .chip.imgchip{display:inline-flex;align-items:center;gap:.35rem;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:14px;padding:.15rem .4rem}
      .report-v21 .chip-thumb{width:46px;height:35px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb}
      .report-v21 .veh-item .veh-top{align-items:center;justify-content:space-between}
      .report-v21 .radio input{margin-right:.35rem}
      .report-v21 .radiogroup{display:flex;gap:.6rem;align-items:center}
    `;
    document.head.appendChild(style);
  })();
}
