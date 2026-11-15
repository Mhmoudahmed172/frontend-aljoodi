export type ExamState = "start" | "view" | "result";

export interface Exam {
  id: string;
  title: string;
  subject: string;
  day: "today" | "tomorrow" | "thursday";
  time: string;
  state: ExamState;
}
