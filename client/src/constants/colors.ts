export const workspacePalette = [
  "#5B5FEF",
  "#16A34A",
  "#E54848",
  "#F59E0B",
  "#0EA5E9",
  "#A855F7",
  "#EC4899",
];

export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export const STATUS_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "#94a3b8",
  TODO: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  IN_REVIEW: "#8b5cf6",
  DONE: "#22c55e",
};
