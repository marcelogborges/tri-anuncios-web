"use client";

import { createContext, useContext } from "react";

export type LeadSubmission = {
  fields: Record<string, string>;
};

export type LandingPageRuntime = {
  /**
   * Submits a lead. Public pages POST to the API and fire the Meta Pixel;
   * the editor preview only simulates.
   */
  submitLead: (lead: LeadSubmission) => Promise<void>;
};

const editorRuntime: LandingPageRuntime = {
  submitLead: async () => {
    // editor/preview mode: nothing is persisted
  },
};

const LandingPageRuntimeContext = createContext<LandingPageRuntime>(editorRuntime);

export const LandingPageRuntimeProvider = LandingPageRuntimeContext.Provider;

export function useLandingPageRuntime() {
  return useContext(LandingPageRuntimeContext);
}
