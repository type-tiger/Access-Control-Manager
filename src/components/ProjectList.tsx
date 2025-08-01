import { Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { createTranslator } from "../lib/i18n";
import { getProjectModuleGroups } from "../utils/popupUtils";
import { getUnmatchedUrlCount } from "../utils/projectUtils";
import { ProjectCard } from "./ProjectCard";
import { ProjectListView } from "./ProjectListView";
import { ProjectGroupView } from "./ProjectGroupView";
import { ProjectForm } from "./ProjectForm";
import type { ProjectListProps } from "../types/project";

const { Text } = Typography;

export function ProjectList({
  customProjects,
  createdModules,
  pageInfo,
  viewMode,
  expandedGroups,
  scrollPosition,
  onGroupExpand,
  onScrollPositionChange,
  lang,
  onEdit,
  onCopy,
  onDelete,
  onToggle,
  onBatchToggle,
  onUpdateBehavior,
  onEditModule,
  onDeleteModule,
  isEditing,
  editingProject,
  form,
  validationResult,
  moduleOptions,
  getModuleList,
  onEditCancel,
  onEditSave,
  onDragEnd,
}: ProjectListProps) {
  const t = createTranslator(lang);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Drag sensor configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Convert customProjects to sorted array for list view
  const customProjectsList = Object.values(customProjects);
  const sortedProjects = [...customProjectsList].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  // Get project module groups for group view
  const projectModuleGroups = getProjectModuleGroups(
    customProjects,
    createdModules
  );

  // Count projects not effective due to URL mismatch
  const unmatchedUrlCount = getUnmatchedUrlCount(customProjects, pageInfo);

  // Restore scroll position
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      scrollPosition > 0 &&
      !isRestoringScroll.current
    ) {
      isRestoringScroll.current = true;
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollPosition;
        }
        isRestoringScroll.current = false;
      }, 100);
    }
  }, [scrollPosition, customProjects]);

  // Handle scroll events (debounced)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isRestoringScroll.current) {
      const scrollTop = e.currentTarget.scrollTop;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        onScrollPositionChange(scrollTop);
      }, 300);
    }
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Drag handling functions
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  // Common props for project card components
  const projectCardProps = {
    pageInfo,
    lang,
    isEditing,
    editingProject,
    form,
    validationResult,
    moduleOptions,
    getModuleList,
    onEdit,
    onCopy,
    onDelete,
    onToggle,
    onUpdateBehavior,
    onEditCancel,
    onEditSave,
  };

  // Render main content based on view mode
  const renderContent = () => {
    if (viewMode === "list") {
      return (
        <ProjectListView
          sortedProjects={sortedProjects}
          {...projectCardProps}
        />
      );
    }

    // Group view
    return (
      <>
        {/* If adding a new project, show edit form at the beginning of group view */}
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

        {Object.keys(projectModuleGroups).length === 0 && !isEditing ? (
          <Text type="secondary">{t("noCustomProjectsYet")}</Text>
        ) : (
          <ProjectGroupView
            projectModuleGroups={projectModuleGroups}
            expandedGroups={expandedGroups}
            onGroupExpand={onGroupExpand}
            onBatchToggle={onBatchToggle}
            onEditModule={onEditModule}
            onDeleteModule={onDeleteModule}
            {...projectCardProps}
          />
        )}
      </>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Show count of projects not effective due to URL mismatch */}
      {unmatchedUrlCount > 0 && (
        <Tag color="orange" style={{ marginBottom: 8 }}>
          {t("projectsNotEffectiveDueToUrl", { count: unmatchedUrlCount })}
        </Tag>
      )}

      <div
        ref={scrollContainerRef}
        style={{
          maxHeight: viewMode === "list" ? 300 : undefined,
          overflowY: "auto",
        }}
        onScroll={handleScroll}
      >
        {renderContent()}
      </div>

      <DragOverlay>
        {activeId ? (
          <div style={{ opacity: 0.8 }}>
            <ProjectCard
              project={customProjects[activeId]}
              {...projectCardProps}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
