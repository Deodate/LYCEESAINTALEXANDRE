import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/pages/Home/Home';
import About from './Components/pages/About/About';
import Contacts from './Components/pages/Contacts/Contacts';
import Footer from './Components/pages/Footer/Footer';
import Top from './Components/pages/Top/Top';
import NavigationMenu from './Components/pages/Menu/Menu';
import MobileBottomNav from './Components/pages/MobileBottomNav/MobileBottomNav';
import Babyeyi from './Components/pages/Babyeyi/Babyeyi';
import DioceseByumba from './Components/pages/DioceseByumba/DioceseByumba';
import VisionValues from './Components/pages/VisionValues/VisionValues';
import ChatAssistant from './Components/pages/Chatbot/ChatbotInterface';
import Inspiration from './Components/pages/Inspiration/Inspiration';
import HomepageContainer from './Components/pages/HomepageContainer/HomepageContainer';
import NewsEvents from './Components/pages/NewsEvents/NewsEvents';
import Signin from './Authentication/signin';
import DashboardLayout from './Components/pages/Dashboard/DashboardLayout';
import TailwindTest from './TailwindTest';
import ProtectedRoute from './Components/auth/ProtectedRoute';
import { NotificationProvider } from './context/NotificationContext';
import CookieConsent from './Components/CookieConsent';
import Privacy from './Components/pages/Privacy/Privacy';
import { useCookieInit } from './hooks/useCookieInit';

const DOCUMENT_TITLE_SUFFIX = ' - Lycée Saint Alexandre Muhura';

function documentTitleForPath(pathname) {
  const path = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  const exact = {
    '/': 'Home',
    '/about': 'About',
    '/VisionValues': 'Vision & Values',
    '/Inspiration': 'Inspiration',
    '/DioceseByumba': 'Diocese Byumba',
    '/contacts': 'Contacts',
    '/privacy': 'Privacy',
    '/babyeyi': 'Babyeyi',
    '/newsEvents': 'News & Events',
    '/signin': 'Sign in',
    '/tailwind-test': 'Tailwind Test',
    '/arts': 'Arts',
    '/athletics': 'Athletics',
  };

  if (exact[path]) {
    return `${exact[path]}${DOCUMENT_TITLE_SUFFIX}`;
  }
  if (path.startsWith('/dashboard')) {
    return `Dashboard${DOCUMENT_TITLE_SUFFIX}`;
  }
  if (path.startsWith('/academics')) {
    return `Academics${DOCUMENT_TITLE_SUFFIX}`;
  }
  if (path.startsWith('/students')) {
    return `Student Life${DOCUMENT_TITLE_SUFFIX}`;
  }
  return `Home${DOCUMENT_TITLE_SUFFIX}`;
}

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  useCookieInit();

  useEffect(() => {
    document.title = documentTitleForPath(location.pathname);
  }, [location.pathname]);

  return (
    <NotificationProvider>
      <div className="App">
      {!isDashboard && (
        <>
          {/* Top Navigation Start */}
          <Top />
          {/* Main Navigation */}
          <NavigationMenu />
        </>
      )}

      {/* Main Content Area */}
      <div className="main-content-area">
      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <>
            <HomepageContainer />
            <Home />
          </>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/VisionValues" element={<VisionValues />} />
        <Route path="/Inspiration" element={<Inspiration />} />
        <Route path="/DioceseByumba" element={<DioceseByumba />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/babyeyi" element={<Babyeyi />} />
        <Route path="/academics/*" element={<Home />} />
        <Route path="/newsEvents" element={<NewsEvents />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/students/*" element={<Home />} />
        <Route path="/athletics" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/tailwind-test" element={<TailwindTest />} />

      </Routes>

      {!isDashboard && (
        <>
          <ChatAssistant />
          {/* Footer Navigation */}
          <Footer />
        </>
      )}
      </div>
      {!isDashboard && <MobileBottomNav />}
      <CookieConsent />
    </div>
    </NotificationProvider>
  );
}

export default App;