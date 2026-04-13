import ReactGA from 'react-ga4';
import { isAnalyticsAllowed } from '../utils/cookieConsentState';

let initialized = false;

function measurementId() {
  return process.env.REACT_APP_GA_MEASUREMENT_ID || '';
}

/**
 * Loads GA4 only when a measurement ID is configured and the user consented to analytics.
 */
export function initializeAnalytics() {
  const id = measurementId();
  if (!id || !isAnalyticsAllowed()) {
    return;
  }
  if (initialized) {
    return;
  }
  try {
    ReactGA.initialize(id);
    initialized = true;
  } catch (e) {
    console.warn('GA4 initialize failed:', e);
  }
}

export function trackPageView(path) {
  if (!isAnalyticsAllowed() || !initialized || !measurementId()) {
    return;
  }
  const page = path || window.location.pathname + window.location.search;
  ReactGA.send({ hitType: 'pageview', page });
}
