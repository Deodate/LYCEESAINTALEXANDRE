import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dispatchCookieConsentUpdated } from '../utils/cookieConsentState';
import { clearOptionalPreferenceCookies } from '../utils/preferenceCookies';
import { initializeAnalytics } from '../analytics/ga4';

const STORAGE_KEY = 'cookie_consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [preferenceCookies, setPreferenceCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(localStorage.getItem('cookie_analytics') === 'true');
      setPreferenceCookies(localStorage.getItem('cookie_preferences') === 'true');
    }
  }, [settingsOpen]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = '';
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const close = () => {
    setSettingsOpen(false);
    setVisible(false);
  };

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    localStorage.setItem('cookie_analytics', 'true');
    localStorage.setItem('cookie_preferences', 'true');
    close();
    initializeAnalytics();
    dispatchCookieConsentUpdated();
  };

  const handleReject = () => {
    clearOptionalPreferenceCookies();
    localStorage.setItem(STORAGE_KEY, 'rejected');
    localStorage.setItem('cookie_analytics', 'false');
    localStorage.setItem('cookie_preferences', 'false');
    close();
    dispatchCookieConsentUpdated();
  };

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY, 'custom');
    localStorage.setItem('cookie_analytics', analytics ? 'true' : 'false');
    localStorage.setItem('cookie_preferences', preferenceCookies ? 'true' : 'false');
    if (!preferenceCookies) {
      clearOptionalPreferenceCookies();
    }
    close();
    if (analytics) {
      initializeAnalytics();
    }
    dispatchCookieConsentUpdated();
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  const handleOverlayClick = () => {
    if (settingsOpen) {
      setSettingsOpen(false);
      return;
    }
    handleReject();
  };

  const handleCloseClick = () => {
    if (settingsOpen) {
      setSettingsOpen(false);
      return;
    }
    handleReject();
  };

  if (!visible) {
    return null;
  }

  const titleId = settingsOpen ? 'cookie-settings-title' : 'cookie-consent-title';

  return (
    <>
      <div
        className="cookie-overlay"
        role="presentation"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />
      <div
        className="cookie-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="cookie-close"
          onClick={handleCloseClick}
          aria-label={settingsOpen ? 'Back to cookie summary' : 'Close cookie notice'}
        >
          ×
        </button>

        {!settingsOpen ? (
          <>
            <h3 id="cookie-consent-title" className="cookie-title">
              Privacy at LSASM
            </h3>
            <p className="cookie-text">
              We use cookies to improve our site and personalize your experience. By continuing to use
              this site, you agree to our use of cookies.{' '}
              <Link to="/privacy" className="cookie-text-link">
                Learn more about our privacy policy
              </Link>
              .
            </p>
            <div className="cookie-buttons">
              <button type="button" className="cookie-btn-settings" onClick={openSettings}>
                Cookie Settings
              </button>
              <button type="button" className="cookie-btn-reject" onClick={handleReject}>
                Reject All
              </button>
              <button type="button" className="cookie-btn-accept" onClick={handleAccept}>
                Accept
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 id="cookie-settings-title" className="cookie-title">
              Cookie preferences
            </h3>
            <p className="cookie-settings-intro">
              Choose which optional cookies we may use. Essential cookies (including login session)
              are required for the site to work and cannot be turned off here.
            </p>

            <ul className="cookie-pref-list" role="list">
              <li className="cookie-pref-row cookie-pref-row-locked">
                <span className="cookie-pref-label">Essential cookies</span>
                <span className="cookie-pref-always">Always on</span>
              </li>
              <li className="cookie-pref-row">
                <span className="cookie-pref-label" id="cookie-pref-analytics-label">
                  Analytics cookies
                </span>
                <button
                  type="button"
                  className={`cookie-switch ${analytics ? 'cookie-switch-on' : ''}`}
                  role="switch"
                  aria-checked={analytics}
                  aria-labelledby="cookie-pref-analytics-label"
                  onClick={() => setAnalytics((v) => !v)}
                >
                  <span className="cookie-switch-thumb" aria-hidden="true" />
                </button>
              </li>
              <li className="cookie-pref-row">
                <div className="cookie-pref-label-block">
                  <span className="cookie-pref-label" id="cookie-pref-preference-label">
                    Preference cookies
                  </span>
                  <span className="cookie-pref-sublabel" id="cookie-pref-preference-hint">
                    Language and display settings
                  </span>
                </div>
                <button
                  type="button"
                  className={`cookie-switch ${preferenceCookies ? 'cookie-switch-on' : ''}`}
                  role="switch"
                  aria-checked={preferenceCookies}
                  aria-labelledby="cookie-pref-preference-label"
                  aria-describedby="cookie-pref-preference-hint"
                  onClick={() => setPreferenceCookies((v) => !v)}
                >
                  <span className="cookie-switch-thumb" aria-hidden="true" />
                </button>
              </li>
            </ul>

            <div className="cookie-buttons cookie-settings-actions">
              <button type="button" className="cookie-btn-back" onClick={() => setSettingsOpen(false)}>
                ← Back
              </button>
              <button type="button" className="cookie-btn-accept" onClick={handleSaveSettings}>
                Save Settings
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CookieConsent;
