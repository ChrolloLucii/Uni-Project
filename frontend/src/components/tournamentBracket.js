"use client";
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import "./tournamentBracket.css"

export default function TournamentBracket({ rounds, onSelectWinner, predictedMode }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Calculate vertical padding for each round to align matches properly
      const roundContainers = containerRef.current.querySelectorAll('.round-container');
      
      for (let i = 1; i < roundContainers.length; i++) {
        const prevRoundMatchCount = rounds[i-1].matches.length;
        const currentRoundMatchCount = rounds[i].matches.length;
        
        if (prevRoundMatchCount > currentRoundMatchCount && currentRoundMatchCount > 0) {
          const ratio = prevRoundMatchCount / currentRoundMatchCount;
          const paddingValue = `${ratio * 2.5}rem`;
          roundContainers[i].style.setProperty('--round-padding', paddingValue);
        }
      }
      
      // Add vertical connector lines
      for (let i = 0; i < roundContainers.length - 1; i++) {
        const currentRoundMatches = roundContainers[i].querySelectorAll('.match-card');
        
        for (let j = 0; j < currentRoundMatches.length; j += 2) {
          // Skip if we don't have a pair of matches
          if (j + 1 >= currentRoundMatches.length) continue;
          
          const firstMatch = currentRoundMatches[j];
          const secondMatch = currentRoundMatches[j + 1];
          
          const top = firstMatch.offsetTop + (firstMatch.offsetHeight / 2);
          const bottom = secondMatch.offsetTop + (secondMatch.offsetHeight / 2);
          const height = bottom - top;
          
          const connector = document.createElement('div');
          connector.className = 'match-connector';
          connector.style.top = `${top}px`;
          connector.style.height = `${height}px`;
          
          firstMatch.parentNode.appendChild(connector);
        }
      }
    }
  }, [rounds]);

  return (
    <div className="tournament-bracket-container text-black" ref={containerRef}>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="round-container">
          <h3 className="round-title">{round.title}</h3>
          <div className="matchesContainer">
            {round.matches.map((match, matchIndex) => (
              <div 
                key={match.id} 
                className={`match-card ${match.isPlaceholder ? 'placeholder-match' : ''}`}
                data-match-index={matchIndex}
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