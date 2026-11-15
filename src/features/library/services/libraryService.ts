import { apiProxy } from "@/lib/api";
import type { LibraryFilesFilters, LibraryFilesPage, LibrarySubjectsResponse } from "../types/library.types";

/** `GET /user/v1/library` — subjects with an active subscription and their file counts. */
export function getLibrarySubjects(): Promise<LibrarySubjectsResponse> {
  return apiProxy.get<LibrarySubjectsResponse>("/user/v1/library");
}

/** `GET /user/v1/library/files` — course + lesson files of the subscribed subjects, paginated (422 on an invalid filter). */
export function getLibraryFiles(filters?: LibraryFilesFilters): Promise<LibraryFilesPage> {
  return apiProxy.get<LibraryFilesPage>("/user/v1/library/files", { params: filters });
}
