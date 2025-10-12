function loadSettings() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <section class="card fade-in">
      <div class="section-title"><h2>⚙️ Einstellungen</h2></div>

      <div class="card">
        <h3>🔐 Anmeldung</h3>
        <p>Steuere hier deine Sitzung.</p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;">
          <button class="btn secondary" id="rememberBtn">Login merken (14 Tage)</button>
          <button class="btn danger" id="logoutBtn">Abmelden</button>
        </div>
        <p id="authStatus" style="margin-top:.6rem;color:var(--muted);"></p>
      </div>

      <div class="card">
        <h3>💾 Daten</h3>
        <button class="btn" id="clearHistory">Berichtshistorie leeren</button>
      </div>
    </section>
  `;

  const status = document.getElementById("authStatus");
  function refresh() {
    const has = (window.Auth && window.Auth.hasSession && window.Auth.hasSession());
    status.textContent = has ? "Status: angemeldet" : "Status: abgemeldet";
  }
  refresh();

  document.getElementById("logoutBtn").onclick = () => {
    if (window.Auth && window.Auth.clearSession) {
      window.Auth.clearSession();
      location.reload();
    }
  };
  document.getElementById("rememberBtn").onclick = () => {
    try {
      localStorage.setItem("auth.remember", btoa(JSON.stringify({ exp: Date.now() + 1000*60*60*24*14 })));
      alert("Wird auf diesem Gerät gemerkt (14 Tage).");
      refresh();
    } catch (e) {}
  };
  document.getElementById("clearHistory").onclick = () => {
    localStorage.removeItem("reports_history");
    alert("Berichtshistorie wurde geleert.");
  };
}
