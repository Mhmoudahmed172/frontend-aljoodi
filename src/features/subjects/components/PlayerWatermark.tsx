"use client";

import { useEffect, useRef, useState } from "react";
import type { WatermarkTamperReason } from "../types/subject.types";

interface PlayerWatermarkProps {
  /** Lines identifying the viewer (name, mobile, account id), sent by the embed endpoint; nothing is drawn when empty. */
  lines: string[];
  /** Called once when the watermark was removed, hidden or covered (DevTools), with what was measured; the player stops the video. */
  onTamper: (reason: WatermarkTamperReason, details: Record<string, unknown>) => void;
}

/** How often the watermark jumps to a new spot, so it can't be cropped or blurred out of a recording. */
const MOVE_EVERY_MS = 5_000;

/** How often the watermark is checked on top of the DOM observer (stylesheet edits don't fire mutations). */
const CHECK_EVERY_MS = 1_000;

/** Kept inline so the check can compare the computed color against it. */
const TEXT_COLOR = "rgba(255, 255, 255, 0.45)";

/** z-index of the overlay (`z-10`); the video iframe must stay below it. */
const OVERLAY_Z_INDEX = 10;

const randomPosition = () => ({ top: 8 + Math.random() * 72, left: 8 + Math.random() * 62 });

/** Whether the element is drawn and readable: not hidden, faded, filtered or clipped away. */
const isVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);

  return (
    style.display !== "none" &&
    style.visibility === "visible" &&
    style.opacity === "1" &&
    style.filter === "none" &&
    style.clipPath === "none" &&
    style.mixBlendMode === "normal"
  );
};

/**
 * Why the watermark is no longer shown over the video exactly as we drew it, or `null` while it is intact. Any change
 * made from DevTools (deleting the node, editing the text, hiding/moving/shrinking it, raising the iframe above it)
 * fails one of the checks.
 */
const tamperReason = (overlay: HTMLDivElement, mark: HTMLDivElement, frame: HTMLElement | null, text: string): WatermarkTamperReason | null => {
  if (!frame || !overlay.isConnected || overlay.parentElement !== frame || mark.parentElement !== overlay) return "removed";
  if (mark.textContent !== text) return "text_changed";
  if (!isVisible(overlay) || !isVisible(mark) || window.getComputedStyle(mark).color !== TEXT_COLOR) return "hidden";
  if (Number(window.getComputedStyle(overlay).zIndex) < OVERLAY_Z_INDEX) return "covered";

  const iframe = frame.querySelector("iframe");
  const iframeZ = iframe ? Number(window.getComputedStyle(iframe).zIndex) : NaN;
  if (!Number.isNaN(iframeZ) && iframeZ >= OVERLAY_Z_INDEX) return "covered";

  const box = mark.getBoundingClientRect();
  const area = frame.getBoundingClientRect();
  const overlaps = box.right > area.left && box.left < area.right && box.bottom > area.top && box.top < area.bottom;

  return overlaps && box.width >= 20 && box.height >= 8 ? null : "moved";
};

/**
 * What the check saw when it found tampering, kept with the report: a browser feature (page translation, forced dark
 * mode, a dark-theme extension) changes the text or color without anyone touching DevTools, and these values tell
 * an admin which one it was.
 */
const tamperDetails = (overlay: HTMLDivElement, mark: HTMLDivElement, frame: HTMLElement | null, text: string): Record<string, unknown> => {
  const root = document.documentElement;
  const details: Record<string, unknown> = {
    overlay_connected: overlay.isConnected,
    text_matches: mark.textContent === text,
    text_found: (mark.textContent ?? "").slice(0, 200),
    html_lang: root.lang,
    // Google / Opera page translation marks the root element (`translated-ltr`, `translated-rtl`).
    html_class: root.className.slice(0, 200),
    color_scheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    forced_colors: window.matchMedia("(forced-colors: active)").matches,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixel_ratio: window.devicePixelRatio,
    fullscreen: document.fullscreenElement !== null,
    visibility: document.visibilityState,
  };

  if (overlay.isConnected) {
    const overlayStyle = window.getComputedStyle(overlay);
    const markStyle = window.getComputedStyle(mark);
    const box = mark.getBoundingClientRect();
    const area = frame?.getBoundingClientRect();
    const iframe = frame?.querySelector("iframe");
    Object.assign(details, {
      mark_color: markStyle.color,
      mark_opacity: markStyle.opacity,
      mark_display: markStyle.display,
      mark_visibility: markStyle.visibility,
      mark_filter: markStyle.filter,
      overlay_opacity: overlayStyle.opacity,
      overlay_filter: overlayStyle.filter,
      overlay_clip_path: overlayStyle.clipPath,
      overlay_blend: overlayStyle.mixBlendMode,
      overlay_z_index: overlayStyle.zIndex,
      iframe_z_index: iframe ? window.getComputedStyle(iframe).zIndex : null,
      mark_box: [box.left, box.top, box.width, box.height].map(Math.round),
      frame_box: area ? [area.left, area.top, area.width, area.height].map(Math.round) : null,
    });
  }

  return details;
};

/**
 * Moving watermark drawn over the lesson video with the signed-in student's identity. A browser can't block
 * screenshots or screen recording, so every capture carries the name of whoever made it instead.
 * `pointer-events: none` keeps the Bunny player controls underneath clickable.
 *
 * The watermark guards itself: a DOM observer plus a periodic check call `onTamper` as soon as it stops being
 * shown as drawn, so the player can take the video away.
 */
export function PlayerWatermark({ lines, onTamper }: PlayerWatermarkProps) {
  const [position, setPosition] = useState(randomPosition);
  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const onTamperRef = useRef(onTamper);
  const text = lines.join("");

  useEffect(() => {
    onTamperRef.current = onTamper;
  }, [onTamper]);

  useEffect(() => {
    const timer = window.setInterval(() => setPosition(randomPosition()), MOVE_EVERY_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const mark = markRef.current;
    if (!overlay || !mark || text === "") return;

    // Captured now: once the overlay is deleted it no longer knows its parent.
    const frame = overlay.parentElement;
    let tampered = false;
    const check = () => {
      // The whole player leaving the page (modal closing before this effect is cleaned up) is not tampering.
      if (tampered || !frame?.isConnected) return;
      const reason = tamperReason(overlay, mark, frame, text);
      if (!reason) return;
      tampered = true;
      onTamperRef.current(reason, tamperDetails(overlay, mark, frame, text));
    };

    const observer = new MutationObserver(check);
    if (frame) observer.observe(frame, { childList: true, subtree: true, attributes: true, characterData: true });
    const timer = window.setInterval(check, CHECK_EVERY_MS);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [text]);

  if (lines.length === 0) return null;

  return (
    <div ref={overlayRef} aria-hidden data-clarity-mask="true" className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden">
      <div
        ref={markRef}
        dir="ltr"
        className="absolute flex flex-col items-center text-[11px] font-bold leading-4 transition-[top,left] duration-1000 ease-in-out [text-shadow:0_0_2px_rgba(0,0,0,0.6)] md:text-sm md:leading-5"
        style={{ top: `${position.top}%`, left: `${position.left}%`, color: TEXT_COLOR }}
      >
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  );
}
