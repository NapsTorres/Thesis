const express = require('express');
const { db } = require('../db');
const { authenticateToken } = require('../auth');

const MatchupController = express.Router();

function generateRoundRobin(teamIDs) {
    const matchups = [];
    const numTeams = teamIDs.length;

    for (let i = 0; i < numTeams - 1; i++) {
        for (let j = i + 1; j < numTeams; j++) {
            if (teamIDs[i] !== teamIDs[j]) {
                matchups.push({ team1: teamIDs[i], team2: teamIDs[j], winner: null });
            }
        }
    }

    return matchups;
}

MatchupController.get('/roundrobin', authenticateToken, async (req, res) => {
    try {
        const [teams] = await db.promise().query('SELECT TeamID FROM Teams');

        if (teams.length < 2) {
            return res.status(400).json({ message: 'Not enough teams to generate match-ups' });
        }

        const teamIDs = teams.map(team => team.TeamID);
        const roundRobinMatchups = generateRoundRobin(teamIDs);

        res.status(200).json(roundRobinMatchups);
    } catch (error) {
        console.error('Error generating round robin matchups:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = { MatchupController };
