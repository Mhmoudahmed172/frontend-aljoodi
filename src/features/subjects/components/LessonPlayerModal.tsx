"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useT } from "@/lib/i18n";
import { api, apiProxy, toApiError } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ClipboardCheckIcon, ExpandIcon, LockIcon, ShrinkIcon } from "@/components/ui/Icons";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";
import { withRedirect } from "@/features/auth/utils/redirect";
import { LessonLockedNotice } from "@/features/quizzes/components/LessonLockedNotice";
import { lockedByFromError } from "@/features/quizzes/services/quizService";
import { usePlayheadReporter } from "../hooks/usePlayheadReporter";
import { clarityMarkSuspicion, clarityReference } from "@/lib/clarity";
import { reportWatermarkTamper } from "../services/subjectService";
import type { LessonMini, WatermarkTamperReason } from "../types/subject.types";
import { DEVTOOLS_PAUSE_MS, debuggerPauseMs, devToolsDetails } from "../utils/devtools";
import { clearPlayerOpen, markPlayerOpen } from "../utils/playerCrash";
import { subjectCourseHref } from "../utils/teachers";
import { PlayerWatermark } from "./PlayerWatermark";

interface LessonPlayerModalProps {
  slug: string;
  /** Slug of the subject's course the lesson belongs to — kept on the "subscribe" link. */
  course?: string | null;
  lesson: LessonMini | null;
  onClose: () => void;
  /** Opens a lesson's quiz (the "start the lesson quiz" button, or the locked notice's "previous lesson" button). */
  onOpenQuiz?: (lesson: { uuid: string; title: string }) => void;
}

/** `watermark`: the signed-in viewer's lines (name, mobile or email, account id) built by the backend; empty for guests. */
type Embed = { url: string; thumbnail_url: string | null; expires_at: string; watermark: string[] };

/**
 * Plays a lesson video inside a signed, short-lived Bunny embed. The embed URL is requested only when the
 * modal opens (`GET /api/v1/subjects/{slug}/lessons/{uuid}/embed`): free lessons for everyone, other lessons
 * only through the authenticated proxy for students with access. Nothing about the video is stored client-side.
 * A 423 `QUIZ_LOCKED` answer (previous lesson's required quiz not submitted) shows the locked notice instead.
 *
 * Signed-in students get a moving watermark over the video with the lines the embed endpoint returns (taken from the
 * account on the server, not from the client's user data). If the watermark is removed or hidden from DevTools the
 * iframe is taken away until the modal is opened again, and the server is told (student, lesson, reason) so admins see it
 * in the video activity monitoring. Fullscreen is done on our own container (the iframe itself
 * isn't allowed to go fullscreen), otherwise the watermark would be left behind.
 *
 * DevTools are checked before the embed URL is requested and every second while the modal is open: when they are
 * open the URL is never fetched (or the iframe is taken away) and the server is told, like a watermark tamper.
 */
