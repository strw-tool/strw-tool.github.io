document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("mainContent");

  // ------------------------------
  // 🧭 Navigation (Tabs)
  // ------------------------------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("nav button[data-tab]");
    if (!btn) return;
    e.preventDefault();

    if (!(window.Auth && window.Auth.hasSession && window.Auth.hasSession())) return;

    const id = btn.dataset.tab;
    document
      .querySelectorAll("nav button[data-tab]")
      .forEach((b) => b.classList.toggle("active", b === btn));
    loadTab(id);
  });

  // ------------------------------
  // 🔧 Hauptladefunktion für Tabs
  // ------------------------------
  window.loadTab = function (tab) {
    if (mainContent)
      mainContent.innerHTML = "<p style='text-align:center;'>⏳ Wird geladen...</p>";

    // Vorherige Module abräumen
    if (window.Tagesbericht && typeof Tagesbericht.unmount === "function") {
      Tagesbericht.unmount();
    }

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
        // ✅ report.js ist bereits per <script> geladen
        if (window.Tagesbericht && typeof Tagesbericht.mount === "function") {
          Tagesbericht.mount("#mainContent");

          // Wenn Hof gewählt → automatisch 1 Aufgabe hinzufügen
          setTimeout(() => {
            const hofBtn = document.querySelector("#taetigkeitRow .btn:nth-child(3)");
            if (hofBtn) {
              hofBtn.addEventListener("click", () => {
                setTimeout(() => {
                  if (
                    window.Tagesbericht &&
                    typeof Tagesbericht.addTaskBlock === "function"
                  ) {
                    Tagesbericht.addTaskBlock("");
                  }
                }, 150);
              });
            }
          }, 500);
        } else {
          mainContent.innerHTML =
            "<p style='text-align:center;color:#ccc;'>⚠️ Modul 'Tagesbericht' nicht gefunden oder nicht geladen.</p>";
        }
        break;

      case "projectdoc":
        typeof loadProjectDoc === "function" && loadProjectDoc();
        break;

      case "settings":
        typeof loadSettings === "function" && loadSettings();
        break;

      case "ausbildungsnachweis":
        if (window.AppModules && window.AppModules.ausbildungsnachweis) {
          window.AppModules.ausbildungsnachweis.render(mainContent);
        } else if (typeof loadAusbildungsnachweis === "function") {
          loadAusbildungsnachweis();
        } else {
          mainContent.innerHTML =
            "<p style='text-align:center;color:#ccc;'>⚠️ Modul 'Ausbildungsnachweis' nicht gefunden.</p>";
        }
        break;

      // 🆕 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // ✅ NEU: ARP-Nummern Tab
      case "arp":
        if (typeof loadArp === "function") {
          loadArp();
        } else {
          mainContent.innerHTML =
            "<p style='text-align:center;color:#ccc;'>⚠️ Modul 'ARP' nicht gefunden oder nicht geladen.</p>";
        }
        break;
      // 🆕 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      default:
        typeof loadDashboard === "function" && loadDashboard();
    }
  };

  // ------------------------------
  // 🔐 Beim Start: Dashboard laden
  // ------------------------------
  if (window.Auth && window.Auth.hasSession && window.Auth.hasSession()) {
    document
      .querySelector("nav button[data-tab='dashboard']")
      ?.classList.add("active");
    loadTab("dashboard");
  }
});
