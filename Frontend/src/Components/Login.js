import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import './loginstyle.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light'); // Theme state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'))
        setUser(response.data);
        navigate("/dashboard");
      } catch (err) {
        navigate("/login")
      }
    };
    fetchUser();
  }, [navigate]);

  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem("token") || '');

  const handleLogin = async (e) => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        Username,
        Password,
      });

      localStorage.setItem("token", JSON.stringify(response));
      localStorage.setItem("username", Username); // Store username in session storage
      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed", error);
      // Provide appropriate feedback to the user
    }
  };

  // Function to toggle light/dark mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode');
  };

  return (
    <Container fluid className={`login-login ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
  <Row className="login-container">
    <Col md={6} xs={12} className="d-flex justify-content-center align-items-center">
      <div className={`login-box p-4 rounded shadow-lg ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
        <h1 className={`text-center mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>SEMS</h1>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="mb-1">Username*</Form.Label>
            <Form.Control type="username" placeholder="Enter Username" className="mb-3" value={Username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label className="mb-1">Password *</Form.Label>
            <Form.Control type="password" placeholder="Password" className="mb-3" value={Password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" className="mb-2" />
            <a href="#" className="text-center d-block">Forgot password?</a>
          </Form.Group>
          <Button variant="primary" className="w-100 mb-3" onClick={handleLogin}>
            Sign in
          </Button>
        </Form>
        <div className="text-center">
        Don't have an account? <Link to="/SignUp">Sign Up</Link>
        </div>
      </div>

    </Col>
  </Row>
  {/* Toggle button for light/dark mode */}
  <Button variant="secondary" className={`position-absolute top-0 start-0 m-3 ${theme === 'light' ? 'bg-white text-dark' : 'bg-dark text-light'}`} onClick={toggleTheme}>
    {theme === 'light' ? <FaMoon color="dark" /> : <FaSun color="white" />}
  </Button>
</Container>
  );
};

export default Login;
