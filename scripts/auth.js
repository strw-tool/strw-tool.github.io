/* ================================================================
   Straßenwärter Tool – Dashboard v11 "Simplified Kachel-Layout"
   ---------------------------------------------------------------
   - Entfernt: Winterdienst, Mini-Rechner, Notizen, KPI-Karten
   - Neue Struktur: Wetter- & Zeitkacheln
   - Schnellzugriff: Tagesbericht, Informationen, RSA, Schilderwald, ARP-Nummern
   ================================================================ */

function loadDashboard() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="dash-v11 fade-in">
    <div class="v11-grid">

      <!-- Zeit & Datum -->
      <div class="card glass">
        <h3 class="card-title">📅 Datum & Uhrzeit</h3>
        <p id="liveTime" class="clock glow-text"></p>
      </div>

      <!-- Wetterinformationen -->
      <div class="card glass weather-card">
        <h3 class="card-title">🌦️ Wetterinformationen</h3>
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
      </div>

      <!-- Schnellzugriff -->
      <div class="card accent-card">
        <h3 class="card-title">⚡ Schnellzugriff</h3>
        <div class="quick-links">
          <button class="btn link" data-tab="report">📘 Tagesbericht</button>
          <button class="btn link" data-tab="info">ℹ️ Informationen</button>
          <button class="btn link" data-tab="rsa">🚧 RSA</button>
          <button class="btn link" data-tab="signs">🚦 Schilderwald</button>
          <button class="btn link" data-tab="arp">🧾 ARP-Nummern</button>
        </div>
      </div>

    </div>
  </section>
  `;

  // Live-Uhrzeit aktualisieren
  updateClock();
  setInterval(updateClock, 1000);

  // Wetterdaten laden (Dummy bis API oder lokale Funktion implementiert ist)
  loadWeather();

  // Eventlistener für Schnellzugriffe
  document.querySelectorAll(".quick-links .btn.link").forEach(btn => {
    btn.addEventListener("click", e => {
      const tab = e.target.getAttribute("data-tab");
      if (typeof loadTab === "function") {
        loadTab(tab);
      } else {
        alert("Modul '" + tab + "' wird geladen...");
      }
    });
  });
}

/* === Live-Uhrzeit === */
function updateClock() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById("liveTime").innerHTML = `
    <span class="date">${dateStr}</span>
    <span class="time">${timeStr}</span>
  `;
}


/* === Wetterdaten (Dummy) === */
function loadWeather() {
  // Beispielhafte Werte, kann später mit API ersetzt werden
  document.getElementById("wxLocation").textContent = "Musterstadt";
  document.getElementById("wxTemp").textContent = "14";
  document.getElementById("wxWind").textContent = "12";
  document.getElementById("wxCond").textContent = "Bewölkt";
  document.getElementById("wxIcon").textContent = "⛅";
}
