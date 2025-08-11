export const fr = {
  // Core UI
  title: "Gestionnaire de contrôle d'accès",
  enabled: "Activé",
  disabled: "Désactivé",
  pageElements: "Éléments de la page",
  currentPage: "Page actuelle",
  detectedTypes: "Types détectés",
  elementCount: "{{count}} éléments",
  enableAll: "Tout activer",
  disableAll: "Tout désactiver",
  loading: "Chargement...",
  confirmDelete: "Êtes-vous sûr de vouloir supprimer {{name}} ?",
  successEnable: "Activé",
  successDisable: "Désactivé",
  successBehavior: "Comportement mis à jour",
  tipGreen: "Astuce : le fond vert indique les éléments trouvés sur cette page",
  tipBehavior:
    "Comportement : Masquer=masqué, Désactiver=désactivé, Flouter=flouté, Restreindre=superposition",
  behaviorHide: "Masquer",
  behaviorDisable: "Désactiver",
  behaviorBlur: "Flouter",
  behaviorRestrict: "Restreindre",
  onPage: "Sur la page",
  moduleEnabled: "Activé",
  moduleDisabled: "Désactivé",
  language: "Langue",

  // Custom Project Management
  customProjects: "Projets personnalisés",
  viewMode: "Mode d'affichage",
  builtInProjects: "Projets intégrés",
  addCustomProject: "Ajouter un projet personnalisé",
  editCustomProject: "Modifier le projet personnalisé",
  deleteCustomProject: "Supprimer le projet personnalisé",
  projectName: "Nom du projet",
  projectDescription: "Description du projet",
  projectModule: "Module",
  selector: "Sélecteur",
  selectorPlaceholder: "ex. : .class-name, #element-id, data-type",
  multiSelectorHint:
    "Plusieurs sélecteurs pris en charge : séparez par des virgules, ex. : .btn, #header, [data-role]",
  multiSelectorPlaceholder:
    "Entrez des sélecteurs CSS, plusieurs sélecteurs séparés par des virgules :\n.container, #main, div.active, [data-role='admin']",
  selectorValue: "Valeur du sélecteur",
  valuePlaceholder: "Entrez la valeur de l'attribut",
  urlPattern: "Motif d'URL (Regex)",
  urlPatternPlaceholder:
    "ex. : ^/settings$, .*admin.*, settings|account (vide pour toutes les pages)",
  urlPatternHint:
    "Regex uniquement. Courant : ^/settings$ correspondance exacte, ^/settings correspondance de préfixe, .*admin.* correspondance de contenu",
  selectorType: "Type de sélecteur",
  selectorTypeClass: "Classe CSS (.class)",
  selectorTypeId: "ID de l'élément (#id)",
  selectorTypeAttribute: "Attribut de l'élément [attr]",
  save: "Enregistrer",
  cancel: "Annuler",
  delete: "Supprimer",

  // Import/Export
  importExport: "Importer/Exporter",
  exportConfig: "Exporter la configuration",
  importConfig: "Importer la configuration",
  exportCustomProjects: "Exporter les projets personnalisés",
  importCustomProjects: "Importer les projets personnalisés",
  exportSuccess: "Configuration exportée avec succès",
  exportError: "Échec de l'exportation, veuillez réessayer",
  importSuccess: "Configuration importée avec succès",
  importError: "Échec de l'importation, veuillez vérifier le format du fichier",
  noCustomProjects: "Aucun projet personnalisé",
  projects: "projets",

  // Validation
  nameRequired: "Le nom du projet est requis",
  selectorRequired: "Le sélecteur est requis",
  valueRequired: "La valeur du sélecteur est requise",
  duplicateSelector: "Sélecteur en double",
  duplicateWith: "En double avec",

  // Success Messages
  projectSaved: "Projet enregistré avec succès",
  projectDeleted: "Projet supprimé avec succès",

  // Confirmation Messages
  confirmDeleteProject: "Êtes-vous sûr de vouloir supprimer ce projet ?",

  // Demo Page
  demoTitle: "Page de démonstration du contrôle d'accès",
  currentConfig: "Configuration actuelle",
  builtInConfigTitle: "Configuration des projets intégrés",
  customConfigTitle: "Configuration des projets personnalisés",
  selectorInfo: "Informations sur le sélecteur",
  effectiveSelector: "Sélecteur effectif",
  refreshConfig: "Actualiser la configuration",

  // Form Validation Tips
  classSelectorTip: "Le sélecteur de classe commence par ., ex. .my-class",
  idSelectorTip: "Le sélecteur d'ID commence par #, ex. #my-id",
  attributeSelectorTip: "Sélecteur d'attribut sans [], ex. data-type",

  // Advanced Features
  advancedMode: "Mode avancé",
  bulkOperations: "Opérations en lot",
  selectAll: "Tout sélectionner",
  unselectAll: "Tout désélectionner",
  batchEnable: "Activer en lot",
  batchDisable: "Désactiver en lot",
  batchDelete: "Supprimer en lot",
  clearAll: "Tout effacer",
  confirmClearAllTitle: "Confirmer l'effacement",
  confirmClearAllDesc:
    "Cela supprimera tous les projets personnalisés et ne peut pas être annulé. Êtes-vous sûr de tout effacer ?",
  clearAllSuccess: "Tous les projets personnalisés ont été effacés",

  // Quick Actions
  enableAllControl: "Activer tous les contrôles",
  disableAllControl: "Désactiver tous les contrôles",

  // Statistics
  controlling: "En cours de contrôle",
  normalDisplay: "Affichage normal",

  // Toolbar
  groupView: "Groupe",
  listView: "Liste",
  addProject: "Ajouter un projet",
  addModule: "Ajouter un module",
  export: "Exporter",
  import: "Importer",

  // Project Details
  selectorLabel: "Sélecteur : ",
  selectorCount: " sélecteurs",
  controlBehavior: "Comportement de contrôle :",
  uncategorized: "Non catégorisé",
  urlMatch: "URL correspond",
  urlNoMatch: "URL ne correspond pas",
  urlMismatchWarning:
    " projets non effectifs en raison d'une incompatibilité d'URL",

  // Page Info
  matchingElements: "Éléments correspondants : ",
  actuallyEffective: "Réellement effectif : ",
  enabledControls: "Contrôles activés : ",
  configuredProjects: "Projets configurés : ",
  waitingForPageInfo: "En attente des informations de la page...",
  noPageInfo: "Aucune information de page",
  noMatchingElements: "Aucun élément correspondant",
  projectCount: "{{count}} projets",
  enableGroupControl: "Activer le contrôle de groupe",
  disableGroupControl: "Désactiver le contrôle de groupe",
  confirmDeleteProjectWithName:
    'Êtes-vous sûr de vouloir supprimer le projet "{{name}}" ?',
  confirmDeleteModuleDesc:
    'Êtes-vous sûr de vouloir supprimer le module "{{name}}" et ses {{count}} projets ? Cette action est irréversible.',

  // Form Labels and Messages
  editProject: "Modifier le projet",
  projectNameLabel: "Nom du projet",
  projectNamePlaceholder: "Entrez le nom du projet",
  projectNameMaxLength: "Le nom du projet ne peut pas dépasser 50 caractères",
  projectDescriptionLabel: "Description du projet",
  projectDescriptionPlaceholder: "Entrez la description du projet",
  projectDescriptionMaxLength:
    "La description du projet ne peut pas dépasser 200 caractères",
  belongingGroupLabel: "Groupe d'appartenance",
  belongingGroupPlaceholder:
    "Sélectionnez un groupe existant ou entrez un nouveau nom de groupe",
  groupRequired: "Veuillez sélectionner ou entrer le nom du groupe",
  cssSelector: "Sélecteur CSS",
  cssSelectorRequired: "Veuillez saisir un sélecteur CSS",
  cssSelectorHint:
    'Tous les sélecteurs CSS sont pris en charge : .class, #id, tag, [attribute], [attribute="value"], .class1.class2, .parent .child, etc.',
  cssSelectorMultiHint:
    "Plusieurs sélecteurs pris en charge : séparez par des virgules, ex. : .btn, #header, [data-role]",
  cssSelectorPlaceholder:
    "Entrez des sélecteurs CSS, plusieurs sélecteurs séparés par des virgules :\n.container, #main, div.active, [data-role='admin']",
  urlPatternLabel: "Motif d'URL (Regex)",

  // Messages
  enabledAllProjects: "Contrôle activé pour tous les projets",
  disabledAllProjects: "Contrôle désactivé pour tous les projets",
  noCustomProjectsYet:
    "Aucun projet personnalisé pour le moment, cliquez sur le bouton ci-dessus pour ajouter votre premier projet",

  // Parameterized messages
  projectsControlling: "{{count}} projets en cours de contrôle",
  projectsNotEffectiveDueToUrl:
    "{{count}} projets non effectifs en raison d'une incompatibilité d'URL",
  selectorsCount: "{{count}} sélecteurs",

  // Module management
  enterModuleName: "Entrez le nom du module",
  editModuleAction: "Modifier",
  copyProject: "Copier",
  deleteProjectAction: "Supprimer",
  confirmDeleteButtonText: "Confirmer la suppression",
  renameModule: "Renommer le module",
  deleteModule: "Supprimer tout le module",
  confirmDeleteModule: "Confirmer la suppression du module",

  // Form labels
  moduleName: "Nom du module",
};
