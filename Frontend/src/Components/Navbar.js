import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import './navBarStyle.css';
import UserDropdown from './UserDropdown';
import { Dropdown } from 'react-bootstrap';

const CustomNavbar = ({ user }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Retrieve username from session storage

  /* Logout Method */
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
      // Provide appropriate feedback to the user
    }
  };

  return (
    <Navbar className="seemsNavBar">
      <Container>
        <div>
          <img src={require('../Assets/Image/new-sems.png')} className="seems-logo"/>
        </div>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/User" className="text-decoration-none text-white">
            Users
          </Nav.Link>
          <Nav.Link as={Link} to="/Event" className="text-decoration-none text-white">
            Events
          </Nav.Link>
          <Nav.Link as={Link} to="/Team" className="text-decoration-none text-white">
            Teams
            </Nav.Link>
          <Nav.Link as={Link} to="/Matchup" className="text-decoration-none text-white">
            Matches
            </Nav.Link>
          <Nav.Link as={Link} to="/Games" className= "text-decoration-none text-white">
            Games
            </Nav.Link>
            <Nav.Link as={Link} to="/Ranking" className= "text-decoration-none text-white">
            Ranking
            </Nav.Link>
            <Nav.Link as={Link} to="/Round" className= "text-decoration-none text-white">
            Round Robin Bracket
            </Nav.Link>
            <Nav.Link as={Link} to="/Single" className= "text-decoration-none text-white">
            Single Elimination Bracket
            </Nav.Link>
            <Nav.Link as={Link} to="/Double" className= "text-decoration-none text-white">
            Double Elimination Bracket
            </Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {username}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
