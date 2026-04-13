import Cookies from 'js-cookie';

const AUTH_COOKIE_NAME = 'auth_token';

function isSecureCookieEnv() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

/**
 * Reads JWT from httpOnly-style persistence: cookie first, then legacy localStorage.
 */
export function getAuthToken() {
  return Cookies.get(AUTH_COOKIE_NAME) || localStorage.getItem('token');
}

/**
 * Persists session in both cookie (7 days) and localStorage for existing code paths.
 */
export function setAuthToken(token) {
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: 7,
    secure: isSecureCookieEnv(),
    sameSite: 'Strict',
    path: '/',
  });
  localStorage.setItem('token', token);
  localStorage.setItem('isLoggedIn', 'true');
}

/**
 * Clears session cookie and local auth storage (does not remove `user` — callers may clear that).
 */
export function clearAuthToken() {
  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
}

/**
 * If the user has `auth_token` but lost localStorage (new tab/device copy), restore localStorage.
 * Call once before the React tree mounts (see index.js).
 */
export function syncAuthFromCookie() {
  const fromCookie = Cookies.get(AUTH_COOKIE_NAME);
  const fromLs = localStorage.getItem('token');
  if (fromCookie && !fromLs) {
    localStorage.setItem('token', fromCookie);
    localStorage.setItem('isLoggedIn', 'true');
  }
}