export function LessonPlayerModal({ slug, course, lesson, onClose, onOpenQuiz }: LessonPlayerModalProps) {
  const { t } = useT();
  const { data: session } = useSessionStatus();
  const open = Boolean(lesson);
  const authenticated = session?.authenticated === true;
  // Signed URL of the embed whose watermark was tampered with: that video stays gone, reopening fetches a new URL.
  const [tamperedUrl, setTamperedUrl] = useState<string | null>(null);
  // Whether the server banned the student for the last report; a weak case waits for an admin and only stops the video.
  const [suspended, setSuspended] = useState(false);
  const onReported = (result: { banned?: boolean }) => setSuspended(result.banned === true);
  // `pending` until the first DevTools check of this opening ran; the embed is only requested once it is `clear`.
  const [devtools, setDevtools] = useState<"pending" | "clear" | "open">("pending");

  const frameRef = useRef<HTMLDivElement>(null);
  // `fullscreen` = the browser Fullscreen API is on our frame; `expanded` = CSS fallback where the API is missing (iPhone Safari).
  const [fullscreen, setFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current && frameRef.current !== null);
    document.addEventListener("fullscreenchange", onChange);

    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  const lessonUuid = lesson?.uuid ?? null;
  useEffect(() => {
    if (!lessonUuid) return;

    const check = () => {
      const pauseMs = debuggerPauseMs();
      if (pauseMs <= DEVTOOLS_PAUSE_MS) {
        setDevtools("clear");

        return;
      }
      window.clearInterval(timer);
      setDevtools("open");
      // Fire and forget, like the watermark tamper report.
      clarityMarkSuspicion("devtools", lessonUuid);
      if (authenticated) {
        void reportWatermarkTamper(lessonUuid, "devtools", { ...devToolsDetails(pauseMs), ...clarityReference() })
          .then((result) => setSuspended(result.banned === true))
          .catch(() => undefined);
      }
    };

    const timer = window.setInterval(check, 1_000);
    check();

    // Closing the modal (or switching lesson) starts the next opening from a fresh check.
    return () => {
      window.clearInterval(timer);
      setDevtools("pending");
      setSuspended(false);
    };
  }, [lessonUuid, authenticated]);

  const toggleFullscreen = () => {
    if (fullscreen) {
      void document.exitFullscreen();
    } else if (frameRef.current?.requestFullscreen && document.fullscreenEnabled) {
      void frameRef.current.requestFullscreen();
    } else {
      setExpanded((value) => !value);
    }
  };

  const query = useQuery<Embed, unknown>({
    queryKey: ["subjects", "lesson-embed", slug, lesson?.uuid ?? null, authenticated],
    // `ticket`: the iframe gets a one-time play link on our API (it redirects to the signed Bunny embed once), so a
    // `src` copied out of the page is already dead.
    queryFn: () => (authenticated ? apiProxy : api).get<Embed>(`/api/v1/subjects/${slug}/lessons/${lesson?.uuid}/embed`, { params: { ticket: 1 } }),
    enabled: open && devtools === "clear",
    retry: false,
    // Signed URLs expire; never serve a cached one from an earlier session.
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const embed = query.data ?? null;
  const devtoolsOpen = devtools === "open";
  const tampered = !devtoolsOpen && embed !== null && embed.url === tamperedUrl;
  const onTamper = (reason: WatermarkTamperReason, details: Record<string, unknown>) => {
    if (!embed || !lesson) return;
    setTamperedUrl(embed.url);
    // Fire and forget: a failed report must never bring the video back or show an error.
    // The Clarity recording of this moment is kept and tagged, so the admin reviewing the case can watch it.
    clarityMarkSuspicion(reason, lesson.uuid);
    if (authenticated) void reportWatermarkTamper(lesson.uuid, reason, { ...details, ...clarityReference() }).then(onReported).catch(() => undefined);
  };
  const apiErr = query.error ? toApiError(query.error) : null;
  const lockedBy = apiErr ? lockedByFromError(apiErr) : null;
  const error = apiErr
    ? { message: apiErr.status === 403 ? t("subjects.lessonLocked") : apiErr.message || t("subjects.playerError"), locked: apiErr.status === 403 }
    : null;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playing = embed !== null && !tampered && !devtoolsOpen;
  usePlayheadReporter(iframeRef, lesson?.uuid ?? null, playing ? embed.url : null, authenticated);

  // Marks the player open in this tab, so a tab crash is reported on the next load (`PlayerCrashReporter`). Every clean
  // exit removes the mark: closing the modal, switching lesson, leaving or reloading the page.
  const markedLesson = playing && authenticated ? lessonUuid : null;
  useEffect(() => {
    if (!markedLesson) return;

    const openedAt = Date.now();
    const mark = () => markPlayerOpen(markedLesson, openedAt);
    // Back from the browser's back/forward cache: the page and its player are alive again.
    const onPageShow = (event: PageTransitionEvent) => event.persisted && mark();
    mark();
    const timer = window.setInterval(mark, 5_000);
    window.addEventListener("pagehide", clearPlayerOpen);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pagehide", clearPlayerOpen);
      window.removeEventListener("pageshow", onPageShow);
      clearPlayerOpen();
    };
  }, [markedLesson]);
  const quizPending = Boolean(lesson?.quiz && lesson.quiz.attempt_status !== "submitted" && !lesson.locked_by_quiz && onOpenQuiz);
  // Removing the iframe while its video plays (or is popped out by the browser) crashes the whole tab on Opera and
  // some Chromium builds: the player is unloaded first, and the modal closes once it has been torn down.
  const closePlayer = () => {
    const iframe = iframeRef.current;
    if (!iframe) {
      onClose();

      return;
    }
    iframe.src = "about:blank";
    window.setTimeout(onClose, 150);
  };

  return (
    <Modal open={open} onClose={closePlayer} className="max-w-3xl p-4 md:p-5">
      {lesson && (
        <div className="flex flex-col gap-3">
          <div className="pe-10">
            <h3 className="text-base font-bold text-text-heading">{lesson.title}</h3>
            <p className="text-[11px] text-text-muted">{t("subjects.playerProtected")}</p>
          </div>
          <div
            ref={frameRef}
            className={
              expanded
                ? "fixed inset-0 z-[60] flex items-center justify-center bg-black"
                : "relative aspect-video w-full overflow-hidden rounded-xl bg-black"
            }
          >
            {embed && !tampered && !devtoolsOpen ? (
              <>
                <iframe
                  ref={iframeRef}
                  src={embed.url}
                  title={lesson.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; gyroscope; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <PlayerWatermark lines={embed.watermark ?? []} onTamper={onTamper} />
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={fullscreen || expanded ? t("subjects.playerExitFullscreen") : t("subjects.playerFullscreen")}
                  title={fullscreen || expanded ? t("subjects.playerExitFullscreen") : t("subjects.playerFullscreen")}
                  className="absolute end-2 top-2 z-20 flex size-9 items-center justify-center rounded-lg bg-black/50 text-white transition hover:bg-black/70"
                >
                  {fullscreen || expanded ? <ShrinkIcon size={18} /> : <ExpandIcon size={18} />}
                </button>
              </>
            ) : (
              <>
                {lesson.cover_url && <Image src={lesson.cover_url} alt="" fill unoptimized className="object-cover opacity-60" sizes="768px" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
                  {devtoolsOpen || tampered ? (
                    <>
                      <LockIcon size={28} />
                      <p className="text-sm font-semibold">
                        {t(suspended ? "subjects.playerSuspended" : devtoolsOpen ? "subjects.playerDevtools" : "subjects.playerTampered")}
                      </p>
                    </>
                  ) : lockedBy ? (
                    <LessonLockedNotice
                      variant="overlay"
                      lockedBy={lockedBy}
                      onOpenQuiz={onOpenQuiz ? (locked) => onOpenQuiz({ uuid: locked.lesson_uuid, title: locked.title }) : undefined}
                    />
                  ) : error ? (
                    <>
                      {error.locked && <LockIcon size={28} />}
                      <p className="text-sm font-semibold">{error.message}</p>
                      {error.locked && (
                        // Guests log in first and come back to the subject's packages (subscribing needs an account).
                        <Link
                          href={authenticated ? `${subjectCourseHref(slug, course)}#subscribe` : withRedirect("/login", `${subjectCourseHref(slug, course)}#subscribe`)}
                          onClick={onClose}
                        >
                          <Button size="sm">{t("subjects.subscribePackage")}</Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold">{t("subjects.playerLoading")}</p>
                  )}
                </div>
              </>
            )}
          </div>
          {quizPending && (
            <div className="flex flex-col items-center justify-between gap-2 rounded-xl bg-primary-faint px-4 py-3 sm:flex-row">
              <span className="flex items-center gap-2 text-xs font-semibold text-text-heading">
                <ClipboardCheckIcon size={16} className="text-primary" />
                {lesson.quiz?.attempt_status === "in_progress"
                  ? t("quizzes.inProgressHint")
                  : t("quizzes.questionsCount", { count: lesson.quiz?.questions_count ?? 0 })}
              </span>
              <Button size="sm" onClick={() => onOpenQuiz?.({ uuid: lesson.uuid, title: lesson.title })}>
                {lesson.quiz?.attempt_status === "in_progress" ? t("quizzes.resume") : t("quizzes.startLessonQuiz")}
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
