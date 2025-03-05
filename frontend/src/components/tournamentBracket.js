"use client";
import React from 'react';
import PropTypes from 'prop-types';
import "./tournamentBracket.css"
export default function TournamentBracket({ rounds, onSelectWinner, predictedMode }) {
  return (
    <div className="tournament-bracket-container">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="round-container">
          <h3 className="round-title">{round.title}</h3>
          {round.matches.map((match) => (
            <div key={match.id} className="match-card">
              <div
                className={`team team-a ${
                  match.confirmed && match.winnerId === match.teamA.id ? "winner" : ""
                }`}
                onClick={() => onSelectWinner(match.id, match.teamA.id)}
              >
                {match.teamA.name}
              </div>
              <div
                className={`team team-b ${
                  match.confirmed && match.winnerId === match.teamB.id ? "winner" : ""
                }`}
                onClick={() => onSelectWinner(match.id, match.teamB.id)}
              >
                {match.teamB.name}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

TournamentBracket.propTypes = {
  rounds: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      matches: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          teamA: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired
          }).isRequired,
          teamB: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired
          }).isRequired,
          confirmed: PropTypes.bool.isRequired,
          winnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
      ).isRequired
    })
  ).isRequired,
  onSelectWinner: PropTypes.func.isRequired,
  predictedMode: PropTypes.bool
};
TournamentBracket.defaultProps = {
  predictedMode: false
};