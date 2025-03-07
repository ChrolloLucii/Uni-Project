"use client";
import React from 'react';
import PropTypes from 'prop-types';
import "./tournamentBracket.css"

export default function TournamentBracket({ rounds, onSelectWinner, predictedMode }) {
  return (
    <div className="tournament-bracket-container text-black">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="round-container">
          <h3 className="round-title">{round.title}</h3>
          <div className="matchesContainer">
            {round.matches.map((match, matchIndex) => (
              <div 
                key={match.id} 
                className={`match-card ${match.isPlaceholder ? 'placeholder-match' : ''}`}
              >
                <div 
                  className={`team ${
                    match.confirmed && match.winnerId === match.teamA.id ? "winner" : ""
                  } ${match.teamA.id.startsWith('tbd') ? 'tbd-team' : ''} ${
                    predictedMode && !match.teamA.id.startsWith('tbd') ? 'predictable' : ''
                  }`}
                  onClick={() => !match.teamA.id.startsWith('tbd') && onSelectWinner(match.id, match.teamA.id)}
                >
                  <span>{match.teamA.name}</span>
                  {predictedMode && match.confirmed && match.winnerId === match.teamA.id && 
                    <span className="prediction-mark">⭐</span>
                  }
                </div>
                
                <div 
                  className={`team ${
                    match.confirmed && match.winnerId === match.teamB.id ? "winner" : ""
                  } ${match.teamB.id.startsWith('tbd') ? 'tbd-team' : ''} ${
                    predictedMode && !match.teamB.id.startsWith('tbd') ? 'predictable' : ''
                  }`}
                  onClick={() => !match.teamB.id.startsWith('tbd') && onSelectWinner(match.id, match.teamB.id)}
                >
                  <span>{match.teamB.name}</span>
                  {predictedMode && match.confirmed && match.winnerId === match.teamB.id && 
                    <span className="prediction-mark">⭐</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}