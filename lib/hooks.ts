"use client";

import { useEffect, useState } from "react";

/**
 * True once the component has mounted on the client.
 * Used to hold back anything that reads window/pointer during SSR.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * True when the device has a real pointer (mouse/trackpad).
 * Cursor and magnetic effects are pointless — and janky — on touch.
 */
export function useHasPointer() {
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHasPointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return hasPointer;
}

/** Live clock for the studio location, formatted in its own timezone. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}
