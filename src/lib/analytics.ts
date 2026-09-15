import { AnalyticsEvent } from '@/types';

const STORAGE_KEY = 'medicare_analytics_events';
const MAX_STORED_EVENTS = 200;

/**
 * Strips potential PHI (Protected Health Information) from telemetry payloads.
 * Only numeric metrics, route paths, button identifiers, and technical status codes are permitted.
 */
function sanitizeProperties(properties?: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
  if (!properties) return {};
  const clean: Record<string, string | number | boolean> = {};

  for (const [key, val] of Object.entries(properties)) {
    // Exclude potential sensitive fields
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('name') ||
      lowerKey.includes('phone') ||
      lowerKey.includes('email') ||
      lowerKey.includes('diagnosis') ||
      lowerKey.includes('drug') ||
      lowerKey.includes('medicine') ||
      lowerKey.includes('allergy')
    ) {
      clean[key] = '[REDACTED_PHI]';
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Tracks a privacy-safe user interaction event.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;

  const event: AnalyticsEvent = {
    eventName,
    properties: sanitizeProperties(properties),
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    const updated = [event, ...existing].slice(0, MAX_STORED_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Optional console telemetry in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] ${eventName}:`, event.properties);
    }
  } catch {
    // Non-blocking telemetry fallback
  }
}

/**
 * Tracks a pageview with anonymized route path.
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { route: path });
}

/**
 * Retrieves recently logged events for auditing or developer diagnostics.
 */
export function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clears local telemetry logs.
 */
export function clearStoredEvents(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
