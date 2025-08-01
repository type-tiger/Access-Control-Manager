import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CustomProjectConfig } from "../lib/access-control";
import type { ProjectCardProps } from "../types/project";
import { ProjectCard } from "./ProjectCard";

interface DraggableProjectCardProps
  extends Omit<ProjectCardProps, "dragListeners"> {
  project: CustomProjectConfig;
}

export function DraggableProjectCard(props: DraggableProjectCardProps) {
  const { project } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ProjectCard {...props} dragListeners={listeners} />
    </div>
  );
}
