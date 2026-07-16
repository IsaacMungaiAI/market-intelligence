"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Joyride, EVENTS, STATUS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { tourSteps, TOUR_STORAGE_KEY, type TourStep } from "./tour-steps";

const joyrideStyles = {
  options: {
    primaryColor: "#10b981",
    textColor: "#0f172a",
    backgroundColor: "#ffffff",
    overlayColor: "rgba(15, 23, 42, 0.4)",
    arrowColor: "#ffffff",
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: "12px",
    padding: "16px 20px",
  },
  tooltipContainer: {
    textAlign: "left" as const,
    lineHeight: "1.5",
  },
  buttonPrimary: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 20px",
  },
  buttonBack: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 500,
  },
  buttonSkip: {
    color: "#94a3b8",
    fontSize: "13px",
  },
};

type OnboardingTourProps = {
  forceRun?: boolean;
};

export function OnboardingTour({ forceRun }: OnboardingTourProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [run, setRun] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(TOUR_STORAGE_KEY);
  });
  const [stepIndex, setStepIndex] = React.useState(0);
  const [elementFound, setElementFound] = React.useState(false);

  const [prevForceRun, setPrevForceRun] = React.useState(forceRun);
  if (forceRun !== prevForceRun) {
    setPrevForceRun(forceRun);
    if (forceRun) {
      setStepIndex(0);
      setElementFound(false);
      setRun(true);
    }
  }

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setElementFound(false);
  }

  const [prevStepIndex, setPrevStepIndex] = React.useState(stepIndex);
  if (stepIndex !== prevStepIndex) {
    setPrevStepIndex(stepIndex);
    setElementFound(false);
  }

  const currentStep = run ? (tourSteps[stepIndex] as TourStep | undefined) : undefined;
  const target = currentStep && typeof currentStep.target === "string" ? currentStep.target : null;
  const onCorrectPage = currentStep ? pathname === currentStep.page : false;
  const targetCurrentlyExists = target ? !!document.querySelector(target) : true;
  const ready = run && onCorrectPage && (elementFound || !target || targetCurrentlyExists);

  React.useEffect(() => {
    if (!currentStep) return;
    if (pathname !== currentStep.page) {
      router.push(currentStep.page);
    }
  }, [currentStep, pathname, router]);

  React.useEffect(() => {
    if (!currentStep || pathname !== currentStep.page || !target) return;
    if (document.querySelector(target)) return;

    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
      attempts++;
      if (document.querySelector(target) || attempts >= maxAttempts) {
        clearInterval(interval);
        setElementFound(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, pathname, target]);

  const handleEvent = React.useCallback(
    (data: EventData) => {
      const { type, index, status } = data;

      if (type === EVENTS.STEP_AFTER) {
        const nextIndex = index + 1;
        if (nextIndex < tourSteps.length) {
          setStepIndex(nextIndex);
        }
      }

      if (type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = index + 1;
        if (nextIndex < tourSteps.length) {
          setStepIndex(nextIndex);
        }
      }

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRun(false);
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
      }
    },
    []
  );

  const steps: Step[] = tourSteps.map((step) => ({
    target: step.target,
    content: step.content,
    title: step.title,
    placement: step.placement,
    skipBeacon: step.skipBeacon,
  }));

  if (!run || !ready) return null;

  return (
    <Joyride
      steps={steps}
      stepIndex={stepIndex}
      run={run}
      onEvent={handleEvent}
      continuous
      styles={joyrideStyles}
      options={{
        hideOverlay: false,
        skipScroll: false,
        showProgress: true,
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Get Started",
        next: "Next",
        skip: "Skip tour",
      }}
    />
  );
}
