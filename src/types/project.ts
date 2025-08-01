import type {
  CustomProjectConfig,
  ProjectValidationResult,
} from "../lib/access-control";
import type { FormInstance } from "antd";
import type { DragEndEvent } from "@dnd-kit/core";

export interface PageInfo {
  url: string;
  title: string;
  projects: Array<{
    id: string;
    name: string;
    selector: string;
    elementCount: number;
    enabled: boolean;
    behavior: string;
    module: string;
    description: string;
    urlMatches?: boolean; // Whether URL matches
    urlPattern?: string; // URL pattern
  }>;
  totalElementCount: number;
  totalMatchingElementCount?: number; // Total elements considering URL matching
  configuredProjectCount: number;
  enabledProjectCount: number;
  enabledMatchingProjectCount?: number; // Number of enabled projects that match URL
}

export interface ProjectListProps {
  customProjects: { [id: string]: CustomProjectConfig };
  createdModules?: string[]; // List of created groups
  pageInfo: PageInfo | null;
  viewMode: "list" | "group";
  expandedGroups: string[];
  scrollPosition: number;
  onGroupExpand: (expandedKeys: string[]) => void;
  onScrollPositionChange: (position: number) => void;
  lang: string;
  onEdit: (project: CustomProjectConfig) => void;
  onCopy: (project: CustomProjectConfig) => void;
  onDelete: (projectName: string) => void;
  onToggle: (projectName: string, enabled: boolean) => void;
  onBatchToggle: (projectNames: string[], enabled: boolean) => void;
  onUpdateBehavior: (
    projectName: string,
    behavior: "hide" | "disable" | "blur" | "restrict"
  ) => void;
  onEditModule: (moduleName: string) => void;
  onDeleteModule: (moduleName: string) => void;
  // Edit-related props
  isEditing: boolean;
  editingProject: CustomProjectConfig | null;
  form: FormInstance;
  validationResult: ProjectValidationResult;
  moduleOptions: Array<{ label: string; value: string }>;
  getModuleList: () => string[];
  onEditCancel: () => void;
  onEditSave: () => void;
  // Drag-related props
  onDragEnd: (event: DragEndEvent) => void;
}

export interface ProjectCardProps {
  project: CustomProjectConfig;
  pageInfo: PageInfo | null;
  lang: string;
  dragListeners?: any;
  isEditing: boolean;
  editingProject: CustomProjectConfig | null;
  form: FormInstance;
  validationResult: ProjectValidationResult;
  moduleOptions: Array<{ label: string; value: string }>;
  getModuleList: () => string[];
  onEdit: (project: CustomProjectConfig) => void;
  onCopy: (project: CustomProjectConfig) => void;
  onDelete: (projectName: string) => void;
  onToggle: (projectName: string, enabled: boolean) => void;
  onUpdateBehavior: (
    projectName: string,
    behavior: "hide" | "disable" | "blur" | "restrict"
  ) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
}
