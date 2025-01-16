import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home/Home';
import About from './Components/pages/About/About';
import Contacts from './Components/pages/Contacts/Contacts';
import Footer from './Components/pages/Footer/Footer';
import Top from './Components/pages/Top/Top';
import Menu from './Components/pages/Menu/Menu';
import Babyeyi from './Components/pages/Babyeyi/Babyeyi';
import DioceseByumba from './Components/pages/DioceseByumba/DioceseByumba';
import VisionValues from './Components/pages/VisionValues/VisionValues';
import ChatAssistant from './Components/pages/Chatbot/ChatbotInterface';
import Inspiration from './Components/pages/Inspiration/Inspiration';
import HomepageContainer from './Components/pages/HomepageContainer/HomepageContainer';
import NewsEvents from './Components/pages/NewsEvents/NewsEvents';

function App() {
  return (
    <div className="App">
      {/* Top Navigation Start */}
      <Top />

      {/* Main Navigation */}
      <Menu />

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
        <Route path="/Babyeyi" element={<Babyeyi />} />
        <Route path="/academics/*" element={<Home />} />
        <Route path="/newsEvents" element={<NewsEvents />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/students/*" element={<Home />} />
        <Route path="/athletics" element={<Home />} />
      </Routes>

      <ChatAssistant />
      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}

export default App;