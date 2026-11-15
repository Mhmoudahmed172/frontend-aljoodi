"use client";

import { useEffect } from "react";
import { clarityMarkSuspicion } from "@/lib/clarity";
import { reportPlayerCrash } from "../services/subjectService";
import { takeCrashedPlayer } from "../utils/playerCrash";

/**
 * Tells the server when the previous page of this tab crashed with the lesson player open (see `utils/playerCrash`).
 * Runs once per page load, silently: a failed report (signed out, offline) is dropped. Renders nothing — mounted once
 * at the app root.
 */
export function PlayerCrashReporter() {
  useEffect(() => {
    const crashed = takeCrashedPlayer();
    if (!crashed) return;
    // The recording of the reloaded tab carries the crash, next to the one that crashed (same custom session id).
    clarityMarkSuspicion("player_crash", crashed.lesson);
    void reportPlayerCrash(crashed.lesson, crashed.page, crashed.openSeconds).catch(() => undefined);
  }, []);

  return null;
}
