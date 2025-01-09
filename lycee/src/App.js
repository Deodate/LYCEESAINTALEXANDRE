import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home/Home';
import About from './Components/pages/About/About';
import Babyeyi from './Components/pages/Babyeyi/Babyeyi';
import Contacts from './Components/pages/Contacts/Contacts';
import Footer from './Components/pages/Footer/Footer';
import Top from './Components/pages/Top/Top';
import Menu from './Components/pages/Menu/Menu';
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
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/admissions" element={<Home />} />
        <Route path="/academics/*" element={<Home />} />
        <Route path="/research" element={<Home />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/students/*" element={<Home />} />
        <Route path="/athletics" element={<Home />} />
      </Routes>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}

export default App;