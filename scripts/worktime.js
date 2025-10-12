/* ===========================================================
   Straßenwärter-Helfer – worktime.js (v1.1)
   Arbeitszeitrechner – Freie Eingabe (mit oder ohne Pause)
   =========================================================== */

function loadWorktime() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
  <section class="card fade-in">
    <div class="section-title"><h2>🕓 Arbeitszeitrechner</h2></div>
    <p>Trage deine Arbeitszeiten (z. B. <b>6:15</b> oder <b>14.5</b>) manuell ein. Pausen optional.</p>

    <table id="workTable" class="card" style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid rgba(255,255,255,.2);">
          <th style="padding:6px;">Tag</th>
          <th style="padding:6px;">Beginn</th>
          <th style="padding:6px;">Ende</th>
          <th style="padding:6px;">Pause (min)</th>
          <th style="padding:6px;">Arbeitszeit (h)</th>
        </tr>
      </thead>
      <tbody>
        ${["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"]
          .map(t => `
          <tr data-day="${t}" style="border-bottom:1px solid rgba(255,255,255,.05);">
            <td style="padding:6px;">${t}</td>
            <td><input type="text" class="startTime" data-day="${t}" placeholder="z. B. 6:00"></td>
            <td><input type="text" class="endTime" data-day="${t}" placeholder="z. B. 14:30"></td>
            <td><input type="number" class="pauseMin" data-day="${t}" min="0" step="5" value="0" style="width:70px;"></td>
            <td><span class="hoursOut" data-day="${t}">–</span></td>
          </tr>`).join("")}
      </tbody>
    </table>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;">
      <div>
        <label><input type="checkbox" id="includeWeekend"> Wochenende einbeziehen</label>
      </div>
      <div>
        <b>Wochensumme:</b> <span id="weekTotal" style="font-size:1.3rem;">0.00</span> h
      </div>
    </div>

    <div style="margin-top:1rem;text-align:right;">
      <button id="resetWorktime" class="btn danger">🗑️ Zurücksetzen</button>
    </div>
  </section>
  `;

  const days = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
  const table = document.getElementById("workTable");
  const weekTotal = document.getElementById("weekTotal");
  const includeWeekend = document.getElementById("includeWeekend");

  // === LocalStorage laden ===
  const saved = JSON.parse(localStorage.getItem("worktime_data") || "{}");
  days.forEach(day => {
    if (saved[day]) {
      const { start, end, pause } = saved[day];
      if (start) qs(`input.startTime[data-day="${day}"]`, table).value = start;
      if (end) qs(`input.endTime[data-day="${day}"]`, table).value = end;
      if (pause) qs(`input.pauseMin[data-day="${day}"]`, table).value = pause;
    }
  });

  if (saved.includeWeekend) {
    includeWeekend.checked = true;
  } else {
    toggleWeekend(false);
  }

  includeWeekend.addEventListener("change", () => {
    toggleWeekend(includeWeekend.checked);
    saveData();
  });

  function toggleWeekend(show) {
    ["Samstag","Sonntag"].forEach(d => {
      const row = qs(`tr[data-day="${d}"]`, table);
      row.style.display = show ? "table-row" : "none";
    });
  }

  // === Eingaben beobachten ===
  table.querySelectorAll("input").forEach(inp => inp.addEventListener("input", updateAll));

  function updateAll() {
    let total = 0;
    const data = {};
    days.forEach(day => {
      const start = qs(`input.startTime[data-day="${day}"]`, table).value.trim();
      const end = qs(`input.endTime[data-day="${day}"]`, table).value.trim();
      const pause = parseFloat(qs(`input.pauseMin[data-day="${day}"]`, table).value) || 0;
      const cell = qs(`.hoursOut[data-day="${day}"]`, table);

      if (start && end) {
        const hours = calcHours(start, end, pause);
        if (!isNaN(hours)) {
          cell.textContent = hours.toFixed(2);
          total += hours;
          data[day] = { start, end, pause };
        } else {
          cell.textContent = "⚠️";
        }
      } else {
        cell.textContent = "–";
      }
    });
    weekTotal.textContent = total.toFixed(2);
    data.includeWeekend = includeWeekend.checked;
    localStorage.setItem("worktime_data", JSON.stringify(data));
  }

  // === Zeitberechnung (manuelle Eingabe tolerant) ===
  function parseTime(str) {
    if (!str) return null;
    str = str.replace(",", ".").trim();
    // Beispiel: 6:15, 6.25, 14, 14.5
    if (str.includes(":")) {
      const [h, m] = str.split(":").map(Number);
      return h * 60 + (m || 0);
    } else if (str.includes(".")) {
      const [h, dec] = str.split(".").map(Number);
      return h * 60 + Math.round((dec / 100) * 60);
    } else if (!isNaN(str)) {
      // reine Zahl = Stunde (z. B. 7 = 07:00)
      return parseFloat(str) * 60;
    }
    return null;
  }

  function calcHours(startStr, endStr, pauseMin) {
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    if (start === null || end === null) return NaN;
    let diff = end - start;
    if (diff < 0) diff += 24 * 60; // Nachtarbeit
    diff -= pauseMin;
    return diff / 60;
  }

  // === Reset ===
  document.getElementById("resetWorktime").addEventListener("click", () => {
    if (confirm("Alle Zeiten löschen?")) {
      localStorage.removeItem("worktime_data");
      loadWorktime();
    }
  });

  // === Initial berechnen ===
  updateAll();
}

/* === Navigation-Listener === */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tab='worktime']");
  if (btn) setTimeout(() => loadWorktime(), 50);
});

/* === kleine Helper-Funktion === */
function qs(sel, root=document){ return root.querySelector(sel); }
