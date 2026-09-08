"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export function useOverflowCheck<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const checkOverflow = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const overflows = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflows);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    el.addEventListener("scroll", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", checkOverflow);
    };
  }, [checkOverflow]);

  const scrollByStep = useCallback((direction: "next" | "prev") => {
    const el = ref.current;
    if (!el) return;

    const step = el.clientWidth * 0.9;
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  }, []);

  return { ref, hasOverflow, atStart, atEnd, scrollByStep };
}
