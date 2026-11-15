"use client";

import { useEffect, useState } from "react";
import { getExams } from "../services/examService";
import type { Exam } from "../types/exam.types";

/**
 * There is no backend Exam API — `getExams()` always resolves to an empty list. Kept as a hook
 * (rather than a bare constant) so consumers don't need to change once a real Exam API exists.
 */
export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    let active = true;
    getExams().then((data) => active && setExams(data));
    return () => {
      active = false;
    };
  }, []);

  return { exams };
}
