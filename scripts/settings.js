/* ===========================================
   Straßenwärter-Helfer – settings.js (v4 modular)
   =========================================== */

function loadSettings() {
  const main = document.getElementById("mainContent");

  main.innerHTML = `
    <section class="card fade-in">
      <div class="section-title"><h2>⚙️ Einstellungen</h2></div>

      <label>Sprache:</label>
      <select id="langSelect">
        <option value="de">🇩🇪 Deutsch</option>
        <option value="en">🇬🇧 English</option>
      </select>

      <label>Design:</label>
      <select id="themeSelect">
        <option value="dark">🌙 Dunkel</option>
        <option value="light">☀️ Hell</option>
      </select>

      <hr>

      <h3>Datenverwaltung</h3>
      <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.8rem;">
        <button class="btn accent" id="exportData">💾 Backup exportieren</button>
        <input type="file" id="importFile" accept=".json" style="display:none;">
        <button class="btn accent" id="importData">📂 Backup importieren</button>
      </div>

      <button class="btn danger" id="clearData">🗑️ Alle Daten löschen</button>
      <button class="btn ghost" id="resetSW" style="margin-top:0.5rem;">♻️ Cache & PWA zurücksetzen</button>

      <hr>
      <p style="color:var(--muted); font-size:0.9rem;">Version 4.0 • Offline-First PWA</p>
    </section>
  `;

  /* ========== Settings initialisieren ========== */
  const themeSel = document.getElementById("themeSelect");
  const langSel = document.getElementById("langSelect");
  const storedTheme = localStorage.getItem("sw_theme") || "dark";
  const storedLang = localStorage.getItem("sw_lang") || "de";

  themeSel.value = storedTheme;
  langSel.value = storedLang;

  /* ========== Theme-Wechsel ========== */
  themeSel.onchange = () => {
    const val = themeSel.value;
    applyTheme(val);
    localStorage.setItem("sw_theme", val);
  };

  /* ========== Sprache-Wechsel ========== */
  langSel.onchange = () => {
    const val = langSel.value;
    localStorage.setItem("sw_lang", val);
    alert(val === "de" ? "Sprache: Deutsch" : "Language: English");
  };

  /* ========== Datenexport ========== */
  document.getElementById("exportData").onclick = () => {
    const data = { ...localStorage };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const today = new Date().toISOString().slice(0,10);
    a.download = `Strassenwaerter_Backup_${today}.json`;
    a.click();
  };

  /* ========== Datenimport ========== */
  document.getElementById("importData").onclick = () => {
    document.getElementById("importFile").click();
  };
  document.getElementById("importFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        for (const [key, val] of Object.entries(data)) localStorage.setItem(key, val);
        alert("✅ Backup erfolgreich importiert! Seite wird neu geladen.");
        location.reload();
      } catch (err) {
        alert("⚠️ Fehler beim Import: Keine gültige Datei.");
      }
    };
    reader.readAsText(file);
  };

  /* ========== Daten löschen ========== */
  document.getElementById("clearData").onclick = () => {
    if (confirm("Wirklich alle gespeicherten Daten löschen?")) {
      localStorage.clear();
      alert("🗑️ Alle Daten wurden gelöscht. Seite wird neu geladen.");
      location.reload();
    }
  };

  /* ========== ServiceWorker / Cache reset ========== */
  document.getElementById("resetSW").onclick = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) await reg.unregister();
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      alert("♻️ ServiceWorker & Cache gelöscht.\nBitte Seite neu laden (STRG+F5).");
    } catch (e) {
      alert("Fehler beim Zurücksetzen: " + e.message);
    }
  };
}

/* ===========================================
   Hilfsfunktion für Theme
   =========================================== */

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "light") {
    root.style.setProperty("--bg", "#f1f5f9");
    root.style.setProperty("--text", "#0f172a");
    root.style.setProperty("--bg-card", "rgba(255,255,255,0.85)");
  } else {
    root.style.setProperty("--bg", "#0f172a");
    root.style.setProperty("--text", "#f1f5f9");
    root.style.setProperty("--bg-card", "rgba(255,255,255,0.05)");
  }
}
