import Cookies from 'js-cookie';
import { isPreferenceCookiesAllowed } from './cookieConsentState';

const USER_LANGUAGE = 'user_language';

function prefCookieBaseOptions() {
  return {
    expires: 365,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
  };
}

/** Cookie names we set for optional preferences (used to clear on reject). */
const KNOWN_PREFERENCE_COOKIE_NAMES = [USER_LANGUAGE];

export function getUserLanguage() {
  if (!isPreferenceCookiesAllowed()) {
    return null;
  }
  return Cookies.get(USER_LANGUAGE) || null;
}

export function setUserLanguage(lang) {
  if (!isPreferenceCookiesAllowed() || !lang) {
    return;
  }
  Cookies.set(USER_LANGUAGE, String(lang), prefCookieBaseOptions());
}

/**
 * Generic optional preference cookie (pref_*), only when user allowed preference cookies.
 */
export function setPreferenceCookie(key, value) {
  if (!isPreferenceCookiesAllowed() || !key) {
    return;
  }
  const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeKey) {
    return;
  }
  Cookies.set(`pref_${safeKey}`, String(value), prefCookieBaseOptions());
}

export function getPreferenceCookie(key) {
  if (!isPreferenceCookiesAllowed() || !key) {
    return undefined;
  }
  const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeKey) {
    return undefined;
  }
  return Cookies.get(`pref_${safeKey}`);
}

export function clearOptionalPreferenceCookies() {
  KNOWN_PREFERENCE_COOKIE_NAMES.forEach((name) => {
    Cookies.remove(name, { path: '/' });
  });
}

/**
 * Applies stored language to the document (html lang). Safe to call on every load.
 */
export function applyUserLanguageFromCookies() {
  const lang = getUserLanguage();
  if (lang) {
    document.documentElement.lang = lang;
  }
}
