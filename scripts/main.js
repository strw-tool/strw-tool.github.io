document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("mainContent");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("nav button[data-tab]");
    if (!btn) return;
    e.preventDefault();
    if (!(window.Auth && window.Auth.hasSession && window.Auth.hasSession())) return;
    const id = btn.dataset.tab;
    document.querySelectorAll("nav button[data-tab]").forEach(b => b.classList.toggle("active", b === btn));
    loadTab(id);
  });

  // ------------------------------
  // 🔧 Hauptladefunktion für Tabs
  // ------------------------------
  window.loadTab = function (tab) {
    if (mainContent) mainContent.innerHTML = "<p style='text-align:center;'>⏳ Wird geladen...</p>";
    switch (tab) {
      case "dashboard":
        typeof loadDashboard === "function" && loadDashboard();
        break;
      case "kmcalc": 
        typeof loadKmcalc === "function" && loadKmcalc(); 
        break;
      case "calc":
        typeof loadCalc === "function" && loadCalc();
        break;
      case "worktime":
        typeof loadWorktime === "function" && loadWorktime();
        break;
      case "rsa":
        typeof loadRSA === "function" && loadRSA();
        break;
      case "signs":
        typeof loadSigns === "function" && loadSigns();
        break;
      case "winter":
        typeof loadWinter === "function" && loadWinter();
        break;
      case "report":
        typeof loadReport === "function" && loadReport();
        break;
      case "settings":
        typeof loadSettings === "function" && loadSettings();
        break;

      // ✨ NEUES MODUL: Ausbildungsnachweis
      case "ausbildungsnachweis":
        if (window.AppModules && window.AppModules.ausbildungsnachweis) {
          window.AppModules.ausbildungsnachweis.render(mainContent);
        } else if (typeof loadAusbildungsnachweis === "function") {
          loadAusbildungsnachweis();
        } else {
          mainContent.innerHTML = "<p style='text-align:center;color:#ccc;'>⚠️ Modul 'Ausbildungsnachweis' nicht gefunden.</p>";
        }
        break;

      // 🔁 Standardfallback
      default:
        typeof loadDashboard === "function" && loadDashboard();
    }
  };

  // ------------------------------
  // 🔐 Beim Start: Dashboard laden
  // ------------------------------
  if (window.Auth && window.Auth.hasSession && window.Auth.hasSession()) {
    document.querySelector("nav button[data-tab='dashboard']")?.classList.add("active");
    loadTab("dashboard");
  }
});
