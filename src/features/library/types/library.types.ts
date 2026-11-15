import type { Paginated } from "@/types/api/common";

/** `GET /user/v1/library` row — a subject the student holds an active subscription to, with its file counts. */
export interface LibrarySubject {
  uuid: string;
  slug: string;
  name: string;
  icon_url: string | null;
  files_count: number;
  course_files_count: number;
  lesson_files_count: number;
  last_file_at: string | null;
}

/** `GET /user/v1/library` payload. */
export interface LibrarySubjectsResponse {
  items: LibrarySubject[];
}

export type LibraryFileSource = "course" | "lesson";

/** File types the library filter offers (the backend enum also has video types, which the library never lists). */
export const LIBRARY_FILE_TYPES = ["pdf", "doc", "png", "jpg", "gif", "svg", "webp", "other"] as const;

export type LibraryFileType = (typeof LIBRARY_FILE_TYPES)[number];

/** `GET /user/v1/library/files` row. `url` is null while the file is locked behind a required quiz. */
export interface LibraryFile {
  uuid: string;
  name: string;
  type: string;
  size: number | null;
  url: string | null;
  created_at: string;
  source: LibraryFileSource;
  is_locked: boolean;
  locked_by_quiz: { lesson_uuid: string; title: string } | null;
  subject: { uuid: string; slug: string; name: string } | null;
  course: { uuid: string; name: string } | null;
  lesson: { uuid: string; title: string } | null;
  unit: { uuid: string; title: string; semester: "first" | "second" } | null;
  chapter: { uuid: string; title: string } | null;
}

export type LibraryFilesPage = Paginated<LibraryFile>;

export interface LibraryFilesFilters {
  subject?: string;
  search?: string;
  source?: LibraryFileSource;
  type?: LibraryFileType;
  page?: number;
  per_page?: number;
}
