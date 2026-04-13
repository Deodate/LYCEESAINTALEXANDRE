import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => (
  <div className="privacy-page">
    <h1 className="privacy-page-title">Privacy Policy - Lycee Saint Alexandre Sauli de Muhura</h1>

    <section className="privacy-section">
      <h2 className="privacy-section-title">What data we collect</h2>
      <p>
        When you use our website, we may collect information you choose to share with us, such as your
        name and email address when you contact us or sign in to restricted areas. We also collect
        technical information that browsers typically send automatically, including your IP address,
        browser type, and the pages you visit, so we can keep the site secure and understand how it is
        used.
      </p>
    </section>

    <section className="privacy-section">
      <h2 className="privacy-section-title">How we use cookies</h2>
      <p>
        Cookies are small files stored on your device. We use essential cookies so the site works
        correctly—for example, to remember your cookie choices and to keep your login session (stored as
        an <code>auth_token</code> cookie alongside secure storage) when you use the dashboard. If you
        allow analytics, we may load Google Analytics (GA4) to understand aggregate traffic. If you
        allow preference cookies, we may store choices such as language in separate cookies. Your
        consent is recorded in the browser (for example <code>cookie_consent</code>,{' '}
        <code>cookie_analytics</code>, and <code>cookie_preferences</code>). You can change these
        choices by clearing site data for this domain and visiting again; the cookie banner will
        reappear.
      </p>
    </section>

    <section className="privacy-section">
      <h2 className="privacy-section-title">Contact information</h2>
      <p>
        If you have questions about this privacy policy or how we handle your information, please
        contact the school administration:
      </p>
      <ul className="privacy-contact-list">
        <li>
          <strong>Lycée Saint Alexandre Sauli de Muhura</strong>
        </li>
        <li>Muhura, Rwanda</li>
        <li>
          For the current email and telephone number, please use the{' '}
          <Link to="/contacts" className="privacy-link">
            Contacts
          </Link>{' '}
          page or ask the school office directly.
        </li>
      </ul>
    </section>

    <p className="privacy-back-wrap">
      <Link to="/" className="privacy-back-btn">
        ← Back to home
      </Link>
    </p>
  </div>
);

export default Privacy;
