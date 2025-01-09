import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home/Home';
import About from './Components/pages/About/About';
import Babyeyi from './Components/pages/Babyeyi/Babyeyi';
import Contacts from './Components/pages/Contacts/Contacts';
import Footer from './Components/pages/Footer/Footer';
import Top from './Components/pages/Top/Top';
import Menu from './Components/pages/Menu/Menu';
import VisionValues from './Components/pages/VisionValues/VisionValues';
import ChatAssistant from './Components/pages/Chatbot/ChatbotInterface';
import Inspiration from './Components/pages/Inspiration/Inspiration';
import HomepageContainer from './Components/pages/HomepageContainer/HomepageContainer';

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
        <Route path="/babyeyi" element={<Babyeyi />} />
        <Route path="/about" element={<About />} />
        <Route path="/VisionValues" element={<VisionValues />} />
        <Route path="/Inspiration" element={<Inspiration />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/admissions" element={<Home />} />
        <Route path="/academics/*" element={<Home />} />
        <Route path="/research" element={<Home />} />
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