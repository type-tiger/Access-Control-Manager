import { Typography } from "antd";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createTranslator } from "../lib/i18n";
import { DraggableProjectCard } from "./DraggableProjectCard";
import { ProjectForm } from "./ProjectForm";
import type { ProjectCardProps } from "../types/project";
import type { CustomProjectConfig } from "../lib/access-control";

const { Text } = Typography;

interface ProjectListViewProps
  extends Omit<ProjectCardProps, "project" | "dragListeners"> {
  sortedProjects: CustomProjectConfig[];
}

export function ProjectListView({
  sortedProjects,
  isEditing,
  editingProject,
  form,
  validationResult,
  moduleOptions,
  getModuleList,
  lang,
  onEditCancel,
  onEditSave,
  ...projectCardProps
}: ProjectListViewProps) {
  const t = createTranslator(lang);

  return (
    <>
      {/* If adding a new project, show edit form at the beginning of the list */}
      {isEditing && !editingProject && (
        <div style={{ marginBottom: 8 }}>
          <ProjectForm
            visible={true}
            editingProject={editingProject}
            form={form}
            validationResult={validationResult}
            moduleOptions={moduleOptions}
            getModuleList={getModuleList}
            lang={lang}
            onCancel={onEditCancel}
            onSave={onEditSave}
          />
        </div>
      )}

      {sortedProjects.length === 0 && !isEditing ? (
        <Text type="secondary">{t("noCustomProjectsYet")}</Text>
      ) : (
        <SortableContext
          items={sortedProjects.map((p) => p.name)}
          strategy={verticalListSortingStrategy}
        >
          {sortedProjects.map((project) => (
            <DraggableProjectCard
              key={project.name}
              project={project}
              isEditing={isEditing}
              editingProject={editingProject}
              form={form}
              validationResult={validationResult}
              moduleOptions={moduleOptions}
              getModuleList={getModuleList}
              lang={lang}
              onEditCancel={onEditCancel}
              onEditSave={onEditSave}
              {...projectCardProps}
            />
          ))}
        </SortableContext>
      )}
    </>
  );
}
