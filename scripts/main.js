/* ===========================================
   Straßenwärter-Helfer – main.js (v5 polished)
   - Zentrale Tabsteuerung
   - Sanft animierte Unterstreichung (Orange-Blau)
   =========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll("nav button[data-tab]");
  const mainContent = document.getElementById("mainContent");
  const reportBtn = document.getElementById("reportBtn");
  const nav = document.querySelector("nav");

  /* -------------------------------------------
     🔸 Navigation Tabs – Aktivieren & Laden
  ------------------------------------------- */
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tab);
      loadTab(btn.dataset.tab);
    });
  });

  // --- Helfer: Nur ein aktiver Tab + Unterstreichung animieren
  function setActiveTab(tabId) {
    navButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    const activeBtn = document.querySelector(`nav button[data-tab="${tabId}"]`);
    if (activeBtn && nav) {
      const rect = activeBtn.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const left = rect.left - navRect.left + "px";
      const width = rect.width + "px";
      nav.style.setProperty("--underline-left", left);
      nav.style.setProperty("--underline-width", width);
    }
  }

  /* -------------------------------------------
     🔹 Tabs dynamisch laden
  ------------------------------------------- */
  window.loadTab = function (tab) {
    if (mainContent) {
      mainContent.innerHTML = "<p style='text-align:center;'>⏳ Wird geladen...</p>";
    }

    setActiveTab(tab);

    switch (tab) {
      case "dashboard": typeof loadDashboard === "function" && loadDashboard(); break;
      case "calc": typeof loadCalc === "function" && loadCalc(); break;
      case "worktime": typeof loadWorktime === "function" && loadWorktime(); break;
      case "rsa": typeof loadRSA === "function" && loadRSA(); break;
      case "signs": typeof loadSigns === "function" && loadSigns(); break;
      case "winter": typeof loadWinter === "function" && loadWinter(); break;
      case "report": typeof loadReport === "function" && loadReport(); break;
      case "settings": typeof loadSettings === "function" && loadSettings(); break;
      default: typeof loadDashboard === "function" && loadDashboard();
    }
  };

  /* -------------------------------------------
     🔸 Delegiertes Klicken (Fallback)
  ------------------------------------------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("nav button[data-tab]");
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.tab;
    loadTab(id);
  });

  /* -------------------------------------------
     🧾 PDF-Export-Button (falls vorhanden)
  ------------------------------------------- */
  if (reportBtn) {
    reportBtn.onclick = () => {
      if (typeof exportReport === "function") {
        exportReport();
      } else {
        alert("🧾 Der Tagesbericht ist noch nicht geladen oder exportierbar.");
      }
    };
  }

  /* -------------------------------------------
     🚀 Initial: Dashboard vorbereiten & aktiv
  ------------------------------------------- */
  setActiveTab("dashboard");
  loadTab("dashboard");

  // Initial Unterstreichung nach kurzer Verzögerung setzen
  setTimeout(() => {
    const activeBtn = document.querySelector("nav button.active");
    if (activeBtn && nav) {
      const rect = activeBtn.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      nav.style.setProperty("--underline-left", rect.left - navRect.left + "px");
      nav.style.setProperty("--underline-width", rect.width + "px");
    }
  }, 300);

  // Bei Resize dynamisch nachjustieren
  window.addEventListener("resize", () => {
    const activeBtn = document.querySelector("nav button.active");
    if (activeBtn && nav) {
      const rect = activeBtn.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      nav.style.setProperty("--underline-left", rect.left - navRect.left + "px");
      nav.style.setProperty("--underline-width", rect.width + "px");
    }
  });
});
