/**
 * Meta Pixel helpers for published landing pages.
 *
 * Browser fires the Pixel event and the backend fires the same event via
 * Conversions API with an identical event_id — Meta dedupes by
 * (event_name, event_id) within 48h.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/** Injects the Meta Pixel base code and fires PageView. Idempotent per page. */
export function initMetaPixel(pixelId: string) {
  if (window.fbq) {
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return;
  }

  const fbq: {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    push: unknown;
    loaded: boolean;
    version: string;
  } = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

/** Fires the browser-side Lead event with the dedup eventID. */
export function trackLead(eventId: string) {
  window.fbq?.("track", "Lead", {}, { eventID: eventId });
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `lead.${crypto.randomUUID()}`;
  }
  return `lead.${Math.random().toString(36).slice(2)}${Date.now()}`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Returns Meta browser identifiers for CAPI matching.
 * If the _fbc cookie is missing but the URL carries ?fbclid=, builds the
 * fbc value manually: fb.1.{timestamp_ms}.{fbclid} (per Meta docs).
 */
export function collectMetaBrowserData(): { fbp: string | null; fbc: string | null } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc) {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp, fbc };
}

/** UTM + click-id params worth persisting with the lead for attribution. */
export function collectTrackingParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const tracked: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"]) {
    const value = params.get(key);
    if (value) tracked[key] = value;
  }
  return tracked;
}
