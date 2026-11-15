"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";

/** Backend `RegionEnum` value. */
export type PriceRegion = "west_bank" | "gaza";

export const DEFAULT_REGION: PriceRegion = "west_bank";
const STORAGE_KEY = "aljoodi:region";
const CHANGE_EVENT = "aljoodi:region-change";

const isRegion = (value: unknown): value is PriceRegion => value === "west_bank" || value === "gaza";

const readStored = (): PriceRegion => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);

    return isRegion(value) ? value : DEFAULT_REGION;
  } catch {
    return DEFAULT_REGION;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

/**
 * Region used to price the public catalog: a signed-in student's account region (locked), otherwise the
 * visitor's choice kept in localStorage, defaulting to the West Bank. Passed as `?region=` to the catalog
 * endpoints; the backend re-resolves it from the account when a subscription is actually created.
 * Guests never hit `/auth/me` (its 401 would trigger the global redirect to login).
 */
export function useRegion() {
  const { data: session } = useSessionStatus();
  const { data: user } = useCurrentUser(session?.authenticated === true);
  const stored = useSyncExternalStore(subscribe, readStored, () => DEFAULT_REGION);

  const setRegion = useCallback((value: PriceRegion) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const accountRegion = session?.authenticated && isRegion(user?.region) ? user.region : null;

  return { region: accountRegion ?? stored, setRegion, locked: accountRegion !== null };
}
