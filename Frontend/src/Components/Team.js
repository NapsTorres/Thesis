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
import './team.css';

const Team = ({ handleLogout }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [show, setShow] = useState(false);
  const [TeamCode, setTeamCode] = useState('');
  const [TeamName, setTeamName] = useState('');
  const [EventID, setEventID] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedExistingTeam, setSelectedExistingTeam] = useState('');
  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  const handleClose = () => {
    setShow(false);
    resetTeamDetails();
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  const resetTeamDetails = () => {
    setTeamCode('');
    setTeamName('');
    setEventID('');
    setSelectedTeam(null);
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

  const createTeam = async (e) => {
    e.preventDefault();
    if (!TeamCode || !TeamName || !EventID) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      console.log("Creating team with data:", { TeamCode, TeamName, EventID });
      const response = await axios.post('http://localhost:3001/api/team_reg', { TeamCode, TeamName, EventID }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchTeams();
      handleClose(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating team:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const updateTeam = async (e) => {
    e.preventDefault();
    try {
      if (!selectedTeam) {
        console.error('No team selected for update');
        return;
      }
      const response = await axios.put(`http://localhost:3001/api/team/${selectedTeam.TeamID}`, { TeamCode, TeamName, EventID }, { headers });
      Swal.fire({
        icon: 'success',
        text: 'Team updated successfully!',
      });
      handleClose();
      fetchTeams();
      resetTeamDetails();
    } catch (error) {
      console.error('Error updating team:', error);
    }
    console.log("Team update request sent");
  };

  const deleteTeam = async (TeamID) => {
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
        await axios.delete(`http://localhost:3001/api/team/${TeamID}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Team deleted successfully!',
        });
        fetchTeams();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = (team) => {
    setSelectedTeam(team);
    setTeamCode(team.TeamCode);
    setTeamName(team.TeamName);
    setEventID(team.EventID);
    handleShow();
  };

  const handleExistingTeamSelect = (team) => {
    setSelectedExistingTeam(team);
    // Populate Team Code and Team Name fields with values from selected existing team
    setTeamCode(team.TeamCode);
    setTeamName(team.TeamName);
  };

  return (
    <div className="team-container">
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className='team-button'>
          <Button variant="success" className="create-team-button" onClick={handleShow}>
            Create <br/> Team
          </Button>
        </div>
        <Table className='event-table'>
          <thead>
            <tr>
            <th className="event-thead-item">Team ID</th>
            <th className="event-thead-item">Team Code</th>
            <th className="event-thead-item">Team Name</th>
            <th className="event-thead-item">Event Name</th>
            <th className="event-thead-item">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 && teams.map((team, key) => (
              <tr key={key}>
                <td className="event-td-user">{team.TeamID}</td>
                <td className="event-td-user">{team.TeamCode}</td>
                <td className="event-td-user">{team.TeamName}</td>
                <td className="event-td-user">{events.find(event => event.EventID === team.EventID)?.EventName}</td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleUpdate(team)}>
                    <BsPencil />
                  </Button>
                  <Button variant="danger" onClick={() => deleteTeam(team.TeamID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTeam ? 'Update Team' : 'Create Team'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={selectedTeam ? updateTeam : createTeam}>
              <Row>
                <Col>
                  <Form.Group controlId="TeamCode">
                    <Form.Label>Team Code</Form.Label>
                    <Form.Control type="text" value={TeamCode} onChange={(event) => { setTeamCode(event.target.value) }} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="TeamName">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" value={TeamName} onChange={(event) => { setTeamName(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="ExistingTeam">
                    <Form.Label>Existing Team</Form.Label>
                    <Form.Select value={selectedExistingTeam} onChange={(event) => handleExistingTeamSelect(JSON.parse(event.target.value))}>
                      <option value="">Select Existing Team</option>
                      {teams.map((team, key) => (
                        <option key={key} value={JSON.stringify(team)}>{team.TeamCode} - {team.TeamName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="EventID">
                    <Form.Label>Event</Form.Label>
                    <Form.Control as="select" value={EventID} onChange={(event) => { setEventID(event.target.value) }}>
                      <option value="">Select Event</option>
                      {events.map((event) => (
                        <option key={event.EventID} value={event.EventID}>
                          {event.EventName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <div className='role-button'>
                <Button variant="primary" type="submit">
                   Save
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Team;
