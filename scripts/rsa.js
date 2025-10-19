/* ==========================================================
   Straßenwärter Tool – rsa.js (Einzelseiten-Vorschau-PDF)
   ----------------------------------------------------------
   Zeigt nur die zusammengefasste Vorschau-PDF an:
   assets/rsa_previews.pdf
   ========================================================== */

(function () {

  // Pfad zu deiner zusammengefassten PDF
  const PDF_PATH = "assets/rsa_previews.pdf";

  window.loadRSATab = function loadRSATab(main) {
    const container = main || document.getElementById("mainContent");
    if (!container) return;

    container.innerHTML = `
      <section class="card fade-in" style="padding: 1rem;">
        <div class="section-title">
          <h2>🚧 RSA 2021 – Regelpläne (Vorschau)</h2>
          <p class="muted">Es werden die ersten Seiten aller Regelpläne angezeigt.</p>
        </div>

        <div class="pdf-wrapper" style="
          margin-top: 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          overflow: hidden;
        ">
          <iframe
            src="${PDF_PATH}#page=1&zoom=FitH&toolbar=1&navpanes=0&scrollbar=1"
            width="100%"
            height="900"
            style="border:0; display:block;"
            title="RSA Regelpläne Vorschau"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    `;
  };

  // Falls Schnellzugriff vorhanden ist
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab='rsa']");
    if (btn) {
      setTimeout(() => window.loadRSATab(document.getElementById("mainContent")), 50);
    }
  });

})();
