import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Babyeyi from './pages/Babyeyi/Babyeyi';
import Contacts from './pages/Contacts/Contacts';

function App() {
  return (
    <div>
      {/* Top Navigation */}
      <div className="top-nav">
        <Container className="d-flex justify-content-between align-items-center">
          <div>
            <Link to="/apply">Muhura Paroisse</Link>
            <Link to="/visit">Gatsibo</Link>
            <Link to="/request-info">Santa Antonio Maria Zakaria</Link>
          </div>
          <div>
            <Link to="/explore">Barinabite Fathers</Link>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Navbar expand="lg" bg="white" className="py-0 position-relative">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="Logo"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown 
                title="About" 
                id="about-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/about/our-school">Our School</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/about/history">History</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/admissions">Admissions</Nav.Link>
              <NavDropdown 
                title="Academics" 
                id="academics-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/academics/programs">Programs</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/academics/faculty">Faculty</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/research">Research</Nav.Link>
              <Nav.Link as={Link} to="/arts">Art</Nav.Link>
              <NavDropdown 
                title="Students" 
                id="students-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item as={Link} to="/students/life">Student Life</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/students/resources">Resources</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/athletics">Athletics</Nav.Link>
              <Nav.Link as={Link} to="/search" className="search-link">
                <i className="bi bi-search"></i>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/babyeyi" element={<Babyeyi />} />
        <Route path="/about/*" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/admissions" element={<Home />} />
        <Route path="/academics/*" element={<Home />} />
        <Route path="/research" element={<Home />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/students/*" element={<Home />} />
        <Route path="/athletics" element={<Home />} />
      </Routes>

      <footer>
        <div className='container my-5'>
          <div className='row d-flex justify-content-between align-items-center'>
            <div className='col-md-4'>
              <Link to="/">
              
              </Link>

              <ul>

              </ul>
            </div>
   
          </div>

        </div>
      </footer>


    </div>
  );
}

export default App;