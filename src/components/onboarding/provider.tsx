"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { nextScreen, type Screen } from "@/lib/flow";
import { emptyOnboardingData, type OnboardingData } from "@/lib/types";

const STORAGE_KEY = "velpay-onboarding-v5";

interface PersistedState {
  screen: Screen;
  history: Screen[];
  data: OnboardingData;
}

interface OnboardingContextValue {
  screen: Screen;
  data: OnboardingData;
  hydrated: boolean;
  update: (patch: Partial<OnboardingData>) => void;
  /** Advance following the flow graph (rules-engine driven). */
  next: () => void;
  /** Jump to a specific screen, pushing history. */
  go: (screen: Screen) => void;
  back: () => void;
  canGoBack: boolean;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("auth-email");
  const [history, setHistory] = useState<Screen[]>([]);
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [hydrated, setHydrated] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Hydrate from localStorage once (CA-12 — resume where you left off).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed.data) setData({ ...emptyOnboardingData(), ...parsed.data });
        if (parsed.screen) setScreen(parsed.screen);
        if (parsed.history) setHistory(parsed.history);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ screen, history, data } satisfies PersistedState)
      );
    } catch {
      /* storage full / unavailable */
    }
  }, [screen, history, data, hydrated]);

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  const go = useCallback((target: Screen) => {
    setHistory((h) => [...h, screenRef.current]);
    setScreen(target);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  // keep a ref to current screen for go()/next() without stale closures
  const screenRef = useRef(screen);
  screenRef.current = screen;

  const next = useCallback(() => {
    const target = nextScreen(screenRef.current, dataRef.current);
    if (target === screenRef.current) return;
    setHistory((h) => [...h, screenRef.current]);
    setScreen(target);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const reset = useCallback(() => {
    setData(emptyOnboardingData());
    setHistory([]);
    setScreen("auth-email");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      screen,
      data,
      hydrated,
      update,
      next,
      go,
      back,
      canGoBack: history.length > 0,
      reset,
    }),
    [screen, data, hydrated, update, next, go, back, history.length, reset]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
