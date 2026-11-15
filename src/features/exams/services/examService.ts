import type { Exam } from "../types/exam.types";

/**
 * There is no backend Exam API and none is planned — exams are an intentional "coming soon"
 * feature. This resolves immediately with an empty list rather than performing a network call.
 */
export async function getExams(): Promise<Exam[]> {
  return [];
}
