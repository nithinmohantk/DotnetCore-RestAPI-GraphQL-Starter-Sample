import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import GuestList from './components/GuestList';
import RoomList from './components/RoomList';
import ReservationList from './components/ReservationList';
import Home from './components/Home';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div className="App">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/">Hotel Management</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/guests">Guests</Nav.Link>
                  <Nav.Link as={Link} to="/rooms">Rooms</Nav.Link>
                  <Nav.Link as={Link} to="/reservations">Reservations</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guests" element={<GuestList />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/reservations" element={<ReservationList />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
