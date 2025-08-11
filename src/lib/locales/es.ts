export const es = {
  // Core UI
  title: "Administrador de control de acceso",
  enabled: "Habilitado",
  disabled: "Deshabilitado",
  pageElements: "Elementos de la página",
  currentPage: "Página actual",
  detectedTypes: "Tipos detectados",
  elementCount: "{{count}} elementos",
  enableAll: "Habilitar todo",
  disableAll: "Deshabilitar todo",
  loading: "Cargando...",
  confirmDelete: "¿Seguro que deseas eliminar {{name}}?",
  successEnable: "Habilitado",
  successDisable: "Deshabilitado",
  successBehavior: "Comportamiento actualizado",
  tipGreen:
    "Consejo: el fondo verde indica elementos encontrados en esta página",
  tipBehavior:
    "Comportamiento: Ocultar=oculto, Deshabilitar=deshabilitado, Desenfocar=desenfocado, Restringir=superposición",
  behaviorHide: "Ocultar",
  behaviorDisable: "Deshabilitar",
  behaviorBlur: "Desenfocar",
  behaviorRestrict: "Restringir",
  onPage: "En la página",
  moduleEnabled: "Habilitado",
  moduleDisabled: "Deshabilitado",
  language: "Idioma",

  // Custom Project Management
  customProjects: "Proyectos personalizados",
  viewMode: "Modo de vista",
  builtInProjects: "Proyectos incorporados",
  addCustomProject: "Agregar proyecto personalizado",
  editCustomProject: "Editar proyecto personalizado",
  deleteCustomProject: "Eliminar proyecto personalizado",
  projectName: "Nombre del proyecto",
  projectDescription: "Descripción del proyecto",
  projectModule: "Módulo",
  selector: "Selector",
  selectorPlaceholder: "p. ej.: .class-name, #element-id, data-type",
  multiSelectorHint:
    "Se admiten múltiples selectores: sepáralos con comas, p. ej.: .btn, #header, [data-role]",
  multiSelectorPlaceholder:
    "Ingresa selectores CSS, múltiples selectores separados por comas:\n.container, #main, div.active, [data-role='admin']",
  selectorValue: "Valor del selector",
  valuePlaceholder: "Ingresa el valor del atributo",
  urlPattern: "Patrón de URL (Regex)",
  urlPatternPlaceholder:
    "p. ej.: ^/settings$, .*admin.*, settings|account (vacío para todas las páginas)",
  urlPatternHint:
    "Solo Regex. Comunes: ^/settings$ coincidencia exacta, ^/settings coincidencia de prefijo, .*admin.* coincidencia de contenido",
  selectorType: "Tipo de selector",
  selectorTypeClass: "Clase CSS (.class)",
  selectorTypeId: "ID del elemento (#id)",
  selectorTypeAttribute: "Atributo del elemento [attr]",
  save: "Guardar",
  cancel: "Cancelar",
  delete: "Eliminar",

  // Import/Export
  importExport: "Importar/Exportar",
  exportConfig: "Exportar configuración",
  importConfig: "Importar configuración",
  exportCustomProjects: "Exportar proyectos personalizados",
  importCustomProjects: "Importar proyectos personalizados",
  exportSuccess: "Configuración exportada con éxito",
  exportError: "Error al exportar, inténtalo de nuevo",
  importSuccess: "Configuración importada con éxito",
  importError: "Error al importar, verifica el formato del archivo",
  noCustomProjects: "No hay proyectos personalizados",
  projects: "proyectos",

  // Validation
  nameRequired: "Se requiere el nombre del proyecto",
  selectorRequired: "Se requiere el selector",
  valueRequired: "Se requiere el valor del selector",
  duplicateSelector: "Selector duplicado",
  duplicateWith: "Duplicado con",

  // Success Messages
  projectSaved: "Proyecto guardado con éxito",
  projectDeleted: "Proyecto eliminado con éxito",

  // Confirmation Messages
  confirmDeleteProject: "¿Seguro que deseas eliminar este proyecto?",

  // Demo Page
  demoTitle: "Página de demostración de control de acceso",
  currentConfig: "Configuración actual",
  builtInConfigTitle: "Configuración de proyectos incorporados",
  customConfigTitle: "Configuración de proyectos personalizados",
  selectorInfo: "Información del selector",
  effectiveSelector: "Selector efectivo",
  refreshConfig: "Actualizar configuración",

  // Form Validation Tips
  classSelectorTip: "El selector de clase comienza con ., p. ej. .my-class",
  idSelectorTip: "El selector de ID comienza con #, p. ej. #my-id",
  attributeSelectorTip: "Selector de atributo sin [], p. ej. data-type",

  // Advanced Features
  advancedMode: "Modo avanzado",
  bulkOperations: "Operaciones en lote",
  selectAll: "Seleccionar todo",
  unselectAll: "Desmarcar todo",
  batchEnable: "Habilitar en lote",
  batchDisable: "Deshabilitar en lote",
  batchDelete: "Eliminar en lote",
  clearAll: "Borrar todo",
  confirmClearAllTitle: "Confirmar borrar todo",
  confirmClearAllDesc:
    "Esto eliminará todos los proyectos personalizados y no se puede deshacer. ¿Seguro que deseas borrar todo?",
  clearAllSuccess: "Todos los proyectos personalizados han sido borrados",

  // Quick Actions
  enableAllControl: "Habilitar todo el control",
  disableAllControl: "Deshabilitar todo el control",

  // Statistics
  controlling: "En control",
  normalDisplay: "Visualización normal",

  // Toolbar
  groupView: "Grupo",
  listView: "Lista",
  addProject: "Agregar proyecto",
  addModule: "Agregar módulo",
  export: "Exportar",
  import: "Importar",

  // Project Details
  selectorLabel: "Selector: ",
  selectorCount: " selectores",
  controlBehavior: "Comportamiento de control:",
  uncategorized: "Sin categoría",
  urlMatch: "URL coincide",
  urlNoMatch: "URL no coincide",
  urlMismatchWarning:
    " proyectos no efectivos debido a incompatibilidad de URL",

  // Page Info
  matchingElements: "Elementos coincidentes: ",
  actuallyEffective: "Realmente efectivos: ",
  enabledControls: "Controles habilitados: ",
  configuredProjects: "Proyectos configurados: ",
  waitingForPageInfo: "Esperando información de la página...",
  noPageInfo: "Sin información de la página",
  noMatchingElements: "No hay elementos coincidentes",
  projectCount: "{{count}} proyectos",
  enableGroupControl: "Habilitar control de grupo",
  disableGroupControl: "Deshabilitar control de grupo",
  confirmDeleteProjectWithName:
    '¿Seguro que deseas eliminar el proyecto "{{name}}"?',
  confirmDeleteModuleDesc:
    '¿Seguro que deseas eliminar el módulo "{{name}}" y sus {{count}} proyectos? Esta acción no se puede deshacer.',

  // Form Labels and Messages
  editProject: "Editar proyecto",
  projectNameLabel: "Nombre del proyecto",
  projectNamePlaceholder: "Ingresa el nombre del proyecto",
  projectNameMaxLength: "El nombre del proyecto no puede superar 50 caracteres",
  projectDescriptionLabel: "Descripción del proyecto",
  projectDescriptionPlaceholder: "Ingresa la descripción del proyecto",
  projectDescriptionMaxLength:
    "La descripción del proyecto no puede superar 200 caracteres",
  belongingGroupLabel: "Grupo al que pertenece",
  belongingGroupPlaceholder:
    "Selecciona un grupo existente o ingresa un nuevo nombre de grupo",
  groupRequired: "Selecciona o ingresa el nombre del grupo",
  cssSelector: "Selector CSS",
  cssSelectorRequired: "Ingresa un selector CSS",
  cssSelectorHint:
    'Se admiten todos los selectores CSS: .class, #id, tag, [attribute], [attribute="value"], .class1.class2, .parent .child, etc.',
  cssSelectorMultiHint:
    "Se admiten múltiples selectores: sepáralos con comas, p. ej.: .btn, #header, [data-role]",
  cssSelectorPlaceholder:
    "Ingresa selectores CSS, múltiples selectores separados por comas:\n.container, #main, div.active, [data-role='admin']",
  urlPatternLabel: "Patrón de URL (Regex)",

  // Messages
  enabledAllProjects: "Control habilitado para todos los proyectos",
  disabledAllProjects: "Control deshabilitado para todos los proyectos",
  noCustomProjectsYet:
    "Aún no hay proyectos personalizados, haz clic en el botón de arriba para agregar tu primer proyecto",

  // Parameterized messages
  projectsControlling: "{{count}} proyectos en control",
  projectsNotEffectiveDueToUrl:
    "{{count}} proyectos no efectivos debido a incompatibilidad de URL",
  selectorsCount: "{{count}} selectores",

  // Module management
  enterModuleName: "Ingresa el nombre del módulo",
  editModuleAction: "Editar",
  copyProject: "Copiar",
  deleteProjectAction: "Eliminar",
  confirmDeleteButtonText: "Confirmar eliminación",
  renameModule: "Renombrar módulo",
  deleteModule: "Eliminar todo el módulo",
  confirmDeleteModule: "Confirmar eliminación del módulo",

  // Form labels
  moduleName: "Nombre del módulo",
};
