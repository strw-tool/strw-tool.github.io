/* ===========================================
   Straßenwärter-Helfer – winter.js (v4 modular)
   =========================================== */

function loadWinter() {
  const main = document.getElementById("mainContent");

  main.innerHTML = `
    <section class="card fade-in">
      <div class="section-title"><h2>❄️ Winterdienst-Mischung</h2></div>
      <p>Berechne die optimale Sole-/Salz-Mischung und den Verbrauch für deine Strecke.</p>

      <div style="display:grid; gap:0.8rem; grid-template-columns: 1fr 1fr;">
        <div>
          <label>Außentemperatur (°C):</label>
          <input id="winterTemp" type="number" step="0.1" placeholder="-2.0">
        </div>
        <div>
          <label>Streckenlänge (km):</label>
          <input id="winterLength" type="number" step="0.1" placeholder="z. B. 12.5">
        </div>
      </div>

      <div style="display:grid; gap:0.8rem; grid-template-columns: 1fr 1fr; margin-top:0.8rem;">
        <div>
          <label>Streubreite (m):</label>
          <input id="winterWidth" type="number" step="0.1" placeholder="z. B. 3.5">
        </div>
        <div>
          <label>Soll-Dosierung (g/m²):</label>
          <input id="winterDose" type="number" step="1" placeholder="z. B. 20">
        </div>
      </div>

      <button class="btn accent" id="calcMix">💧 Mischung & Verbrauch berechnen</button>

      <div id="mixResult" class="resultText" style="margin-top:1rem;"></div>
    </section>

    <section class="card fade-in">
      <div class="section-title"><h2>🌡️ Wetterdaten</h2></div>
      <p id="wxStatus">Messung wird durchgeführt …</p>
    </section>
  `;

  // Temperatur automatisch füllen
  fetchWeather().then(wx => {
    if (wx.temp != null) {
      document.getElementById("winterTemp").value = wx.temp.toFixed(1);
      document.getElementById("wxStatus").innerHTML = `🌍 Temperatur: <b>${wx.temp.toFixed(1)}°C</b> • Wind: <b>${wx.wind.toFixed(0)} km/h</b>`;
    } else {
      document.getElementById("wxStatus").textContent = "⚠️ Keine Wetterdaten abrufbar (offline oder Standort verweigert).";
    }
  });

  // Button
  document.getElementById("calcMix").onclick = winterCalculate;
}

/* ===========================================
   Berechnung
   =========================================== */

function winterCalculate() {
  const t = parseFloat(document.getElementById("winterTemp").value);
  const len = parseFloat(document.getElementById("winterLength").value);
  const width = parseFloat(document.getElementById("winterWidth").value);
  const dose = parseFloat(document.getElementById("winterDose").value);
  const out = document.getElementById("mixResult");

  if ([t, len, width, dose].some(v => isNaN(v) || v <= 0)) {
    out.innerHTML = "⚠️ Bitte alle Felder korrekt ausfüllen.";
    out.style.color = "#f87171";
    return;
  }

  // Salz-Sole-Mischungsverhältnis (Faustwerte)
  let mix = "NaCl-Trockensalz";
  if (t < -8) mix = "Sole 23% + Feuchtsalz (FS30)";
  else if (t < -5) mix = "Feuchtsalz (FS30)";
  else if (t < -2) mix = "Trockensalz (NaCl)";
  else mix = "Geringe Dosierung (Präventivstreuung)";

  // Verbrauch berechnen
  const flaeche = len * 1000 * width;          // m²
  const totalSalt = (dose * flaeche) / 1000;   // g → kg
  const totalLiters = (mix.includes("Sole")) ? totalSalt * 0.3 : 0; // ca. 30% Soleanteil

  out.style.color = "var(--text)";
  out.innerHTML = `
    <h3>Ergebnis:</h3>
    <p><b>Empfohlene Mischung:</b> ${mix}</p>
    <p><b>Verbrauch:</b> ${totalSalt.toFixed(0)} kg Salz${totalLiters ? ` + ${totalLiters.toFixed(0)} L Sole` : ""}</p>
    <p><b>Behandelte Fläche:</b> ${flaeche.toLocaleString()} m²</p>
    <hr>
    <p style="color:var(--muted); font-size:0.9rem;">
      Richtwerte nach Praxisempfehlung: FS30 ≈ 20–25 g/m², Sole 23% ≈ 8–12 ml/m².
    </p>
  `;
}
