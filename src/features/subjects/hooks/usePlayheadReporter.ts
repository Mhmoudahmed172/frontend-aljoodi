"use client";

import { useEffect, type RefObject } from "react";
import { reportPlayhead } from "../services/subjectService";

/** Bunny's hosted Player.js build (the embed player speaks the Player.js protocol over postMessage). */
const PLAYERJS_SRC = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";

/** At most one report every 10 seconds, plus one right away on seek, pause and end. */
const SEND_EVERY_MS = 10_000;

const EVENTS = ["ready", "timeupdate", "progress", "seeked", "pause", "ended"] as const;

type PlayerJsPlayer = {
  on: (event: string, listener: (data?: unknown) => void) => void;
  off: (event: string) => void;
  getCurrentTime: (callback: (seconds: number) => void) => void;
};

declare global {
  interface Window {
    playerjs?: { Player: new (iframe: HTMLIFrameElement) => PlayerJsPlayer };
  }
}

let loading: Promise<void> | null = null;

/** Loads Player.js once per page; a failure is retried on the next lesson. */
const loadPlayerJs = (): Promise<void> => {
  if (window.playerjs) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYERJS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("playerjs"));
    };
    document.head.appendChild(script);
  });

  return loading;
};

/** `seconds` of a Player.js `timeupdate` / `progress` payload, when it is a usable number. */
const secondsOf = (data: unknown): number | null => {
  const seconds = (data as { seconds?: unknown } | undefined)?.seconds;

  return typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
};

/**
 * Tells the server how far the signed-in student's own player reached (position and buffer) while a lesson plays. The
 * download detection compares it with the CDN logs: segments pulled far past this player come from another program
 * using the student's link. Best effort and silent: a blocked script or a failed request never touches the playback.
 */
export function usePlayheadReporter(frame: RefObject<HTMLIFrameElement | null>, lessonUuid: string | null, src: string | null, enabled: boolean): void {
  useEffect(() => {
    const iframe = frame.current;
    if (!enabled || !lessonUuid || !src || !iframe) return;

    let active = true;
    let player: PlayerJsPlayer | null = null;
    let sentAt = 0;
    const state = { position: 0, buffered: 0 };
    const send = (now: boolean) => {
      if (!active || (!now && Date.now() - sentAt < SEND_EVERY_MS)) return;
      sentAt = Date.now();
      void reportPlayhead(lessonUuid, state.position, state.buffered).catch(() => undefined);
    };

    loadPlayerJs()
      .then(() => {
        if (!active || !window.playerjs) return;
        const created = new window.playerjs.Player(iframe);
        player = created;
        created.on("ready", () => {
          created.on("timeupdate", (data) => {
            const seconds = secondsOf(data);
            if (seconds === null) return;
            state.position = seconds;
            send(false);
          });
          created.on("progress", (data) => {
            const seconds = secondsOf(data);
            if (seconds === null) return;
            state.buffered = Math.max(state.buffered, seconds);
            send(false);
          });
          created.on("seeked", () =>
            created.getCurrentTime((seconds) => {
              if (Number.isFinite(seconds) && seconds >= 0) state.position = seconds;
              send(true);
            }),
          );
          created.on("pause", () => send(true));
          created.on("ended", () => send(true));
        });
      })
      .catch(() => undefined);

    return () => {
      active = false;
      EVENTS.forEach((event) => player?.off(event));
    };
  }, [frame, lessonUuid, src, enabled]);
}
