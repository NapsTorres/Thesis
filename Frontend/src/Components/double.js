import React, { useState } from 'react';
import { Bracket } from 'react-brackets';
import CustomNavbar from './Navbar';

const DoubleEliminationBracket = ({ handleLogout }) => {
  const initialWinnerRounds = [
    {
      title: 'Winner Bracket Round one',
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
      ],
    },
    {
      title: 'Winner Bracket Round two',
      seeds: [
        {
          id: 5,
          date: new Date().toDateString(),
          teams: [{ name: 'Winner 1', winner: null }, { name: 'Winner 2', winner: null }],
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
      title: 'Championship',
      seeds: [
        {
          id: 8,
          date: new Date().toDateString(),
          teams: [{ name: '--', winner: null }],
        },
      ],
    },
  ];

  const initialLoserRounds = [
    {
      title: 'Loser Bracket Round one',
      seeds: [
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [{ name: 'Loser 1', winner: null }, { name: 'Loser 2', winner: null }],
        },
      ],
    },
    {
      title: 'Loser Bracket Round two',
      seeds: [
        {
          id: 3,
          date: new Date().toDateString(),
          teams: [{ name: 'Loser 5', winner: null }, { name: 'Loser 6', winner: null }],
        },
      ],
    },
    {
      title: 'Loser Final Round',
      seeds: [
        {
          id: 4,
          date: new Date().toDateString(),
          teams: [{ name: 'Loser Finalist 1', winner: null }, { name: 'Loser Finalist 2', winner: null }],
        },
      ],
    },
    {
      title: 'Championship',
      seeds: [
        {
          id: 5,
          date: new Date().toDateString(),
          teams: [{ name: '--', winner: null }],
        },
      ],
    },
  ];

  const [winnerRounds, setWinnerRounds] = useState(initialWinnerRounds);
  const [loserRounds, setLoserRounds] = useState(initialLoserRounds);

  const handleWinnerSelection = (roundIndex, matchIndex, teamIndex) => {
    const updatedWinnerRounds = [...winnerRounds];
    updatedWinnerRounds[roundIndex].seeds[matchIndex].teams[teamIndex].winner = true;
  
    // Update next round's winner based on the selected winner
    if (roundIndex < winnerRounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextRoundMatchIndex = Math.floor(matchIndex / 2);
      const nextRoundTeamIndex = matchIndex % 2;
      updatedWinnerRounds[nextRoundIndex].seeds[nextRoundMatchIndex].teams[nextRoundTeamIndex].name =
        updatedWinnerRounds[roundIndex].seeds[matchIndex].teams[teamIndex].name;
    }
  
    // Move the losing team to the loser bracket
    if (roundIndex < winnerRounds.length - 1) {
      const loserRoundIndex = roundIndex;
      const loserMatchIndex = Math.floor(matchIndex / 2);
      const loserTeamIndex = matchIndex % 2 === 0 ? 1 : 0;
      const losingTeamName = updatedWinnerRounds[roundIndex].seeds[matchIndex].teams[teamIndex === 0 ? 1 : 0].name;
  
      // Update the loser bracket only if the losing team is from the winner bracket
      const updatedLoserRounds = [...loserRounds];
      updatedLoserRounds[loserRoundIndex].seeds[loserMatchIndex].teams[loserTeamIndex].name =
        losingTeamName;
      setLoserRounds(updatedLoserRounds);
    }
  
    setWinnerRounds(updatedWinnerRounds);
  };
  
  const handleLoserSelection = (roundIndex, matchIndex, teamIndex) => {
    const updatedLoserRounds = [...loserRounds];
    updatedLoserRounds[roundIndex].seeds[matchIndex].teams[teamIndex].winner = true;
  
    // Define updatedWinnerRounds outside of handleLoserSelection
    const updatedWinnerRounds = [...winnerRounds];

    // Update next round's winner based on the selected winner
    if (roundIndex < loserRounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextRoundMatchIndex = Math.floor(matchIndex / 2);
      const nextRoundTeamIndex = matchIndex % 2;
      updatedLoserRounds[nextRoundIndex].seeds[nextRoundMatchIndex].teams[nextRoundTeamIndex].name =
        updatedLoserRounds[roundIndex].seeds[matchIndex].teams[teamIndex].name;
    }
  
    // If it's the last round in the loser bracket
    if (roundIndex === loserRounds.length - 1) {
      const loserWinnerName = updatedLoserRounds[roundIndex].seeds[matchIndex].teams[teamIndex].name;
      const winnerBracketFinalIndex = winnerRounds.length - 1;
      const winnerBracketWinnerName = winnerRounds[winnerBracketFinalIndex].seeds[0].teams[0].name;
  
      // If the winner of the loser bracket wins, set up the rematch
      if (loserWinnerName === winnerBracketWinnerName) {
        // Add rematch match to the final round of the winner bracket
        updatedWinnerRounds[winnerBracketFinalIndex].seeds.push({
          id: 8,
          date: new Date().toDateString(),
          teams: [{ name: winnerBracketWinnerName, winner: null }, { name: loserWinnerName, winner: null }],
        });
      } else {
        // If the winner of the winner bracket wins, they are the champion
        updatedWinnerRounds[winnerBracketFinalIndex].seeds[0].teams[1].name = loserWinnerName;
      }
    }
  
    setLoserRounds(updatedLoserRounds);
    setWinnerRounds(updatedWinnerRounds); // Update winner rounds
  };

  return (
    <div>
      <CustomNavbar handleLogout={handleLogout} />
      <h1>Double Elimination Bracket</h1>
      {/* Winner Bracket */}
      <Bracket rounds={winnerRounds} />

      {/* Loser Bracket */}
      <Bracket rounds={loserRounds} />

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {/* Winner Bracket Buttons */}
        {winnerRounds.map((round, roundIndex) => (
          <div key={roundIndex} style={{ marginRight: '30px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>{round.title}</h2>
            {round.seeds.map((match, matchIndex) => (
              <div key={matchIndex} style={{ marginBottom: '10px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Match {match.id}</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {match.teams.map((team, teamIndex) => (
                    <div key={teamIndex} style={{ marginRight: '10px' }}>
                      <button
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          borderRadius: '5px',
                          border: 'none',
                          background: team.winner ? '#4CAF50' : '#008CBA',
                          color: 'white',
                          cursor: team.winner ? 'default' : 'pointer',
                        }}
                        disabled={team.winner !== null}
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

        {/* Loser Bracket Buttons */}
        {loserRounds.map((round, roundIndex) => (
          <div key={roundIndex} style={{ marginRight: '30px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>{round.title}</h2>
            {round.seeds.map((match, matchIndex) => (
              <div key={matchIndex} style={{ marginBottom: '10px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Match {match.id}</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {match.teams.map((team, teamIndex) => (
                    <div key={teamIndex} style={{ marginRight: '10px' }}>
                      <button
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          borderRadius: '5px',
                          border: 'none',
                          background: team.winner ? '#4CAF50' : '#008CBA',
                          color: 'white',
                          cursor: team.winner ? 'default' : 'pointer',
                        }}
                        disabled={team.winner !== null}
                        onClick={() => handleLoserSelection(roundIndex, matchIndex, teamIndex)}
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

      {/* Final Match */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ marginRight: '30px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>Champion</h2>
          {winnerRounds[winnerRounds.length - 1].seeds.map((match, matchIndex) => (
            <div key={matchIndex} style={{ marginBottom: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Match {match.id}</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {match.teams.map((team, teamIndex) => (
                  <div key={teamIndex} style={{ marginRight: '10px' }}>
                    <button
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        border: 'none',
                        background: team.winner ? '#4CAF50' : '#008CBA',
                        color: 'white',
                        cursor: team.winner ? 'default' : 'pointer',
                      }}
                      disabled={team.winner !== null}
                      // No onClick handler because this match result is determined by the bracket logic
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
      </div>
    </div>
  );
};

export default DoubleEliminationBracket;
