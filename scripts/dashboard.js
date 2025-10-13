/* ================================================================
   Straßenwärter Tool – Dashboard v10 "Aurora + Dynamic"
   - KPI-Karten mit Icons & sanfter Pulse-Animation
   - Wetterkarte kompakt, mit Icon-Wechsel & Glow
   - Glaskarten mit Hover-Lichtkante
   - Reaktive Schnellzugriffe
   ================================================================ */

function loadDashboard() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="dash-v10 fade-in">
    <div class="v10-grid">

      <!-- Linke Spalte -->
      <div class="v10-col">
        <!-- KPI-Row -->
        <div class="v10-row">
          <div class="card kpi-card">
            <div class="kpi-icon">📄</div>
            <div>
              <div class="kpi-val" id="kpiReports">–</div>
              <div class="kpi-label">Berichte diese Woche</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon">🌡️</div>
            <div>
              <div class="kpi-val" id="kpiTemp">– °C</div>
              <div class="kpi-label">Ø Temperatur</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon">📍</div>
            <div>
              <div class="kpi-val" id="kpiLocation">–</div>
              <div class="kpi-label">Letzter Einsatzort</div>
            </div>
          </div>
        </div>

        <!-- Uhr -->
        <div class="card glass">
          <h3 class="card-title">🕒 Datum & Uhrzeit</h3>
          <p id="liveTime" class="clock glow-text"></p>
        </div>

        <!-- Wetter -->
        <div class="card weather-card">
          <h3 class="card-title">🌦️ Wetter & Einsatzinfos</h3>
          <div class="weather-wrap">
            <div class="weather-details">
              <p><b>Ort:</b> <span id="wxLocation">–</span></p>
              <p><b>Temperatur:</b> <span id="wxTemp">– °C</span></p>
              <p><b>Wind:</b> <span id="wxWind">– km/h</span></p>
              <p><b>Bedingungen:</b> <span id="wxCond">–</span></p>
            </div>
            <div class="weather-visual">
              <div class="wx-icon" id="wxIcon">🌤️</div>
              <div class="wx-glow"></div>
            </div>
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

        <!-- Mini-Rechner -->
        <div class="card glass">
          <h3 class="card-title">🧮 Mini-Rechner</h3>
          <div class="mini-grid">
            <input type="number" id="miniA" placeholder="Zahl A">
            <select id="miniOp">
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input type="number" id="miniB" placeholder="Zahl B">
            <button id="miniCalc" class="btn accent">=</button>
          </div>
          <p id="miniResult" class="mini-result glow-text"></p>
        </div>

        <!-- Notizen -->
        <div class="card glass">
          <h3 class="card-title">🗒️ Notizen</h3>
          <textarea id="dashNotes" rows="4" placeholder="Notizen oder Aufgaben hier eingeben..."></textarea>
        </div>

        <!-- Schnellzugriff -->
        <div class="card accent-card">
          <h3 class="card-title">⚡ Schnellzugriff</h3>
          <div class="quick-links">
            <button class="btn link" data-tab="calc">📏 Rechnungen</button>
            <button class="btn link" data-tab="rsa">🚧 Regelpläne</button>
            <button class="btn link" data-tab="signs">🚦 Schilderwald</button>
            <button class="btn link" data-tab="report">🧾 Tagesbericht</button>
            <button class="btn link" data-tab="winter">❄️ Winterdienst</button>
          </div>
        </div>
      </div>

      <!-- Rechte Spalte -->
      <div class="v10-col">
        <div class="card glass">
          <h3 class="card-title">📚 Letzte Berichte</h3>
          <div id="reportHistory" class="report-list"></div>
        </div>
      </div>

    </div>
  </section>
  `;

  /* ========== Logik ========== */
  // Uhr
  const liveTime = document.getElementById("liveTime");
  const tick = () => (liveTime.textContent =
    new Date().toLocaleString("de-DE", {
      weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }));
  tick(); setInterval(tick, 1000);

  // Mini-Rechner
  document.getElementById("miniCalc").onclick = () => {
    const a = parseFloat(document.getElementById("miniA").value);
    const b = parseFloat(document.getElementById("miniB").value);
    const op = document.getElementById("miniOp").value;
    const out = document.getElementById("miniResult");
    if (isNaN(a) || isNaN(b)) return (out.textContent = "Bitte beide Zahlen eingeben.");
    const r = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : (b !== 0 ? (a / b).toFixed(2) : "∞");
    out.textContent = `Ergebnis: ${r}`;
  };

  // Notizen
  const notes = document.getElementById("dashNotes");
  notes.value = localStorage.getItem("dash_notes") || "";
  notes.addEventListener("input", () => localStorage.setItem("dash_notes", notes.value));

  // Wetter + KPIs
  const wx = JSON.parse(localStorage.getItem("wx_data") || "{}");
  const cond = wx.cond ?? "Wolkig";
  const iconMap = { Sonne:"☀️", Wolkig:"🌤️", Regen:"🌧️", Schnee:"❄️", Nebel:"🌫️", Sturm:"💨" };
  document.getElementById("wxIcon").textContent = iconMap[cond] || "🌦️";
  document.getElementById("wxTemp").textContent = wx.temp ?? "5 °C";
  document.getElementById("wxWind").textContent = wx.wind ?? "12 km/h";
  document.getElementById("wxCond").textContent = cond;
  document.getElementById("wxLocation").textContent = wx.loc ?? "Hannover";

  document.getElementById("kpiReports").textContent = localStorage.getItem("reports_week") || "7";
  document.getElementById("kpiTemp").textContent = wx.temp ?? "5 °C";
  document.getElementById("kpiLocation").textContent = wx.loc ?? "Hannover";

  // Winterdienststatus
  const winterSel = document.getElementById("winterStatus");
  const winterBox = document.getElementById("winterStatusBox");
  winterSel.value = localStorage.getItem("winter_status") || "none";
  const setWinter = () => {
    const v = winterSel.value;
    const c = v === "active" ? "#ef4444" : v === "ready" ? "#f59e0b" : "#10b981";
    winterBox.style.boxShadow = `0 0 16px ${c}`;
    winterBox.style.border = `2px solid ${c}`;
    localStorage.setItem("winter_status", v);
  };
  winterSel.addEventListener("change", setWinter); setWinter();

  // Berichte
  const list = document.getElementById("reportHistory");
  const reports = JSON.parse(localStorage.getItem("reports_history") || "[]");
  list.innerHTML = reports.length ? reports.slice(-7).reverse().map(r => `
    <div class="report-item">
      <div class="report-head">🧾 ${r.datum || "Unbekannt"}</div>
      <div class="report-meta">
        <span><b>Kolonne:</b> ${r.kolonne || "-"}</span>
        <span><b>Ort:</b> ${r.ort || "-"}</span>
      </div>
    </div>
  `).join("") : `<p class="muted center">Noch keine Berichte vorhanden.</p>`;
}
