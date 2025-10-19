/* =========================================================
   ARP – Ausbildungsrahmenplan (Dashboard-Stil, Text komplett)
   - Tabs: data-tab="arp" -> loadArp()
   - Rendert in #mainContent
   - Fixierter Tabellenkopf (styles/arp.css)
   - Textinhalte 1–19 vollständig; Zahlenfelder, wo sicher lesbar
========================================================= */

function loadArp() {
  const main = document.getElementById("mainContent");
  if (!main) return;

  // CSS einmalig laden
  if (!document.querySelector('link[href*="arp.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles/arp.css";
    document.head.appendChild(link);
  }

  main.innerHTML = `
    <div class="arp-container">
      <h2>🧾 Ausbildungsrahmenplan (ARP)</h2>
      <p>Nachfolgend sind alle Lernbereiche gemäß Ausbildungsrahmenplan aufgeführt. Die Inhalte sind nach Hauptgruppen gegliedert.</p>
      <div id="arpContent"></div>
    </div>
  `;

  renderArpSections(arpSections);
}

/* ---------- Alle Abschnitte 1–19 mit Unterpunkten ---------- */
/* Felder: { nr, inhalt, vertiefung, betrieb, ub, bbs }
   Zahlen in "betrieb/ub/bbs" fülle ich nach, sobald du mir die exakten Werte gibst. */
const arpSections = [
  {
    title: "1 Berufsbildung, Arbeits- und Tarifrecht",
    items: [
      { nr: "1a", inhalt: "Bedeutung des Ausbildungsvertrags, insbesondere Abschluss, Dauer und Beendigung erklären", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "1b", inhalt: "Gegenseitige Rechte und Pflichten aus dem Ausbildungsvertrag nennen", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "1c", inhalt: "Möglichkeiten der beruflichen Fortbildung nennen", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "1d", inhalt: "Wesentliche Teile des Arbeitsvertrages nennen", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "1e", inhalt: "Wesentliche Bestimmungen der für den ausbildenden Betrieb geltenden Tarifverträge nennen", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
    ],
  },
  {
    title: "2 Aufbau und Organisation des Ausbildungsbetriebes",
    items: [
      { nr: "2a", inhalt: "Aufbau und Aufgaben des ausbildenden Betriebes erläutern", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "2b", inhalt: "Grundfunktionen des ausbildenden Betriebes, wie Beschaffung, Fertigung, Absatz und Verwaltung, erklären", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "2c", inhalt: "Beziehungen des ausbildenden Betriebes und seiner Beschäftigten zu Wirtschaftsorganisationen, Berufsvertretungen und Gewerkschaften nennen", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
      { nr: "2d", inhalt: "Grundlagen, Aufgaben und Arbeitsweise der mitbestimmungs- oder personalvertretungsrechtlichen Organe des ausbildenden Betriebes beschreiben", vertiefung: "2", betrieb: "", ub: "", bbs: "Politik" },
    ],
  },
  {
    title: "3 Sicherheit und Gesundheitsschutz bei der Arbeit",
    items: [
      { nr: "3a", inhalt: "Gefährdung von Sicherheit und Gesundheit am Arbeitsplatz feststellen und Maßnahmen zu ihrer Vermeidung ergreifen", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "3b", inhalt: "Berufsbezogene Arbeitsschutz- und Unfallverhütungsvorschriften anwenden", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "3c", inhalt: "Verhaltensweisen bei Unfällen beschreiben sowie erste Maßnahmen einleiten", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "3d", inhalt: "Vorschriften des vorbeugenden Brandschutzes anwenden, Verhaltensweise bei Bränden beschreiben und Maßnahmen der Brandbekämpfung ergreifen", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
    ],
  },
  {
    title: "4 Umweltschutz",
    items: [
      { nr: "4a", inhalt: "Mögliche Umweltbelastungen durch den Ausbildungsbetrieb und seinen Beitrag zum Umweltschutz an Beispielen erklären", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "4b", inhalt: "Für den Ausbildungsbetrieb geltende Regelungen des Umweltschutzes anwenden", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "4c", inhalt: "Möglichkeiten der wirtschaftlichen und umweltschonenden Energie- und Materialverwendung nutzen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "4d", inhalt: "Abfälle vermeiden, Stoffe und Materialien einer umweltschonenden Entsorgung zuführen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
    ],
  },
  {
    title: "5 Arbeitsorganisation, Informations- und Kommunikationstechniken",
    items: [
      { nr: "5a", inhalt: "Arbeitsauftrag erfassen und Vorgaben auf Umsetzbarkeit prüfen", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5b", inhalt: "Informationen beschaffen, bewerten, insbesondere Gebrauchsanweisungen, Kataloge, Normen, Fachliteratur", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5c", inhalt: "Bedarf an Arbeitsmitteln feststellen, Arbeitsmittel zusammenstellen, Sicherungsmaßnahmen planen", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5d", inhalt: "Arbeitsunterlagen unter Berücksichtigung sicherheitstechnischer und wirtschaftlicher Gesichtspunkte festlegen", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5e", inhalt: "Zeitaufwand und personelle Unterstützung abschätzen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5f", inhalt: "Im Team planen, abstimmen und umsetzen, Ergebnisse auswerten", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5g", inhalt: "Gespräche situationsgerecht führen, Sachverhalte darstellen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5h", inhalt: "Maßnahmen mit dem Arbeitsvorgesetzten sowie überbetrieblichen Beteiligten treffen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "5i", inhalt: "Berichte erstellen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
    ],
  },
  {
    title: "6 Betriebswirtschaftliches Handeln",
    items: [
      { nr: "6a", inhalt: "Bestandsdaten erheben und pflegen", vertiefung: "2", betrieb: "8",  ub: "3", bbs: "3, 4, 5" },
      { nr: "6b", inhalt: "Leistungserfassung durchführen", vertiefung: "2", betrieb: "10", ub: "5", bbs: "6" },
      { nr: "6c", inhalt: "Kosten ermitteln", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "6d", inhalt: "Arbeiten kostenorientiert durchführen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "7 Umgang mit Informations- und Kommunikationstechniken",
    items: [
      { nr: "7a", inhalt: "Einführungskurs, Word-Grundkurs, Excel-Grundkurs intern oder extern", vertiefung: "1", betrieb: "10", ub: "0", bbs: "" },
      { nr: "7b", inhalt: "Nutzungsmöglichkeiten der Informations- und Kommunikationstechniken für den Ausbildungsbetrieb unterscheiden", vertiefung: "1", betrieb: "", ub: "", bbs: "" },
      { nr: "7c", inhalt: "Informationen erfassen, Daten eingeben, sichern und pflegen", vertiefung: "1", betrieb: "", ub: "", bbs: "" },
      { nr: "7d", inhalt: "Arbeitsaufgaben mit Hilfe von Informations- und Kommunikationssystemen bearbeiten; Vorschriften zum Datenschutz anwenden", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "8 Einrichten, Sichern und Räumen von Arbeitsstellen / Unfallstellen; sonstige Verkehrssicherung",
    items: [
      { nr: "8a", inhalt: "Erste Hilfe – Lehrgang", vertiefung: "3", betrieb: "", ub: "", bbs: "1,7,8" },
      { nr: "8b", inhalt: "Arbeitsplatz sichern, einrichten und räumen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "8c", inhalt: "Persönliche Schutzausrüstung verwenden", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "8d", inhalt: "Gefahrenstellen erkennen und absichern; Maßnahmen zur Beseitigung von Gefahrenstellen ergreifen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "8e", inhalt: "Maßnahmen der Ersten Hilfe leisten", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "8f", inhalt: "Unfälle und Zwischenfälle melden; Angaben zu Verletzten, Schäden und Gefahren machen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "8g", inhalt: "Verkehrswege beurteilen; Maßnahmen zur Nutzung und Sicherung veranlassen; verkehrssichernde Reinigungsarbeiten durchführen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "8h", inhalt: "Arbeits- und Schutzgerüste auf-, um- und abbauen; Leitern und Gerüste prüfen; Betriebssicherheit beurteilen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "8i", inhalt: "Gefahrstoffe erkennen; Schutzmaßnahmen ergreifen; Lagerung und Transport von Gefahrstoffen/Abfällen sicherstellen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "8j", inhalt: "Geräte und Maschinen vor Witterungseinflüssen, Beschädigungen und Diebstahl schützen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "8k", inhalt: "Arbeitsstellen einrichten; Verkehrszeichen aufstellen; Absperrmaterial aufbauen; Arbeitsstellen betreiben und abbauen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "8l", inhalt: "Absperrungen und Verkehrseinrichtungen zur Sicherung von Unfallstellen aufbauen, instand halten und abbauen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "9 Auswählen, Prüfen und Lagern von Baumaterialien",
    items: [
      { nr: "9a", inhalt: "Bau- und Baustoffe sowie Fertigteile auswählen; Bedarf ermitteln; anfordern und bereitstellen", vertiefung: "3", betrieb: "15", ub: "8", bbs: "2,3,4,5,9,11,12,13" },
      { nr: "9b", inhalt: "Bau- und Baustoffe sowie Fertigteile transportieren und lagern", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
      { nr: "9c", inhalt: "Bau- und Baustoffe sowie Fertigteile auf Vollständigkeit, Verwendbarkeit, Beschädigung und Maßhaltigkeit prüfen; Reklamationen veranlassen", vertiefung: "3", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "10 Anfertigen und Anwenden von technischen Unterlagen, Durchführen von Messungen",
    items: [
      { nr: "10a", inhalt: "Skizzen anfertigen, Zeichnungen und Pläne anwenden", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "10b", inhalt: "Normen, technische Richtlinien, Sicherheitsregeln, Merkblätter, Handbücher, Montageanleitungen, Betriebs- und Arbeitsanweisungen anwenden", vertiefung: "3", betrieb: "", ub: "", bbs: "alle" },
      { nr: "10c", inhalt: "Messverfahren auswählen, Messgeräte auf Funktionsfähigkeit prüfen", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
      { nr: "10d", inhalt: "Aufmessungen durchführen und Höhen übertragen, Maße dokumentieren", vertiefung: "3", betrieb: "17", ub: "10", bbs: "alle" },
      { nr: "10e", inhalt: "Bauteile, Geraden und Bögen abstecken; Längen-, Richtungs- und Winkelmessungen durchführen", vertiefung: "2", betrieb: "", ub: "6", bbs: "alle" },
      { nr: "10f", inhalt: "Längs- und Querprofile abstecken", vertiefung: "2", betrieb: "", ub: "", bbs: "alle" },
    ],
  },
  {
    title: "11 Aufgaben der Straßenbaulastträger, Anwenden der rechtlichen Bestimmungen",
    items: [
      { nr: "11a", inhalt: "Aufgaben der Straßenbaulastträger unterscheiden", vertiefung: "3", betrieb: "5", ub: "0", bbs: "" },
      { nr: "11b", inhalt: "Verkehrs- und wegerechtliche Bestimmungen anwenden", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
      { nr: "11c", inhalt: "Aufgaben der Streckenwartung durchführen; Bauwerksbeobachtung; Verkehrssicherungsmaßnahmen ergreifen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "12 Durchführung von Bau- und Instandhaltungsarbeiten an Bauwerken",
    items: [
      { nr: "12a", inhalt: "Mauerwerk, Beton- und Stahlbetonbauteile herstellen; Bauteile verarbeiten", vertiefung: "2", betrieb: "12", ub: "5", bbs: "" },
      { nr: "12b", inhalt: "Instandhaltungsarbeiten an Mauerwerk, Putz und Estrich, Beton- und Stahlbetonbauteilen durchführen", vertiefung: "2", betrieb: "", ub: "", bbs: "" },
    ],
  },
  {
    title: "13 Durchführung von Bau- und Instandhaltungsarbeiten an Straßen",
    items: [
      { nr: "13a", inhalt: "Böden hinsichtlich ihrer bautechnischen Eignung beurteilen", vertiefung: "3", betrieb: "23", ub: "8", bbs: "" },
      { nr: "13b", inhalt: "Einfassungen, Pflasterdecken und Pflasterrinnen sowie Plattenbeläge herstellen", vertiefung: "3", betrieb: "25", ub: "12", bbs: "" },
      { nr: "13c", inhalt: "Böden lösen, transportieren, lagern, einbauen und verdichten; Planum herstellen", vertiefung: "3", betrieb: "30", ub: "15", bbs: "" },
      { nr: "13d", inhalt: "Baugruben und Gräben ausheben, sichern und schließen; offene Wasserhaltung durchführen", vertiefung: "3", betrieb: "8", ub: "0", bbs: "" },
      { nr: "13e", inhalt: "Rohre, Formstücke und Profile verlegen und verbinden", vertiefung: "2", betrieb: "12", ub: "0", bbs: "" },
      { nr: "13f", inhalt: "Bankette und Entwässerungseinrichtungen herstellen, insbesondere Straßengräben, Entwässerungsmulden; Regenwassereinleitungen und Regenrückhaltebecken instand halten", vertiefung: "3", betrieb: "15", ub: "0", bbs: "" },
      { nr: "13g", inhalt: "Fahrbahnen instand halten; Setzungen, Verdückungen, Abplatzungen und Ausbrüche beseitigen; Oberflächenbehandlungen durchführen; Fugen schneiden, reinigen, vergießen", vertiefung: "3", betrieb: "15", ub: "0", bbs: "" },
    ],
  },
  {
    title: "14 Be- und Verarbeitung von Werk- und Hilfsstoffen",
    items: [
      { nr: "14a", inhalt: "Werk- und Hilfsstoffe, insbesondere Holz, Kunststoffe und Metalle, auswählen; auf Fehler und Einsatzbarkeit prüfen; transportieren und lagern", vertiefung: "2", betrieb: "16", ub: "0", bbs: "5" },
      { nr: "14b", inhalt: "Holz und Metalle von Hand und mit Maschinen bearbeiten", vertiefung: "2", betrieb: "0", ub: "3", bbs: "" },
      { nr: "14c", inhalt: "Werkstoffverbindungen herstellen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
      { nr: "14d", inhalt: "Untergründe vorbereiten, insbesondere durch Entrosten und Grundieren", vertiefung: "1", betrieb: "0", ub: "0", bbs: "" },
      { nr: "14e", inhalt: "Beschichtungsarbeiten durchführen, insbesondere mit Farben und Lacken", vertiefung: "1", betrieb: "0", ub: "3", bbs: "" },
    ],
  },
  {
    title: "15 Anlegen und Pflegen von Grünflächen",
    items: [
      { nr: "15a", inhalt: "Grünflächen anlegen sowie intensiv und extensiv pflegen", vertiefung: "2", betrieb: "0", ub: "17", bbs: "10" },
      { nr: "15b", inhalt: "Gehölze und Pflanzen pflegen", vertiefung: "2", betrieb: "0", ub: "20", bbs: "" },
      { nr: "15c", inhalt: "Lichtraumprofile und Sichtflächen freihalten", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
      { nr: "15d", inhalt: "Baumkontrolle durchführen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
    ],
  },
  {
    title: "16 Anbringen und Instandhalten von Verkehrszeichen und -einrichtungen; Verkehrs­sicherungs- & Telematiksysteme",
    items: [
      { nr: "16a", inhalt: "Art und Bedeutung von Verkehrszeichen unterscheiden; Bereitstellung veranlassen", vertiefung: "3", betrieb: "0", ub: "17", bbs: "7" },
      { nr: "16b", inhalt: "Verkehrszeichen und Markierungsmaterial auswählen", vertiefung: "3", betrieb: "6", ub: "10", bbs: "" },
      { nr: "16c", inhalt: "Verkehrszeichen aufstellen, instand halten und entfernen", vertiefung: "2", betrieb: "0", ub: "5", bbs: "3" },
      { nr: "16d", inhalt: "Fahrbahnmarkierung aufbringen und ausbessern", vertiefung: "2", betrieb: "0", ub: "3", bbs: "" },
      { nr: "16e", inhalt: "Leit- und Schutzeinrichtungen anbringen, instand halten und entfernen", vertiefung: "1", betrieb: "0", ub: "0", bbs: "x x 0 7" },
      { nr: "16f", inhalt: "Verkehrssicherungs- und Telematiksysteme hinsichtlich ihrer Anwendung unterscheiden; Funktionsfähigkeit überwachen; Störungsbeseitigung veranlassen", vertiefung: "1", betrieb: "0", ub: "0", bbs: "" },
      { nr: "16g", inhalt: "Schaltungen an Verkehrsbeeinflussungsanlagen veranlassen, insbesondere bei der Durchführung eigener Maßnahmen", vertiefung: "1", betrieb: "0", ub: "0", bbs: "" },
    ],
  },
  {
    title: "17 Durchführen des Winterdienstes",
    items: [
      { nr: "17a", inhalt: "Informationen für den Winterdienst beschaffen und auswerten", vertiefung: "3", betrieb: "0", ub: "15", bbs: "14" },
      { nr: "17b", inhalt: "Geräte, Maschinen und Fahrzeuge für den Winterdienst zusammenstellen und auswerten", vertiefung: "3", betrieb: "0", ub: "20", bbs: "" },
      { nr: "17c", inhalt: "Vorbeugende Maßnahmen des Schneeschutzes ausführen, insbesondere Schneeschutzzäune aufstellen, unterhalten und abbauen", vertiefung: "2", betrieb: "0", ub: "0", bbs: "" },
      { nr: "17d", inhalt: "Zusammensetzung des Streugutes und Menge der Streustoffe festlegen; Fahrzeuge mit Streugut beladen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
      { nr: "17e", inhalt: "Maßnahmen des Winterdienstes durchführen, insbesondere Räumen von Schnee sowie Aufbringen von Streugut mit Fahrzeugen der Klasse CE", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
    ],
  },
  {
    title: "18 Handhaben und Warten von Werkzeugen, Geräten, Maschinen und technischen Einrichtungen; Führen und Warten von Fahrzeugen",
    items: [
      { nr: "18a", inhalt: "Werkzeugen, Geräten, Maschinen und technischen Einrichtungen auswählen", vertiefung: "3", betrieb: "10", ub: "0", bbs: "2" },
      { nr: "18b", inhalt: "Werkzeuge handhaben und instand setzen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "" },
      { nr: "18c", inhalt: "Geräte, Maschinen und technische Einrichtungen einrichten; unter Beachtung der Schutzbestimmungen verwenden; Schutzeinrichtungen bedienen", vertiefung: "3", betrieb: "45", ub: "8", bbs: "2" },
      { nr: "18d", inhalt: "Geräten, Maschinen, technischen Einrichtungen und Fahrzeuge warten und instand halten", vertiefung: "2", betrieb: "0", ub: "0", bbs: "0" },
      { nr: "18e", inhalt: "Störungen erkennen; Störungsbeseitigung veranlassen", vertiefung: "2", betrieb: "0", ub: "0", bbs: "0" },
      { nr: "18f", inhalt: "An- und Aufbauten anbringen und abnehmen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "0" },
      { nr: "18g", inhalt: "Fahrzeugkombinationen der Klasse CE auf öffentlichen Straßen sicher und wirtschaftlich führen (inkl. Führerscheinerwerb)", vertiefung: "3", betrieb: "0", ub: "0", bbs: "0" },
    ],
  },
  {
    title: "19 Qualitätssichernde Maßnahmen und Kundenorientierung",
    items: [
      { nr: "19a", inhalt: "Aufgaben und Ziele von qualitätssichernden Maßnahmen anhand betrieblicher Beispiele unterscheiden", vertiefung: "2", betrieb: "0", ub: "0", bbs: "alle" },
      { nr: "19b", inhalt: "Qualitätssichernde Maßnahmen im eigenen Arbeitsbereich anwenden; zu kontinuierlicher Verbesserung von Arbeitsvorgängen beitragen", vertiefung: "3", betrieb: "0", ub: "19", bbs: "3" },
      { nr: "19c", inhalt: "Arbeiten kundenorientiert durchführen; Gespräche kundenorientiert führen", vertiefung: "3", betrieb: "0", ub: "0", bbs: "x x x x" },
      { nr: "19d", inhalt: "Endkontrolle anhand des Arbeitsauftrages durchführen und Arbeitsergebnisse dokumentieren", vertiefung: "3", betrieb: "0", ub: "3", bbs: "alle" },
      { nr: "19e", inhalt: "Arbeiten von Dritten, insbesondere von beauftragten Firmen, überwachen und dokumentieren", vertiefung: "1", betrieb: "0", ub: "0", bbs: "" },
      { nr: "19f", inhalt: "Mängel feststellen und Maßnahmen zur Mängelbeseitigung veranlassen", vertiefung: "1", betrieb: "0", ub: "0", bbs: "" },
    ],
  },
];

/* ---------- Rendering ---------- */
function renderArpSections(sections) {
  const container = document.getElementById("arpContent");
  container.innerHTML = "";

  sections.forEach(section => {
    const box = document.createElement("div");
    box.className = "arp-section";

    const h3 = document.createElement("h3");
    h3.textContent = section.title;
    box.appendChild(h3);

    const wrap = document.createElement("div");
    wrap.className = "arp-table-wrapper";

    const table = document.createElement("table");
    table.className = "arp-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>lfd. ARP-Nr.</th>
          <th>Bezeichnung / Inhalt</th>
          <th>Vertiefung</th>
          <th>Zeitrichtwerte Betrieb</th>
          <th>Zeitrichtwerte ÜB</th>
          <th>Rahmenlehrplan BBS</th>
        </tr>
      </thead>
      <tbody>
        ${(section.items || []).map(row => `
          <tr>
            <td>${esc(row.nr)}</td>
            <td>${esc(row.inhalt)}</td>
            <td>${esc(row.vertiefung)}</td>
            <td>${esc(row.betrieb)}</td>
            <td>${esc(row.ub)}</td>
            <td>${esc(row.bbs)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    wrap.appendChild(table);
    box.appendChild(wrap);
    container.appendChild(box);
  });
}

/* ---------- Utils ---------- */
function esc(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
