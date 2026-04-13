/**
 * Cookie consent flags (localStorage).
 * - cookie_consent: 'accepted' | 'rejected' | 'custom'
 * - cookie_analytics: 'true' | 'false'
 * - cookie_preferences: 'true' | 'false' (preference / non-essential convenience cookies)
 */

export const COOKIE_CONSENT_UPDATED_EVENT = 'lsasm-cookie-consent-updated';

export function dispatchCookieConsentUpdated() {
  window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));
}

export function isAnalyticsAllowed() {
  const consent = localStorage.getItem('cookie_consent');
  const analytics = localStorage.getItem('cookie_analytics');
  return consent === 'accepted' || analytics === 'true';
}

export function isPreferenceCookiesAllowed() {
  const consent = localStorage.getItem('cookie_consent');
  const prefs = localStorage.getItem('cookie_preferences');
  return consent === 'accepted' || prefs === 'true';
}

/**
 * Older builds stored JSON at `cookie_preferences`. Migrate once to string flags.
 */
export function migrateLegacyCookieStorage() {
  const raw = localStorage.getItem('cookie_preferences');
  if (!raw || !raw.trim().startsWith('{')) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const analyticsOn = Boolean(parsed.analytics);
    const prefOn = Boolean(parsed.marketing);
    localStorage.removeItem('cookie_preferences');
    if (!localStorage.getItem('cookie_analytics')) {
      localStorage.setItem('cookie_analytics', analyticsOn ? 'true' : 'false');
    }
    localStorage.setItem('cookie_preferences', prefOn ? 'true' : 'false');
  } catch {
    localStorage.removeItem('cookie_preferences');
    localStorage.setItem('cookie_analytics', 'false');
    localStorage.setItem('cookie_preferences', 'false');
  }
}
