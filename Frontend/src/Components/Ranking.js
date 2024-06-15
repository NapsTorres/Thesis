import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import CustomNavbar from './Navbar';

const storedToken = localStorage.getItem('token');
const token = storedToken ? JSON.parse(storedToken).data.token : null;

const headers = {
  'accept': 'application/json',
  'Authorization': token
};

const LeaderboardController = ({ handleLogout }) => {
  const [leaderboards, setLeaderboards] = useState([]);

  useEffect(() => {
    if (token) {
      fetchLeaderboards();
    }
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/EventLeaderboards', { headers });
      setLeaderboards(response.data);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      // Handle error if needed
    }
  };

  return (
    <div className="leaderboard-container">
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <Table className='game-table'>
          <thead>
            <tr>
            <th className="event-thead-item">Event Leaderboard ID</th>
            <th className="event-thead-item">Event Name</th>
            <th className="event-thead-item">Team Code</th>
            <th className="event-thead-item">Ranking</th>
            <th className="event-thead-item">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboards.map((leaderboard) => (
              <tr key={leaderboard.EventLeaderboardID}>
                <td className="event-td-user">{leaderboard.EventLeaderboardID}</td>
                <td className="event-td-user">{leaderboard.EventName}</td>
                <td className="event-td-user">{leaderboard.TeamCode}</td>
                <td className="event-td-user">{leaderboard.Ranking}</td>
                <td className="event-td-user">{leaderboard.Points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LeaderboardController;
