"use client";

import * as React from "react";
import { OnboardingTour } from "./onboarding-tour";
import { TOUR_STORAGE_KEY } from "./tour-steps";

type OnboardingContextType = {
  isFirstVisit: boolean;
  startTour: () => void;
  resetTour: () => void;
};

const OnboardingContext = React.createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = React.useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem(TOUR_STORAGE_KEY);
  });
  const [tourRun, setTourRun] = React.useState(false);

  const startTour = React.useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setIsFirstVisit(true);
    setTourRun(true);
  }, []);

  const resetTour = React.useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setIsFirstVisit(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ isFirstVisit, startTour, resetTour }}>
      {children}
      <OnboardingTour forceRun={tourRun} />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return ctx;
}
