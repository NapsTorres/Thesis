import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsPlus, BsTrash, BsPencil } from 'react-icons/bs';
import CustomNavbar from './Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Game.css';

const GameController = ({ handleLogout }) => {
  const [games, setGames] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [gameData, setGameData] = useState({
    MatchupID: '',
    GameNumber: '',
    GameDate: '',
    StartTime: '',
    EndTime: '',
    Status: '',
    Team1Score: '',
    Team2Score: '',
    Team1Outcome: '',
    Team2Outcome: ''
  });
  const [selectedEvent, setSelectedEvent] = useState('');

  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    resetGameData();
  };

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleShowUpdateModal = () => setShowUpdateModal(true);

  useEffect(() => {
    fetchGameData();
    fetchEvents();
    filterMatchups(selectedEvent);
  }, [selectedEvent]);

  const resetGameData = () => {
    setGameData({
      MatchupID: '',
      GameNumber: '',
      GameDate: '',
      StartTime: '',
      EndTime: '',
      Status: '',
      Team1Score: '',
      Team2Score: '',
      Team1Outcome: '',
      Team2Outcome: ''
    });
    setSelectedGame(null);
    setSelectedEvent('');
  };

  const fetchGameData = async () => {
    try {
      const [gamesResponse, matchupsResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/games', { headers }),
        axios.get('http://localhost:3001/api/matchups', { headers })
      ]);
      setGames(gamesResponse.data);
      setMatchups(matchupsResponse.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsResponse = await axios.get('http://localhost:3001/api/events', { headers });
      setEvents(eventsResponse.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const createGame = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating game with data:", gameData);
      const response = await axios.post('http://localhost:3001/api/create_game', gameData, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchGameData();
      handleClose();
    } catch (error) {
      console.error('Error creating game:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const updateGame = async (e) => {
    e.preventDefault();
    try {
      if (!selectedGame) {
        console.error('No game selected for update');
        return;
      }
      const response = await axios.put(`http://localhost:3001/api/game/${selectedGame.GameID}`, gameData, { headers });
      Swal.fire({
        icon: 'success',
        text: 'Game updated successfully!',
      });
      handleClose();
      fetchGameData();
      resetGameData();
    } catch (error) {
      console.error('Error updating game:', error);
    }
    console.log("Game update request sent");
  };

  const deleteGame = async (GameID) => {
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
        await axios.delete(`http://localhost:3001/api/game/${GameID}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Game deleted successfully!',
        });
        fetchGameData();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = (game) => {
    setSelectedGame(game);
    setGameData({
      MatchupID: game.MatchupID,
      GameNumber: game.GameNumber,
      GameDate: game.GameDate,
      StartTime: game.StartTime,
      EndTime: game.EndTime,
      Status: game.Status,
      Team1Score: game.Team1Score,
      Team2Score: game.Team2Score,
      Team1Outcome: game.Team1Outcome,
      Team2Outcome: game.Team2Outcome
    });
    handleShowUpdateModal();
  };

  const filterMatchups = (selectedEvent) => {
    if (selectedEvent) {
      // Filter matchups based on the selected event
      const filteredMatchups = matchups.filter(matchup => matchup.EventID === selectedEvent);
      setMatchups(filteredMatchups);
    } else {
      // If no event is selected, reset matchups to an empty array and selected matchup to null
      setMatchups([]);
      setGameData({ ...gameData, MatchupID: '' });
    }
  };
  
  
  

  return (
    <div className="game-container">
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className='game-button'>
          <Button variant="success" className="create-game-button" onClick={handleShowCreateModal}>
            Create <br/> Game
          </Button>
        </div>
        <Table className='game-table'>
          <thead>
            <tr>
              <th className="event-thead-item">Event Name</th>
              <th className="event-thead-item">Team 1 </th>
              <th className="event-thead-item">Team 2 </th>
              <th className="event-thead-item">Game Date</th>
              <th className="event-thead-item">Start Time</th>
              <th className="event-thead-item">End Time</th>
              <th className="event-thead-item">Status</th>
              <th className="event-thead-item">T1 Score</th>
              <th className="event-thead-item">T2 Score</th>
              <th className="event-thead-item">T1 Outcome</th>
              <th className="event-thead-item">T2 Outcome</th>
              <th className="event-thead-item">Action</th>
            </tr>
          </thead>
          <tbody>
            {games.length > 0 && games.map((game, key) => (
              <tr key={key}>
                  <td className="event-td-user">{game.EventName}</td>
                  <td className="event-td-user">{game.Team1Code}</td>
                  <td className="event-td-user">{game.Team2Code}</td>
                  <td className="event-td-user">{game.GameDate}</td>
                  <td className="event-td-user">{game.StartTime}</td>
                  <td className="event-td-user">{game.EndTime}</td>
                  <td className="event-td-user">{game.Status}</td>
                  <td className="event-td-user">{game.Team1Score}</td>
                  <td className="event-td-user">{game.Team2Score}</td>
                  <td className="event-td-user">{game.Team1Outcome}</td>
                  <td className="event-td-user">{game.Team2Outcome}</td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleUpdate(game)}>
                    <BsPencil />
                  </Button>
                  <Button variant="danger" onClick={() => deleteGame(game.GameID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={showCreateModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Game</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={createGame}>
              <Row>
                <Col>
                  <Form.Group controlId="EventID">
                    <Form.Label>Event</Form.Label>
                    <Form.Control as="select" value={selectedEvent} onChange={(event) => {
                      setSelectedEvent(event.target.value);
                      filterMatchups(event.target.value);
                    }}>
                      <option value="">Select Event</option>
                      {/* Map through events to create dropdown options */}
                      {events.map((event, index) => (
                        <option key={index} value={event.EventID}>{event.EventName}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="MatchupID">
                  <Form.Label>Matchup</Form.Label>
                  <Form.Control as="select" value={gameData.MatchupID} onChange={(event) => setGameData({ ...gameData, MatchupID: event.target.value })}>
                    {selectedEvent ? (
                      <>
                        <option value="">Select Matchup</option>
                        {/* Map through matchups to create dropdown options */}
                        {matchups.map((matchup, index) => (
                          <option key={index} value={matchup.MatchupID}>{matchup.Team1Code} vs {matchup.Team2Code}</option>
                        ))}
                      </>
                    ) : (
                      <option value="">Select Event first</option>
                    )}
                  </Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="GameNumber">
                    <Form.Label>Game Number</Form.Label>
                    <Form.Control type="text" value={gameData.GameNumber} onChange={(event) => setGameData({ ...gameData, GameNumber: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="GameDate">
                    <Form.Label>Game Date</Form.Label>
                    <Form.Control type="date" value={gameData.GameDate} onChange={(event) => setGameData({ ...gameData, GameDate: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="StartTime">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="time" value={gameData.StartTime} onChange={(event) => setGameData({ ...gameData, StartTime: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="EndTime">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="time" value={gameData.EndTime} onChange={(event) => setGameData({ ...gameData, EndTime: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="Status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" value={gameData.Status} onChange={(event) => setGameData({ ...gameData, Status: event.target.value })}>
                      <option value="">Select Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Ongoing</option>
                      <option value="2">Ended</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Col className="text-pt-3 text-end"> {/* This class aligns content to the right */}
                <Button variant="primary" type="submit" className="mt-3">
                  Save
                </Button>
              </Col>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showUpdateModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Game</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={updateGame}>
              <Row>
                <Col>
                  <Form.Group controlId="GameDate">
                    <Form.Label>Game Date</Form.Label>
                    <Form.Control type="date" value={gameData.GameDate} onChange={(event) => setGameData({ ...gameData, GameDate: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="StartTime">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="time" value={gameData.StartTime} onChange={(event) => setGameData({ ...gameData, StartTime: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="EndTime">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="time" value={gameData.EndTime} onChange={(event) => setGameData({ ...gameData, EndTime: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="Status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" value={gameData.Status} onChange={(event) => setGameData({ ...gameData, Status: event.target.value })}>
                      <option value="">Select Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Ongoing</option>
                      <option value="2">Ended</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="Team1Score">
                    <Form.Label>T1 Score</Form.Label>
                    <Form.Control type="text" value={gameData.Team1Score} onChange={(event) => setGameData({ ...gameData, Team1Score: event.target.value })} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="Team2Score">
                    <Form.Label>T2 Score</Form.Label>
                    <Form.Control type="text" value={gameData.Team2Score} onChange={(event) => setGameData({ ...gameData, Team2Score: event.target.value })} />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="mt-2" style={{ float: 'right' }}> {/* Added inline style for right alignment */}
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default GameController;
