/* ===========================================
   Straßenwärter-Helfer – signs.js (v4 modular)
   =========================================== */

function loadSigns() {
  const main = document.getElementById("mainContent");

  main.innerHTML = `
    <section class="card fade-in">
      <div class="section-title"><h2>🚦 Digitaler Schilderwald</h2></div>
      <p>Suche nach Verkehrszeichen-Nummer oder Stichwort.</p>
      
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
        <input id="signSearch" placeholder="z. B. 205 oder Vorfahrt gewähren" style="flex:1;">
        <select id="signCategory">
          <option value="all">Alle Kategorien</option>
          <option value="Gefahrzeichen">⚠️ Gefahrzeichen</option>
          <option value="Vorschriftzeichen">⛔ Vorschriftzeichen</option>
          <option value="Richtzeichen">ℹ️ Richtzeichen</option>
        </select>
      </div>
      <div id="signResults" class="signsGrid"></div>
    </section>
  `;

  const searchInput = document.getElementById("signSearch");
  const categorySelect = document.getElementById("signCategory");
  const results = document.getElementById("signResults");

  searchInput.addEventListener("input", renderSigns);
  categorySelect.addEventListener("change", renderSigns);

  renderSigns();

  function renderSigns() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;
    const list = SIGNS_DB.filter(s =>
      (cat === "all" || s.category === cat) &&
      (s.num.includes(q) || s.name.toLowerCase().includes(q))
    );

    if (!list.length) {
      results.innerHTML = `<p style="text-align:center;color:var(--muted);">Keine Treffer gefunden.</p>`;
      return;
    }

    results.innerHTML = list
      .map(
        s => `
        <div class="signCard fade-in">
          <img src="${s.img}" alt="${s.name}">
          <div class="info">
            <div class="num">VZ ${s.num}</div>
            <div class="title">${s.name}</div>
            <div class="cat">${s.category}</div>
          </div>
        </div>`
      )
      .join("");
  }
}

/* ===========================================
   Mini-Datenbank – Beispielzeichen
   =========================================== */

const SIGNS_DB = [
  {
    num: "101",
    name: "Gefahrstelle",
    category: "Gefahrzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Zeichen_101_-_Gefahrstelle.svg/240px-Zeichen_101_-_Gefahrstelle.svg.png"
  },
  {
    num: "205",
    name: "Vorfahrt gewähren",
    category: "Vorschriftzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Zeichen_205_-_Vorfahrt_gew%C3%A4hren.svg/240px-Zeichen_205_-_Vorfahrt_gew%C3%A4hren.svg.png"
  },
  {
    num: "206",
    name: "Halt! Vorfahrt gewähren",
    category: "Vorschriftzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Zeichen_206_-_Halt%2C_Vorfahrt_gew%C3%A4hren.svg/240px-Zeichen_206_-_Halt%2C_Vorfahrt_gew%C3%A4hren.svg.png"
  },
  {
    num: "301",
    name: "Vorfahrt an der nächsten Kreuzung",
    category: "Richtzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Zeichen_301_-_Vorfahrt_an_der_n%C3%A4chsten_Kreuzung.svg/240px-Zeichen_301_-_Vorfahrt_an_der_n%C3%A4chsten_Kreuzung.svg.png"
  },
  {
    num: "306",
    name: "Vorfahrtstraße",
    category: "Richtzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Zeichen_306_-_Vorfahrtstra%C3%9Fe.svg/240px-Zeichen_306_-_Vorfahrtstra%C3%9Fe.svg.png"
  },
  {
    num: "123",
    name: "Arbeitsstelle",
    category: "Gefahrzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Zeichen_123_-_Arbeitsstelle.svg/240px-Zeichen_123_-_Arbeitsstelle.svg.png"
  },
  {
    num: "274-60",
    name: "Zulässige Höchstgeschwindigkeit 60 km/h",
    category: "Vorschriftzeichen",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Zeichen_274-60_-_Zul%C3%A4ssige_H%C3%B6chstgeschwindigkeit_60_km_h.svg/240px-Zeichen_274-60_-_Zul%C3%A4ssige_H%C3%B6chstgeschwindigkeit_60_km_h.svg.png"
  }
];
