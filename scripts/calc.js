// ========================================================
// Straßenwärter-Helfer – calc.js (Final mit Maßlinien + optimalem Abstand)
// ========================================================

(function () {

  // ---- 1. Hauptladefunktion für Tab "Rechnungen" ----
  window.loadCalcTab = function loadCalcTab(main) {
    const container = main || document.getElementById("mainContent");
    if (!container) return console.error("mainContent nicht gefunden!");

    container.innerHTML = `
      <div class="calc-container">

        <h2>📏 Rechen- & Materialbedarf</h2>

        <!-- W/Z-Wert -->
        <section class="calc-section card">
          <h3>💧 W/Z-Wert Rechner</h3>
          <div class="inputs">
            <label>Wassermenge (l): <input type="number" id="wasser" /></label>
            <label>Zementmenge (kg): <input type="number" id="zement" /></label>
          </div>
          <button id="btnWZ" class="calc-btn">Berechnen</button>
          <div id="outWZ" class="calc-output"></div>
        </section>

        <!-- Prozentrechner -->
        <section class="calc-section card">
          <h3>📊 Prozentrechner</h3>
          <div class="inputs">
            <label>Prozentwert (W): <input type="number" id="pw" /></label>
            <label>Grundwert (G): <input type="number" id="gw" /></label>
            <label>Prozentsatz (%): <input type="number" id="ps" /></label>
          </div>
          <button id="btnProzent" class="calc-btn">Berechnen</button>
          <div id="outProzent" class="calc-output"></div>
        </section>

        <!-- Flächenrechner -->
        <section class="calc-section card">
          <h3>📐 Flächenrechner</h3>
          <div class="inputs">
            <label>Länge (m): <input type="number" id="flL" /></label>
            <label>Breite (m): <input type="number" id="flB" /></label>
          </div>
          <button id="btnFlaeche" class="calc-btn">Berechnen</button>
          <div id="outFlaeche" class="calc-output"></div>
        </section>

        <!-- RSA -->
        <section class="calc-section card">
          <h3>🚧 RSA-Materialbedarf</h3>
          <div class="inputs">
            <label>Gesamtlänge (m): <input type="number" id="rsaLaenge" value="50" /></label>
            <label>Breite der Fahrbahn (m): <input type="number" id="rsaBreite" value="3.25" /></label>
            <label>Verziehungsmaß: <input type="number" id="rsaVerziehung" value="3" /></label>
            <label>Max. Abstand der Längsbaken (m): <input type="number" id="rsaAbstandLaengs" value="12" /></label>
            <label>Max. Abstand der Querbaken (m): <input type="number" id="rsaAbstandQuer" value="0.6" /></label>
          </div>
          <button id="btnRSA" class="calc-btn">Berechnen & anzeigen</button>
          <div id="outRSA" class="calc-output"></div>
          <div class="canvas-box">
            <canvas id="rsaCanvas" width="950" height="550"></canvas>
            <p id="optimalAbstand" style="margin-top:8px;font-weight:600;color:#38bdf8;"></p>
          </div>
        </section>

      </div>
    `;

    bindCalcEvents();
  };

  // ---- 2. Events ----
  function bindCalcEvents() {
    const $ = (id) => document.getElementById(id);
    $("btnWZ").onclick = calcWZ;
    $("btnProzent").onclick = calcProzent;
    $("btnFlaeche").onclick = calcFlaeche;
    $("btnRSA").onclick = calcRSA;
  }

  // ---- 3. W/Z-Wert ----
  function calcWZ() {
    const wasser = +document.getElementById("wasser").value;
    const zement = +document.getElementById("zement").value;
    const out = document.getElementById("outWZ");

    if (isNaN(wasser) || isNaN(zement) || zement === 0)
      return outputError(out, "Bitte gültige Werte eingeben!");

    const wz = wasser / zement;
    const bewertung = wz < 0.4 ? "🔵 Zu dicht (zu wenig Wasser)"
      : wz < 0.55 ? "🟢 Optimaler W/Z-Wert"
      : "🔴 Zu hoch (Beton wird porös)";
    out.innerHTML = `
      <div class="result-box">
        <h4>Rechenweg & Formel</h4>
        <p>Formel: <code>W/Z = Wasser / Zement</code></p>
        <p>Berechnung: ${wasser} ÷ ${zement} = <strong>${wz.toFixed(2)}</strong></p>
        <p><strong>Ergebnis:</strong> W/Z-Wert = ${wz.toFixed(2)}</p>
        <p>${bewertung}</p>
      </div>`;
  }

  // ---- 4. Prozentrechner ----
  function calcProzent() {
    const W = +pw.value, G = +gw.value, P = +ps.value;
    const out = outProzent;
    let html = "";

    if (!isNaN(W) && !isNaN(G)) {
      const pz = (W / G) * 100;
      html = `
        <div class="result-box">
          <h4>Prozentsatz berechnen</h4>
          <p>Formel: <code>P = (W / G) × 100</code></p>
          <p>Rechenweg: (${W} ÷ ${G}) × 100 = <strong>${pz.toFixed(2)}%</strong></p>
        </div>`;
    } else if (!isNaN(W) && !isNaN(P)) {
      const g = (W * 100) / P;
      html = `
        <div class="result-box">
          <h4>Grundwert berechnen</h4>
          <p>Formel: <code>G = (W × 100) / P</code></p>
          <p>Rechenweg: (${W} × 100) ÷ ${P} = <strong>${g.toFixed(2)}</strong></p>
        </div>`;
    } else if (!isNaN(G) && !isNaN(P)) {
      const w = (G * P) / 100;
      html = `
        <div class="result-box">
          <h4>Prozentwert berechnen</h4>
          <p>Formel: <code>W = (G × P) / 100</code></p>
          <p>Rechenweg: (${G} × ${P}) ÷ 100 = <strong>${w.toFixed(2)}</strong></p>
        </div>`;
    } else {
      html = "<p class='error'>Bitte zwei Werte eingeben!</p>";
    }
    out.innerHTML = html;
  }

  // ---- 5. Flächenrechner ----
  function calcFlaeche() {
    const l = +flL.value, b = +flB.value;
    const out = outFlaeche;
    if (isNaN(l) || isNaN(b)) return outputError(out, "Ungültige Werte!");
    const A = l * b;
    out.innerHTML = `
      <div class="result-box">
        <h4>Flächenberechnung</h4>
        <p>Formel: <code>A = Länge × Breite</code></p>
        <p>Rechenweg: ${l} × ${b} = <strong>${A.toFixed(2)} m²</strong></p>
      </div>`;
  }

  // ---- 6. RSA-Berechnung + Visualisierung ----
  function calcRSA() {
    const L = +rsaLaenge.value, B = +rsaBreite.value, V = +rsaVerziehung.value;
    const aL = +rsaAbstandLaengs.value, aQ = +rsaAbstandQuer.value;
    const out = outRSA;

    const verziehungsl = B * V;
    const felderQuer = Math.ceil(B / aQ);
    const bakenQuer = felderQuer + 1;
    const abstandQuer = verziehungsl / felderQuer;
    const rest = L - verziehungsl * 2;
    const laengsBaken = Math.max(0, Math.ceil(rest / aL) + 1 - 2);
    const gesamt = laengsBaken + bakenQuer * 2;
    const optimalAbstand = rest / (laengsBaken + 1);

    out.innerHTML = `
      <div class="result-box">
        <h4>Berechnung RSA-Materialbedarf</h4>
        <p>Formel Verziehungslänge: <code>Vₗ = Breite × Verziehungsmaß</code></p>
        <p>→ ${B} × ${V} = <strong>${verziehungsl.toFixed(2)} m</strong></p>
        <p>Formel Querfelder: <code>F = Breite ÷ Abstand Quer</code></p>
        <p>→ ${B} ÷ ${aQ} = <strong>${felderQuer}</strong></p>
        <p>Leitbaken Quer: Felder + 1 = <strong>${bakenQuer}</strong> pro Seite</p>
        <p>Formel Abstand Querbaken: <code>Abstand = Verziehungslänge ÷ Felder</code></p>
        <p>→ ${verziehungsl.toFixed(2)} ÷ ${felderQuer} = <strong>${abstandQuer.toFixed(2)} m</strong></p>
        <p>Formel Längsbaken: <code>L = ((Länge − (Verziehungslänge × 2)) ÷ Abstand Längs) + 1 − 2</code></p>
        <p>→ ((<strong>${L}</strong> − (${verziehungsl.toFixed(2)} × 2)) ÷ ${aL}) + 1 − 2 = <strong>${laengsBaken}</strong></p>
        <p><strong>Gesamtbedarf:</strong> ${gesamt} Baken</p>
      </div>`;

    document.getElementById("optimalAbstand").innerText = `Optimaler Längsabstand: ${optimalAbstand.toFixed(2)} m`;

    drawRSA(verziehungsl, abstandQuer, laengsBaken, bakenQuer, aL, optimalAbstand);
  }

  // ---- 7. Zeichnung RSA mit Maßlinien ----
  function drawRSA(verziehungsl, abstandQuer, laengsBaken, bakenQuer, aL, optimalAbstand) {
    const c = rsaCanvas;
    const ctx = c.getContext("2d");
    c.width = 950; c.height = 550;
    ctx.clearRect(0, 0, c.width, c.height);

    const w = c.width, h = c.height;
    const streetY = h * 0.45;

    // Straße
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(w * 0.36, streetY, w * 0.38, h * 0.1);

    const blueX = w * 0.25;
    const blueTop = streetY - h * 0.1;
    const blueBot = streetY + h * 0.2;
    const gap = 40;
    const spanX = w * 0.4;
    const slope = h * 0.18;

    const topStart = { x: blueX + gap, y: blueTop - h * 0.05 };
    const topEnd = { x: topStart.x + spanX, y: topStart.y - slope };
    const botStart = { x: blueX + gap, y: blueBot + h * 0.05 };
    const botEnd = { x: botStart.x + spanX, y: botStart.y + slope };

    drawBakenLine(ctx, topStart, topEnd, "#f97316", bakenQuer);
    drawBakenLine(ctx, botStart, botEnd, "#f97316", bakenQuer);

    // Blaue Längsbaken
    const n = laengsBaken;
    const totalH = (botStart.y + botEnd.y) / 2 - (topStart.y + topEnd.y) / 2;
    const yStart = (topStart.y + topEnd.y) / 2;
    const step = totalH / (n + 1);

    for (let i = 1; i <= n; i++) {
      const y = yStart + i * step;
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(blueX - 3, y - 10, 6, 20);

      if (i < n) {
        // Maßlinie mit Pfeilen
        const y2 = y + step;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(blueX + 15, y);
        ctx.lineTo(blueX + 15, y2);
        ctx.stroke();

        drawArrow(ctx, blueX + 15, y, blueX + 15, y + 10);
        drawArrow(ctx, blueX + 15, y2, blueX + 15, y2 - 10);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "14px Inter";
        ctx.fillText(`${optimalAbstand.toFixed(2)} m`, blueX + 50, y + step / 2);
      }
    }

    // Beschriftung Querabstände
    ctx.font = "16px Inter";
    ctx.fillStyle = "#f97316";
    ctx.textAlign = "center";
    ctx.fillText(`${abstandQuer.toFixed(2)} m (Quer)`, (topStart.x + topEnd.x) / 2, topEnd.y - 20);
  }

  // Pfeilzeichner
  function drawArrow(ctx, fromx, fromy, tox, toy) {
    const headlen = 6;
    const angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  function drawBakenLine(ctx, start, end, color, count) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      ctx.fillStyle = color;
      ctx.fillRect(x - 3, y - 10, 6, 20);
    }
  }

  // ---- Hilfsfunktionen ----
  function outputError(el, msg) { el.innerHTML = `<p class='error'>❌ ${msg}</p>`; }

  // ---- 8. Autoload bei Tabklick ----
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab='calc']");
    if (btn) setTimeout(() => loadCalcTab(document.getElementById("mainContent")), 50);
  });

})();

