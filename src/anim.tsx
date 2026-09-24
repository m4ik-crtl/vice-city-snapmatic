import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll: observes every `.reveal` not yet shown and adds `.in`
 * when it enters the viewport. Re-scans whenever `dep` changes (view swap).
 * Progressive enhancement: if IntersectionObserver is missing, reveal all.
 */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((e) => io.observe(e));
    // failsafe: never leave anything permanently hidden
    const t = window.setTimeout(() => els.forEach((e) => e.classList.add('in')), 3500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [dep]);
}

/**
 * Count-up number that animates the first time it scrolls into view.
 */
export function CountUp({
  value,
  duration = 1400,
  suffix = '',
  pad = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  pad?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (done.current) return;
      done.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const text = pad ? String(n).padStart(pad, '0') : String(n);
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}
