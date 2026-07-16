import type { Step } from "react-joyride";

export type TourStep = Step & {
  page: string;
};

export const TOUR_STORAGE_KEY = "kmip_onboarding_complete";

export const tourSteps: TourStep[] = [
  {
    target: '[data-tour="overview-hero"]',
    content:
      "Welcome to KMIP! This is your dashboard overview — a snapshot of your portfolio value, market pulse, and key stats at a glance.",
    title: "Welcome to KMIP",
    placement: "center",
    page: "/dashboard",
    skipBeacon: true,
  },
  {
    target: '[data-tour="sidebar-nav"]',
    content:
      "Use the sidebar to navigate between your portfolio, watchlists, intelligence signals, and company research. Everything is one click away.",
    title: "Main Navigation",
    placement: "right",
    page: "/dashboard",
    skipBeacon: true,
  },
  {
    target: '[data-tour="add-holding-btn"]',
    content:
      "Add your first stock holding by clicking this button. Enter the ticker, quantity, and average cost — KMIP handles the rest.",
    title: "Build Your Portfolio",
    placement: "left",
    page: "/dashboard/portfolio",
    skipBeacon: true,
  },
  {
    target: '[data-tour="add-watchlist-btn"]',
    content:
      "Track companies you're interested in. Add them to your watchlist to monitor price movements and stay informed about changes that matter.",
    title: "Track Companies",
    placement: "left",
    page: "/dashboard/watchlists",
    skipBeacon: true,
  },
  {
    target: '[data-tour="ai-analyst-input"]',
    content:
      "Ask our AI analyst anything about a company's financials, risks, or performance. Select a company and type your question.",
    title: "AI-Powered Analysis",
    placement: "top",
    page: "/dashboard/ai-analyst",
    skipBeacon: true,
  },
];
