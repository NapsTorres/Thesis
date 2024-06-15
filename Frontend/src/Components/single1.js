import React, { useState } from 'react';
import { Bracket } from 'react-brackets';
import CustomNavbar from './Navbar';



const SingleEliminationBracket = ({ handleLogout }) => {
  const [rounds, setRounds] = useState(initialRounds);
  const [finalWinner, setFinalWinner] = useState(null);
  
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token')).data.token;
      const headers = {
        'accept': 'application/json',
        'Authorization': token
      };

      const response = await axios.get('http://localhost:3001/api/teams', { headers });
      const teamsData = response.data;
      const transformedRounds = transformTeamsData(teamsData);
      setRounds(transformedRounds);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const transformTeamsData = (teamsData) => {
    // Dummy transformation for demonstration purposes
    const transformedRounds = initialRounds.map((round) => {
      return {
        ...round,
        seeds: round.seeds.map((seed) => {
          return {
            ...seed,
            teams: seed.teams.map((team) => ({
              name: team.TeamCode, // Assuming TeamCode is the property containing the team code
              winner: null,
            })),
          };
        }),
      };
    });

    return transformedRounds;
  };


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