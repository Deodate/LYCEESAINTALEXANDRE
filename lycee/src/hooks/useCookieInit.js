import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncAuthFromCookie } from '../utils/authSession';
import { COOKIE_CONSENT_UPDATED_EVENT, isAnalyticsAllowed } from '../utils/cookieConsentState';
import { initializeAnalytics, trackPageView } from '../analytics/ga4';
import { applyUserLanguageFromCookies } from '../utils/preferenceCookies';

/**
 * Runs on every client-side navigation (and when consent changes):
 * - Restores JWT from `auth_token` cookie into localStorage when needed
 * - Applies language / preference cookies when allowed
 * - Initializes GA4 once, then sends a pageview when analytics is allowed
 *
 * Cookie banner visibility is handled by `<CookieConsent />` (checks `cookie_consent`).
 */
function applyCookieAndTrackingForPath(pathWithSearch) {
  syncAuthFromCookie();
  applyUserLanguageFromCookies();
  initializeAnalytics();
  if (isAnalyticsAllowed()) {
    trackPageView(pathWithSearch);
  }
}

export function useCookieInit() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    applyCookieAndTrackingForPath(path);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onConsentUpdated = () => {
      applyCookieAndTrackingForPath(
        `${window.location.pathname}${window.location.search}`
      );
    };
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);
    return () => window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);
  }, []);
}
