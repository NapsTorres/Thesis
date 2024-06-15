import React, { useState } from 'react';
import { Bracket } from 'react-brackets';
import CustomNavbar from './Navbar';

const initialRounds = [
  {
    title: 'Round one',
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: 'CAS', winner: null }, { name: 'CCS', winner: null }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: 'COE', winner: null }, { name: 'CTED', winner: null }],
      },
      {
        id: 3,
        date: new Date().toDateString(),
        teams: [{ name: 'CAF', winner: null }, { name: 'CCJE', winner: null }],
      },
      {
        id: 4,
        date: new Date().toDateString(),
        teams: [{ name: 'CBM', winner: null }, { name: 'CNHS', winner: null }],
      },
    ],
  },
  {
    title: 'Round two',
    seeds: [
      {
        id: 5,
        date: new Date().toDateString(),
        teams: [{ name: 'Winner 1', winner: null }, { name: 'Winner 2', winner: null }],
      },
      {
        id: 6,
        date: new Date().toDateString(),
        teams: [{ name: 'Winner 3', winner: null }, { name: 'Winner 4', winner: null }],
      },
    ],
  },
  {
    title: 'Final Round',
    seeds: [
      {
        id: 7,
        date: new Date().toDateString(),
        teams: [{ name: 'Finalist 1', winner: null }, { name: 'Finalist 2', winner: null }],
      },
    ],
  },
  {
    title: 'Winner',
    seeds: [
      {
        id: 8,
        date: new Date().toDateString(),
        teams: [{ name: 'Champion', winner: null }],
      },
    ],
  },
];

const SingleEliminationBracket = ({ handleLogout }) => {
  const [rounds, setRounds] = useState(initialRounds);
  const [finalWinner, setFinalWinner] = useState(null);

  const handleWinnerSelection = (roundIndex, matchIndex, teamIndex) => {
    const updatedRounds = [...rounds];
    const currentWinner = updatedRounds[roundIndex].seeds[matchIndex].teams[teamIndex].winner;
  
    // Toggle winner status between true, false, and null
    updatedRounds[roundIndex].seeds[matchIndex].teams[teamIndex].winner =
      currentWinner === null ? true : null;
  
    // Update next round's winner based on the selected winner
    if (roundIndex < rounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextRoundMatchIndex = Math.floor(matchIndex / 2);
      const nextRoundTeamIndex = matchIndex % 2;
      updatedRounds[nextRoundIndex].seeds[nextRoundMatchIndex].teams[nextRoundTeamIndex].name =
        updatedRounds[roundIndex].seeds[matchIndex].teams[teamIndex].name;
    }
  
    // If this is the final round, set the final winner
    if (roundIndex === rounds.length - 1) {
      setFinalWinner(updatedRounds[roundIndex].seeds[matchIndex].teams[teamIndex].name);
    }
  
    setRounds(updatedRounds);
  };
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <CustomNavbar handleLogout={handleLogout} />
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Single Elimination Bracket</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Bracket
          rounds={rounds}
          finalWinner={finalWinner}
          onMatchClick={handleWinnerSelection}
          teamTextStyle={{ fontSize: '14px' }}
          matchHeight={70}
          roundTitleStyle={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {rounds.map((round, roundIndex) => (
          <div key={roundIndex} style={{ marginRight: '30px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>{round.title}</h2>
            {round.seeds.map((match, matchIndex) => (
              <div key={matchIndex} style={{ marginBottom: '10px', textAlign: 'center', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Match {match.id}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  {match.teams.map((team, teamIndex) => (
                    <div key={teamIndex} style={{ marginRight: '10px', marginBottom: '10px' }}>
                      <button
  style={{
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '5px',
    border: 'none',
    background: team.winner ? '#4CAF50' : '#008CBA',
    color: 'white',
    cursor: 'pointer',
  }}
  disabled={false}
  onClick={() => handleWinnerSelection(roundIndex, matchIndex, teamIndex)}
>
  {team.name}
</button>

                      {team.winner && <div style={{ fontSize: '12px', marginTop: '5px' }}>{team.name} Wins!</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleEliminationBracket; 