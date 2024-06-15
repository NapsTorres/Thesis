import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsTrash } from 'react-icons/bs';
import CustomNavbar from './Navbar';

const Matchups = ({ handleLogout }) => {
  const [matchups, setMatchups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [eventID, setEventID] = useState('');
  const [numGames, setNumGames] = useState('');
  const [rank, setRank] = useState('');
  const [points, setPoints] = useState('');
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  useEffect(() => {
    fetchMatchups();
    fetchTeams();
    fetchEvents();
  }, []);

  const fetchMatchups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/matchups', { headers });
      setMatchups(response.data);
    } catch (error) {
      console.error('Error fetching matchups:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/teams', { headers });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/events', { headers });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteMatchup = async (matchupId) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      return result.isConfirmed;
    });

    if (isConfirm) {
      try {
        await axios.delete(`http://localhost:3001/api/matchups/${matchupId}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Matchup deleted successfully!',
        });
        fetchMatchups();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const createMatchups = async () => {
    if (!eventID || !numGames) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/generate_matchups', { EventID: eventID, NumGames: numGames }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchMatchups();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating matchups:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const createPointRegistration = async () => {
    if (!eventID || !rank || !points) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/point_reg', { EventID: eventID, rankingPoints: [{ rank: parseInt(rank), points: parseInt(points) }] }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      setShowPointModal(false);
    } catch (error) {
      console.error('Error registering ranking points:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEventID('');
    setNumGames('');
  };

  const openPointModal = () => {
    setShowPointModal(true);
  };

  const closePointModal = () => {
    setShowPointModal(false);
  };

 // Function to get team name by team ID
 const getTeamCode = (teamId) => {
  const team = teams.find(team => team.TeamID === teamId);
  return team ? team.TeamCode : '';
};

  return (
    <div className="match-container">
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className="team-button">
          <Button variant="success" onClick={() => setShowModal(true)} className="create-team-button">
            Create <br/> Match
          </Button>
          <Button variant="success" onClick={openPointModal} className="create-point-button">
            Point Registration
          </Button>
        </div>
        <Table className='event-table'>
          <thead>
            <tr>
              <th className="event-thead-item">Matchup ID</th>
              <th className="event-thead-item">Event</th>
              <th className="event-thead-item">Team 1</th>
              <th className="event-thead-item">Team 2</th>
              <th className="event-thead-item">NumGames</th>
              <th className="event-thead-item">Winner Team</th>
              <th className="event-thead-item">Action</th>
            </tr>
          </thead>
          <tbody>
            {matchups.length > 0 && matchups.map((matchup, key) => (
              <tr key={key}>
                <td className="event-td-user">{matchup.MatchupID}</td>
                <td className="event-td-user">{matchup.EventName}</td>
                <td className="event-td-user">{matchup.Team1Code}</td>
                <td className="event-td-user">{matchup.Team2Code}</td>
                <td className="event-td-user">{matchup.NumGames}</td>
                <td className="event-td-user">{getTeamCode(matchup.WinnerTeamID)}</td>
                <td className="event-td-user">
                  <Button variant="danger" onClick={() => deleteMatchup(matchup.MatchupID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Matchups</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="eventID" className="form-label">Event:</label>
              <select className="form-select" value={eventID} onChange={(e) => setEventID(e.target.value)}>
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.EventID} value={event.EventID}>{event.EventName}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="numGames" className="form-label">Number of Games:</label>
              <input type="number" className="form-control" id="numGames" value={numGames} onChange={(e) => setNumGames(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={createMatchups}>
              Generate
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showPointModal} onHide={closePointModal}>
          <Modal.Header closeButton>
            <Modal.Title>Point Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="eventID" className="form-label">Event:</label>
              <select className="form-select" value={eventID} onChange={(e) => setEventID(e.target.value)}>
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.EventID} value={event.EventID}>{event.EventName}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="rank" className="form-label">Rank:</label>
              <input type="number" className="form-control" id="rank" value={rank} onChange={(e) => setRank(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="points" className="form-label">Points:</label>
              <input type="number" className="form-control" id="points" value={points} onChange={(e) => setPoints(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={createPointRegistration}>
              save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Matchups;
