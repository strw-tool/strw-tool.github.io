/* ================================================================
   Straßenwärter Tool – Dashboard.js (v7 UltraGlass+)
   - Dynamisches Layout mit 2-Spalten-Grid
   - KPI-Animationen, Echtzeituhr & Wetterbox
   - LocalStorage-Notizen & Winterdienststatus
   - Letzte Berichte mit Vorschau & Löschfunktion
   ================================================================ */

function loadDashboard() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="dashboard fade-in">
    <div class="dashboard-left">
      <div class="card glass-strong">
        <div class="section-title"><h2>🚧 Straßenwärter-Dashboard</h2></div>
        <div class="kpis animated">
          <div class="kpi">
            <div class="v" id="kpiReports">–</div>
            <div class="l">Berichte diese Woche</div>
          </div>
          <div class="kpi">
            <div class="v" id="kpiTemp">– °C</div>
            <div class="l">Ø Temperatur</div>
          </div>
          <div class="kpi">
            <div class="v" id="kpiLocation">–</div>
            <div class="l">Letzter Einsatzort</div>
          </div>
        </div>
      </div>

      <div class="card glass-strong">
        <div class="section-title"><h2>🕒 Datum & Uhrzeit</h2></div>
        <p id="liveTime" class="text-glow clock-display"></p>
      </div>

      <div class="card glass-strong">
        <div class="section-title"><h2>🌦️ Wetter & Einsatzinfos</h2></div>
        <div id="weatherBox" class="weather-box">
          <p><b>Ort:</b> <span id="wxLocation">–</span></p>
          <p><b>Temperatur:</b> <span id="wxTemp">– °C</span></p>
          <p><b>Wind:</b> <span id="wxWind">– km/h</span></p>
          <p><b>Bedingungen:</b> <span id="wxCond">–</span></p>
        </div>
        <div id="winterStatusBox" class="winter-box">
          <label><b>Winterdienststatus:</b></label>
          <select id="winterStatus">
            <option value="none">🟢 Kein Einsatz</option>
            <option value="ready">🟠 Bereitschaft</option>
            <option value="active">🔴 Aktiver Einsatz</option>
          </select>
        </div>
      </div>

      <div class="card glass-strong">
        <div class="section-title"><h2>🧮 Mini-Rechner</h2></div>
        <div class="mini-grid">
          <input type="number" id="miniA" placeholder="Zahl A">
          <input type="number" id="miniB" placeholder="Zahl B">
          <select id="miniOp">
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
          <button id="miniCalc" class="btn accent">=</button>
        </div>
        <p id="miniResult" class="mini-result"></p>
      </div>

      <div class="card glass-strong">
        <div class="section-title"><h2>🗒️ Notizen</h2></div>
        <textarea id="dashNotes" rows="4" placeholder="Notizen oder Aufgaben hier eingeben..."></textarea>
      </div>

      <div class="card glass-strong">
        <div class="section-title"><h2>⚡ Schnellzugriff</h2></div>
        <div class="quick-links">
          <button class="btn accent" data-tab="calc">📏 Rechnungen</button>
          <button class="btn accent" data-tab="rsa">🚧 Regelpläne</button>
          <button class="btn accent" data-tab="signs">🚦 Schilderwald</button>
          <button class="btn accent" data-tab="report">🧾 Tagesbericht</button>
          <button class="btn accent" data-tab="winter">❄️ Winterdienst</button>
        </div>
      </div>
    </div>

    <div class="dashboard-right">
      <div class="card glass-strong" id="reportHistoryCard">
        <div class="section-title"><h2>📚 Letzte Berichte</h2></div>
        <div id="reportHistory" class="report-list"></div>
      </div>
    </div>
  </section>
  `;

  // === Uhrzeit aktualisieren ===
  const liveTime = document.getElementById("liveTime");
  function updateClock() {
    const now = new Date();
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const str = `${days[now.getDay()]} ${now.toLocaleDateString("de-DE")} – ${now.toLocaleTimeString("de-DE")}`;
    liveTime.textContent = str;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // === Mini-Rechner ===
  document.getElementById("miniCalc").onclick = () => {
    const a = parseFloat(document.getElementById("miniA").value);
    const b = parseFloat(document.getElementById("miniB").value);
    const op = document.getElementById("miniOp").value;
    let res = "";
    if (!isNaN(a) && !isNaN(b)) {
      switch (op) {
        case "+": res = a + b; break;
        case "-": res = a - b; break;
        case "*": res = a * b; break;
        case "/": res = b !== 0 ? (a / b).toFixed(2) : "∞"; break;
      }
      document.getElementById("miniResult").textContent = `Ergebnis: ${res}`;
    } else {
      document.getElementById("miniResult").textContent = "Bitte beide Zahlen eingeben.";
    }
  };

  // === Notizen speichern ===
  const notes = document.getElementById("dashNotes");
  notes.value = localStorage.getItem("dash_notes") || "";
  notes.addEventListener("input", () => localStorage.setItem("dash_notes", notes.value));

  // === Winterdienststatus ===
  const winterSel = document.getElementById("winterStatus");
  winterSel.value = localStorage.getItem("winter_status") || "none";
  const winterBox = document.getElementById("winterStatusBox");
  function updateWinterColor() {
    const val = winterSel.value;
    let color = "#10b981";
    if (val === "ready") color = "#f59e0b";
    if (val === "active") color = "#ef4444";
    winterBox.style.boxShadow = `0 0 12px ${color}`;
    winterBox.style.border = `2px solid ${color}`;
    localStorage.setItem("winter_status", val);
  }
  winterSel.addEventListener("change", updateWinterColor);
  updateWinterColor();

  // === Wetterdaten (Mock) ===
  const wxData = JSON.parse(localStorage.getItem("wx_data") || "{}");
  document.getElementById("wxTemp").textContent = wxData.temp ?? "5 °C";
  document.getElementById("wxWind").textContent = wxData.wind ?? "12 km/h";
  document.getElementById("wxCond").textContent = wxData.cond ?? "Wolkig";
  document.getElementById("wxLocation").textContent = wxData.loc ?? "Hannover";

  // === KPIs ===
  document.getElementById("kpiReports").textContent = localStorage.getItem("reports_week") || "7";
  document.getElementById("kpiTemp").textContent = wxData.temp ?? "5 °C";
  document.getElementById("kpiLocation").textContent = wxData.loc ?? "Hannover";

  // === Letzte Berichte ===
  const reportHistoryBox = document.getElementById("reportHistory");
  const reports = JSON.parse(localStorage.getItem("reports_history") || "[]");

  function formatDateShort(str) {
    try {
      const d = new Date(str);
      if (!isNaN(d)) {
        return new Intl.DateTimeFormat("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        }).format(d);
      }
    } catch {}
    return str || "-";
  }

  function openReportHTML(full) {
    const dstr = new Intl.DateTimeFormat("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(full.date || Date.now()));
    const html = `
      <html lang="de"><head><meta charset="utf-8">
      <title>Tagesbericht_${dstr}</title>
      <style>
        body { font-family: Arial; margin: 30px; }
        h1 { color: #f97316; }
      </style>
      </head><body>
      <h1>Straßenwärter Tool – Bericht</h1>
      <p><b>Datum:</b> ${dstr}</p>
      <p><b>Ort:</b> ${full.street || "-"}</p>
      <p><b>Leitung:</b> ${full.leitung || "-"}</p>
      <hr><p>Dieser Bericht wurde automatisch aus dem Archiv geöffnet.</p>
      </body></html>`;
    const w = window.open("about:blank", "_blank");
    w.document.write(html);
    w.document.close();
  }

  function renderReports() {
    if (!reports.length) {
      reportHistoryBox.innerHTML = `<p class="muted center">Noch keine Berichte vorhanden.</p>`;
      return;
    }
    const last7 = reports.slice(-7).reverse();
    reportHistoryBox.innerHTML = last7.map((r, i) => `
      <div class="report-entry">
        <div class="report-header">🧾 ${formatDateShort(r.datum)}</div>
        <p><b>Kolonne:</b> ${r.kolonne || "-"}</p>
        <p><b>Ort:</b> ${r.ort || "-"}</p>
        <div class="report-actions">
          <button class="btn accent" data-open="${i}">Öffnen</button>
          <button class="btn danger" data-del="${i}">🗑️</button>
        </div>
      </div>
    `).join("");

    [...reportHistoryBox.querySelectorAll("[data-open]")].forEach(btn => {
      btn.onclick = () => openReportHTML(last7[btn.dataset.open]);
    });

    [...reportHistoryBox.querySelectorAll("[data-del]")].forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.del);
        reports.splice(reports.length - 1 - idx, 1);
        localStorage.setItem("reports_history", JSON.stringify(reports));
        renderReports();
      };
    });
  }
  renderReports();
}
