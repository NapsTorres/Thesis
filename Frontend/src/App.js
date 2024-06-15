import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import Nav from 'react-bootstrap/Nav';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import User from './Components/User';
import Event from './Components/Event';
import Team from './Components/Team';
import Matchup from './Components/Matchup';
import Games from './Components/Games';
import Ranking from './Components/Ranking'
import Round from './Components/RoundRobinBracket'
import Single from './Components/single'
import Double from './Components/double'
import Try from './Components/doubleindex'
// import SignUp from './Components/signup';

const App = () => {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<User />} />
              <Route path="/event" element={<Event />} />
              <Route path="/team" element={<Team />} />
              <Route path="/matchup" element={<Matchup />} />
              <Route path="/games" element={<Games />} />
              {/* <Route path="/signup" component={<SignUp/>} /> */}
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/round" element={<Round />} /> 
              <Route path="/single" element={<Single />} /> 
              <Route path="/double" element={<Double />} />
              <Route path="/try" element={<Try />} />
            </Routes>
    </Router>
  );
};

export default App;
