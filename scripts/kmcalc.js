function loadKmcalc() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <section class="kmcalc">
      <h2>🚗 Kilometerrechner</h2>
      <p>Trage deinen vorherigen und aktuellen Kilometerstand ein, um die gefahrenen Kilometer zu berechnen.</p>

      <div class="form-grid">
        <label>📉 Kilometerstand vorher
          <input id="kmBefore" type="number" placeholder="z. B. 12345">
        </label>
        <label>📈 Kilometerstand nachher
          <input id="kmAfter" type="number" placeholder="z. B. 12560">
        </label>
      </div>

      <button id="calcKm" class="btn">Berechnen</button>
      <div id="kmResult" class="result-box"></div>
    </section>
  `;

  document.getElementById("calcKm").addEventListener("click", () => {
    const before = parseFloat(document.getElementById("kmBefore").value);
    const after = parseFloat(document.getElementById("kmAfter").value);
    const result = document.getElementById("kmResult");

    if (isNaN(before) || isNaN(after)) {
      result.innerHTML = "<p style='color:#f87171;'>⚠️ Bitte beide Werte eingeben!</p>";
      return;
    }
    if (after < before) {
      result.innerHTML = "<p style='color:#f87171;'>⚠️ Der aktuelle Kilometerstand darf nicht kleiner sein!</p>";
      return;
    }

    const diff = after - before;
    result.innerHTML = `
      <p style="font-size:1.1rem; margin-top:10px;">
        🚘 <strong>Gefahrene Kilometer:</strong> ${diff.toLocaleString("de-DE")} km
      </p>
    `;
  });
}
