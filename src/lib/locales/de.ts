export const de = {
  // Core UI
  title: "Zugriffskontroll-Manager",
  enabled: "Aktiviert",
  disabled: "Deaktiviert",
  pageElements: "Seitenelemente",
  currentPage: "Aktuelle Seite",
  detectedTypes: "Erkannte Typen",
  elementCount: "{{count}} Elemente",
  enableAll: "Alle aktivieren",
  disableAll: "Alle deaktivieren",
  loading: "Laden...",
  confirmDelete: "Sind Sie sicher, dass Sie {{name}} löschen möchten?",
  successEnable: "Aktiviert",
  successDisable: "Deaktiviert",
  successBehavior: "Verhalten aktualisiert",
  tipGreen:
    "Tipp: Grüner Hintergrund zeigt Elemente an, die auf dieser Seite gefunden wurden",
  tipBehavior:
    "Verhalten: Verbergen=verborgen, Deaktivieren=deaktiviert, Unschärfen=unscharf, Einschränken=Overlay",
  behaviorHide: "Verbergen",
  behaviorDisable: "Deaktivieren",
  behaviorBlur: "Unschärfen",
  behaviorRestrict: "Einschränken",
  onPage: "Auf der Seite",
  moduleEnabled: "Aktiviert",
  moduleDisabled: "Deaktiviert",
  language: "Sprache",

  // Custom Project Management
  customProjects: "Benutzerdefinierte Projekte",
  viewMode: "Ansichtsmodus",
  builtInProjects: "Integrierte Projekte",
  addCustomProject: "Benutzerdefiniertes Projekt hinzufügen",
  editCustomProject: "Benutzerdefiniertes Projekt bearbeiten",
  deleteCustomProject: "Benutzerdefiniertes Projekt löschen",
  projectName: "Projektname",
  projectDescription: "Projektbeschreibung",
  projectModule: "Modul",
  selector: "Selektor",
  selectorPlaceholder: "z. B.: .class-name, #element-id, data-type",
  multiSelectorHint:
    "Mehrere Selektoren unterstützt: durch Kommas trennen, z. B.: .btn, #header, [data-role]",
  multiSelectorPlaceholder:
    "Geben Sie CSS-Selektoren ein, mehrere Selektoren durch Kommas getrennt:\n.container, #main, div.active, [data-role='admin']",
  selectorValue: "Selektorwert",
  valuePlaceholder: "Attributwert eingeben",
  urlPattern: "URL-Muster (Regex)",
  urlPatternPlaceholder:
    "z. B.: ^/settings$, .*admin.*, settings|account (leer für alle Seiten)",
  urlPatternHint:
    "Nur Regex. Häufig: ^/settings$ exakte Übereinstimmung, ^/settings Präfix-Übereinstimmung, .*admin.* enthält Übereinstimmung",
  selectorType: "Selektortyp",
  selectorTypeClass: "CSS-Klasse (.class)",
  selectorTypeId: "Element-ID (#id)",
  selectorTypeAttribute: "Elementattribut [attr]",
  save: "Speichern",
  cancel: "Abbrechen",
  delete: "Löschen",

  // Import/Export
  importExport: "Import/Export",
  exportConfig: "Konfiguration exportieren",
  importConfig: "Konfiguration importieren",
  exportCustomProjects: "Benutzerdefinierte Projekte exportieren",
  importCustomProjects: "Benutzerdefinierte Projekte importieren",
  exportSuccess: "Konfiguration erfolgreich exportiert",
  exportError: "Export fehlgeschlagen, bitte erneut versuchen",
  importSuccess: "Konfiguration erfolgreich importiert",
  importError: "Import fehlgeschlagen, bitte Dateiformat prüfen",
  noCustomProjects: "Keine benutzerdefinierten Projekte",
  projects: "Projekte",

  // Validation
  nameRequired: "Projektname ist erforderlich",
  selectorRequired: "Selektor ist erforderlich",
  valueRequired: "Selektorwert ist erforderlich",
  duplicateSelector: "Doppelter Selektor",
  duplicateWith: "Dupliziert mit",

  // Success Messages
  projectSaved: "Projekt erfolgreich gespeichert",
  projectDeleted: "Projekt erfolgreich gelöscht",

  // Confirmation Messages
  confirmDeleteProject:
    "Sind Sie sicher, dass Sie dieses Projekt löschen möchten?",

  // Demo Page
  demoTitle: "Demoseite Zugriffskontrolle",
  currentConfig: "Aktuelle Konfiguration",
  builtInConfigTitle: "Konfiguration integrierter Projekte",
  customConfigTitle: "Konfiguration benutzerdefinierter Projekte",
  selectorInfo: "Selektorinformationen",
  effectiveSelector: "Effektiver Selektor",
  refreshConfig: "Konfiguration aktualisieren",

  // Form Validation Tips
  classSelectorTip: "Klassenselektor beginnt mit ., z. B. .my-class",
  idSelectorTip: "ID-Selektor beginnt mit #, z. B. #my-id",
  attributeSelectorTip: "Attributselektor ohne [], z. B. data-type",

  // Advanced Features
  advancedMode: "Erweiterter Modus",
  bulkOperations: "Stapeloperationen",
  selectAll: "Alle auswählen",
  unselectAll: "Alle abwählen",
  batchEnable: "Stapelweise aktivieren",
  batchDisable: "Stapelweise deaktivieren",
  batchDelete: "Stapelweise löschen",
  clearAll: "Alle löschen",
  confirmClearAllTitle: "Alles löschen bestätigen",
  confirmClearAllDesc:
    "Dies löscht alle benutzerdefinierten Projekte und kann nicht rückgängig gemacht werden. Sind Sie sicher, dass Sie alles löschen möchten?",
  clearAllSuccess: "Alle benutzerdefinierten Projekte gelöscht",

  // Quick Actions
  enableAllControl: "Alle Kontrollen aktivieren",
  disableAllControl: "Alle Kontrollen deaktivieren",

  // Statistics
  controlling: "Wird gesteuert",
  normalDisplay: "Normale Anzeige",

  // Toolbar
  groupView: "Gruppe",
  listView: "Liste",
  addProject: "Projekt hinzufügen",
  addModule: "Modul hinzufügen",
  export: "Exportieren",
  import: "Importieren",

  // Project Details
  selectorLabel: "Selektor: ",
  selectorCount: " Selektoren",
  controlBehavior: "Kontrollverhalten:",
  uncategorized: "Nicht kategorisiert",
  urlMatch: "URL stimmt überein",
  urlNoMatch: "URL stimmt nicht überein",
  urlMismatchWarning: " Projekte nicht wirksam wegen URL-Unstimmigkeit",

  // Page Info
  matchingElements: "Übereinstimmende Elemente: ",
  actuallyEffective: "Tatsächlich wirksam: ",
  enabledControls: "Aktivierte Kontrollen: ",
  configuredProjects: "Konfigurierte Projekte: ",
  waitingForPageInfo: "Warte auf Seiteninformationen...",
  noPageInfo: "Keine Seiteninformationen",
  noMatchingElements: "Keine übereinstimmenden Elemente",
  projectCount: "{{count}} Projekte",
  enableGroupControl: "Gruppenkontrolle aktivieren",
  disableGroupControl: "Gruppenkontrolle deaktivieren",
  confirmDeleteProjectWithName:
    'Sind Sie sicher, dass Sie das Projekt "{{name}}" löschen möchten?',
  confirmDeleteModuleDesc:
    'Sind Sie sicher, dass Sie das Modul "{{name}}" und alle {{count}} Projekte löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',

  // Form Labels and Messages
  editProject: "Projekt bearbeiten",
  projectNameLabel: "Projektname",
  projectNamePlaceholder: "Projektname eingeben",
  projectNameMaxLength: "Projektname darf 50 Zeichen nicht überschreiten",
  projectDescriptionLabel: "Projektbeschreibung",
  projectDescriptionPlaceholder: "Projektbeschreibung eingeben",
  projectDescriptionMaxLength:
    "Projektbeschreibung darf 200 Zeichen nicht überschreiten",
  belongingGroupLabel: "Zugehörige Gruppe",
  belongingGroupPlaceholder:
    "Vorhandene Gruppe auswählen oder neuen Gruppennamen eingeben",
  groupRequired: "Bitte Gruppennamen auswählen oder eingeben",
  cssSelector: "CSS-Selektor",
  cssSelectorRequired: "Bitte CSS-Selektor eingeben",
  cssSelectorHint:
    'Alle CSS-Selektoren unterstützt: .class, #id, tag, [attribute], [attribute="value"], .class1.class2, .parent .child, etc.',
  cssSelectorMultiHint:
    "Mehrere Selektoren unterstützt: durch Kommas trennen, z. B.: .btn, #header, [data-role]",
  cssSelectorPlaceholder:
    "Geben Sie CSS-Selektoren ein, mehrere Selektoren durch Kommas getrennt:\n.container, #main, div.active, [data-role='admin']",
  urlPatternLabel: "URL-Muster (Regex)",

  // Messages
  enabledAllProjects: "Kontrolle für alle Projekte aktiviert",
  disabledAllProjects: "Kontrolle für alle Projekte deaktiviert",
  noCustomProjectsYet:
    "Noch keine benutzerdefinierten Projekte. Klicken Sie oben, um Ihr erstes Projekt hinzuzufügen",

  // Parameterized messages
  projectsControlling: "{{count}} Projekte werden gesteuert",
  projectsNotEffectiveDueToUrl:
    "{{count}} Projekte nicht wirksam wegen URL-Unstimmigkeit",
  selectorsCount: "{{count}} Selektoren",

  // Module management
  enterModuleName: "Modulnamen eingeben",
  editModuleAction: "Bearbeiten",
  copyProject: "Kopieren",
  deleteProjectAction: "Löschen",
  confirmDeleteButtonText: "Löschen bestätigen",
  renameModule: "Modul umbenennen",
  deleteModule: "Gesamtes Modul löschen",
  confirmDeleteModule: "Löschen des Moduls bestätigen",

  // Form labels
  moduleName: "Modulname",
};
