import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import "./round.css";
import { Box, Tabs, Tab } from '@chakra-ui/react';
import { TabList } from '@chakra-ui/react';
import CustomNavbar from './Navbar';
import axios from 'axios';

export default function MatchHistory({ handleLogout }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token')).data.token;
            const headers = {
                'accept': 'application/json',
                'Authorization': token
            };
            const response = await axios.get('http://localhost:3001/api/games', { headers });
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    return (
        <>
            <CustomNavbar handleLogout={handleLogout} />
<div className='container-index'>
    <Container fluid>
        <Row>
            <Col>
                {/* Removed the surrounding div with className 'dashboard-card' */}
                <div className="background-with-image">
                    {/* Set the background image */}
                    <img className='sports-icon' src={require("../Assets/basketball.png")} alt="Sport1" />
                    {/* Positioned the heading */}
                    <h1 className="basketball-heading">CHESS BRACKET</h1>
                </div>

                <Container fluid="md" className='match-container'>
                    {games.map((game, index) => (
                        <div key={index}>
                            <Row className='date-row'>
                                <Col className='date-col'>
                                    {game.GameDate}, {game.StartTime} - {game.EndTime}
                                </Col>
                            </Row>
                            <Row className='match-row'>
                                <Col xs={5}>
                                    <Box className='team-box'>
                                        <h6><span>{game.Team1Code}</span><span>{game.Team1Score}</span></h6>
                                    </Box>
                                </Col>
                                <Col xs={2} className='vs-col'>VS</Col>
                                <Col xs={5}>
                                    <Box className='team-box'>
                                        <h6><span>{game.Team2Score}</span><span>{game.Team2Code}</span></h6>
                                    </Box>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </Container>
            </Col>
        </Row>
    </Container>
</div>

        </>
    );
}
