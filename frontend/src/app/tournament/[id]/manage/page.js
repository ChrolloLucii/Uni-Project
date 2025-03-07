
"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GenerateMatchesButton from '@/components/generateMatchesButton';
import TournamentBracket from '@/components/tournamentBracket';


function transformMatchesToBracket(tournament) {
  const teams = tournament.teams || [];
  const allMatches = [
    ...(tournament.previousMatches || []),
    ...(tournament.matches || [])
  ];
  
 
  const totalRounds = Math.ceil(Math.log2(teams.length || 1));
  

  const roundsMap = {};
  
 
  allMatches.forEach((match) => {
    const round = match.round || 1;
    if (!roundsMap[round]) {
      roundsMap[round] = [];
    }
    roundsMap[round].push({
      id: match.id,
      teamA: match.teamA,
      teamB: match.teamB 
        ? { id: match.teamB.id, name: match.teamB.name }
        : { id: "bye", name: "Bye" },
      confirmed: match.played || false,
      winnerId: match.result ? (match.result === "teamA" ? match.teamA.id : match.teamB.id) : null,
      round: round
    });
  });
  

  for (let round = 1; round <= totalRounds; round++) {
    if (!roundsMap[round]) {
      roundsMap[round] = [];
    }
    
 
    const matchesInRound = Math.pow(2, totalRounds - round);
    

    while (roundsMap[round].length < matchesInRound) {
      roundsMap[round].push({
        id: `placeholder-${round}-${roundsMap[round].length}`,
        teamA: { id: "tbd-1", name: "TBD" },
        teamB: { id: "tbd-2", name: "TBD" },
        confirmed: false,
        winnerId: null,
        isPlaceholder: true,
        round: round
      });
    }
  }
  
  // Конвертируем карту в ожидаемый формат
  return Object.keys(roundsMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((roundNum) => ({ 
      title: `Раунд ${roundNum}`, 
      matches: roundsMap[roundNum] 
    }));
}

export default function ManageTournamentPage() {
  const { id } = useParams();
  const [newTeam, setNewTeam] = useState({ id: "", name: "", rating: "", players: [] });
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [predictedMode, setPredictedMode] = useState(false);
  const [originalRounds, setOriginalRounds] = useState([]);
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const getNextMatch = (roundIndex, matchIndex) => {
    if (roundIndex >= rounds.length -1) {
      return null;
    }
    const nextRoundIndex = roundIndex + 1;
    const nextMatchIndex = Math.floor(matchIndex /2);
    if (!rounds[nextRoundIndex] || !rounds[nextRoundIndex].matches[nextMatchIndex]){
      return null;
    }
    return {
      round: nextRoundIndex,
      match: nextMatchIndex,
      data: rounds[nextRoundIndex].matches[nextMatchIndex]
    }
  };
  const togglePredictMode = (enabled) =>{
    if (enabled){
      setOriginalRounds([...rounds]);
    } else {
      setRounds([...originalRounds]);
    }
    setPredictedMode(enabled);
  };
  const resetPredictions =() =>{
    if (predictedMode) {
      setRounds([...originalRounds]);
    }
  };

  const applyPredictions = async () => {
    if (!predictedMode || !confirm("Вы уверены, что хотите отправить все прогнозы на сервер?")) {
      return;
    }
  
    try {
      
      const predictedMatches = rounds.flatMap(round => 
        round.matches.filter(match => match.confirmed && !match.isPlaceholder)
      );
      
      
      const matchResults = predictedMatches.map(match => {
      
        let result = null;
        if (match.winnerId === match.teamA.id) {
          result = "teamA";
        } else if (match.winnerId === match.teamB.id) {
          result = "teamB";
        }
        
        return {
          matchId: match.id,
          result
        };
      });
      
      for (const matchResult of matchResults) {
        if (matchResult.result) {
          await fetch(`http://localhost:4000/api/matches/${matchResult.matchId}/record-result`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result: matchResult.result })
          });
        }
      }
      
 
      const res = await fetch(`http://localhost:4000/api/tournaments/${id}`);
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const tournament = await res.json();
      
      
      const newRounds = transformMatchesToBracket(tournament);
      setRounds(newRounds);
      setOriginalRounds(newRounds);
      setPredictedMode(false);
      
      alert("Все прогнозы успешно применены!");
    } catch (error) {
      console.error("Ошибка при применении прогнозов:", error);
      alert(`Ошибка: ${error.message}`);
    }
  };



  useEffect(() => {
    async function fetchTournamentData() {
  try {
    const res = await fetch(`http://localhost:4000/api/tournaments/${id}`);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const tournament = await res.json();
    if (tournament.matches || tournament.previousMatches) {
      const fullBracket = transformMatchesToBracket(tournament);
      setRounds(fullBracket);
    } else if (tournament.teams && tournament.teams.length > 0) {
      const generatedBracket = generateFullBracket(tournament.teams);
      setRounds(generatedBracket);
      setTeams(tournament.teams);
    }
  } catch (error) {
    console.error(error);
  }
}
    fetchTournamentData();
  }, [id]);


  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch(`http://localhost:4000/api/tournaments/${id}/teams`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : data.teams || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTeams();
  }, [id]);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    console.log("Отправляем данные команды:", newTeam);
    try {
      const res = await fetch(`http://localhost:4000/api/tournaments/${id}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newTeam.id,
          name: newTeam.name,
          rating: Number(newTeam.rating)
        })
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const updatedTournament = await res.json();
      console.log("Команда добавлена", updatedTournament);
      setTeams(updatedTournament.teams || []);
      setNewTeam({ id: "", name: "", rating: "", players: [] });
      alert("Команда добавлена");
    } catch (error) {
      console.error(error);
      alert("Что-то пошло не так (разбирайся сам)");
    }
  };

  // Обработчик выбора победителя матча
  const handleSelectWinner = async (matchId, teamId) => {
    console.log(`Выбран победитель матча ${matchId}: команда ${teamId}`);
    
    if (!predictedMode) {
      try {
    
        const currentMatch = rounds.flatMap(round => round.matches).find(m => m.id === matchId);
        if (!currentMatch) throw new Error("Матч не найден");
        

        let result;
        if (currentMatch.teamA.id === teamId) {
          result = "teamA";
        } else if (currentMatch.teamB.id === teamId) {
          result = "teamB";
        } else {
          throw new Error("Некорректное значение teamId");
        }
        
 
        const res = await fetch(`http://localhost:4000/api/matches/${matchId}/record-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result })
        });
        
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const updatedTournament = await res.json();
        
  
        if (updatedTournament) {
          const updatedRounds = transformMatchesToBracket(updatedTournament);
          setRounds(updatedRounds);

          setOriginalRounds(updatedRounds);
        }
      } catch (error) {
        console.error("Ошибка при выборе победителя:", error);
        alert(`Ошибка: ${error.message}`);
      }
    } else {
    
      let foundMatchInfo = null;
      let winningTeam = null;
      
      const updatedRounds = rounds.map((round, roundIndex) => ({
        ...round,
        matches: round.matches.map((match, matchIndex) => {
          if (match.id === matchId) {

            foundMatchInfo = { roundIndex, matchIndex };
  
            if (match.teamA.id === teamId) {
              winningTeam = match.teamA;
            } else if (match.teamB.id === teamId) {
              winningTeam = match.teamB;
            }
            
            return { 
              ...match, 
              winnerId: teamId,
              confirmed: true 
            };
          }
          return match;
        })
      }));
      
     
      if (foundMatchInfo && winningTeam) {
        let currentRoundIndex = foundMatchInfo.roundIndex;
        let currentMatchIndex = foundMatchInfo.matchIndex;
        
       
        while (currentRoundIndex < updatedRounds.length - 1) {
          const nextMatch = getNextMatch(currentRoundIndex, currentMatchIndex);
          
          if (nextMatch) {
           
            const isTeamA = currentMatchIndex % 2 === 0;
            
    
            updatedRounds[nextMatch.round].matches[nextMatch.match] = {
              ...updatedRounds[nextMatch.round].matches[nextMatch.match],
              ...(isTeamA 
                ? { teamA: winningTeam } 
                : { teamB: winningTeam })
            };
            
      
            currentRoundIndex = nextMatch.round;
            currentMatchIndex = nextMatch.match;
          } else {
            break;
          }
        }
      }
      
      setRounds(updatedRounds);
    }
  };
  const getCurrentRoundNumber = () => {
    if (!rounds.length) return 0;
    const currentRoundIndex = rounds.findIndex(round =>
      round.matches.some(match => !match.confirmed && !match.isPlaceholder)
    );
    if (currentRoundIndex === -1) return "Турнир завершен.";

    return rounds[currentRoundIndex].title.split(" ")[1];
  };
  const canAdvanceRound = () => {
    if (!rounds || !rounds.length) return false;

    const currentRoundIndex =rounds.findIndex(round =>
      round.matches.some(match => !match.confirmed && !match.isPlaceholder)
    );
    if (currentRoundIndex === -1) return rounds.length >1;

    const currentRound = rounds[currentRoundIndex];
    const allMatchesPlayed = currentRound.matches.every( match =>
      match.confirmed || match.isPlaceholder
    );
    return allMatchesPlayed;
  };
  const handleAdvanceRound = async () => {
    if (predictedMode){
      alert("Нельзя продвигать раунд в режиме прогноза");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/tournaments/${id}/advance-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      
    
    const updatedTournament = await res.json();
    const updatedRounds = transformMatchesToBracket(updatedTournament); 
    setRounds(updatedRounds);
    setOriginalRounds(updatedRounds);
      alert("Раунд продвинут");
    } catch (error) {
      console.error(error);
      alert("Ошибка при продвижении раунда");
    }
  };

  return (
    <div className="mt-8">
      <GenerateMatchesButton
        onMatchesGenerated={(updatedMatches) => {
          const newRounds = transformMatchesToBracket(updatedMatches);
          setRounds(newRounds);
          setOriginalRounds(newRounds);
          console.log("Новая сетка:", newRounds);
        }}
      />
      <h2 className="text-2xl mb-4 text-white">Добавить команду в турнир {id}</h2>
      <form className="mb-4" onSubmit={handleAddTeam}>
        <div className="mb-4">
          <label className="block mb-1 text-white" htmlFor="id">id</label>
          <input
            type="text"
            id="id"
            name="id"
            value={newTeam.id}
            onChange={handleTeamChange}
            className="border border-gray-300 text-black rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white" htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newTeam.name}
            onChange={handleTeamChange}
            className="border border-gray-300 text-black rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white" htmlFor="rating">Средний MMR</label>
          <input
            type="text"
            id="rating"
            name="rating"
            value={newTeam.rating}
            onChange={handleTeamChange}
            className="border border-gray-300 rounded text-black p-2"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 rounded text-white bg-gray-700">
          Добавить команду
        </button>
      </form>
      {teams.length > 0 && (
        <div>
          <h2 className="text-2xl mb-4 text-white">Команды</h2>
          <ul>
            {teams.map((team) => (
              <li key={team.id}>
                {team.name} (ID: {team.id}, MMR: {team.rating})
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="text-2xl text-white mb-4">Сетка турнира {id}</h2>
      
      <div className="mb-4 p-4 bg-gray-800 rounded shadow-lg">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className ="mb-2 text-white">
        <span className ="inline-block px-3 py-1 bg-gray-700 rounded-lg">
          Текущий раунд: {getCurrentRoundNumber()}
        </span>
      </div>
      {/* Кнопка перехода к следующему раунду */}
      <button 
        onClick={handleAdvanceRound}
        disabled={predictedMode || !canAdvanceRound()}
        className={`px-4 py-2 text-white text-sm rounded transition ${
          predictedMode || !canAdvanceRound() 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title={
          predictedMode ? "Недоступно в режиме прогноза" : !canAdvanceRound() ? "Завершите все матчи текущего раунда" : "Перейти к следующему раунду"
        }
      >
        Перейти к следующему раунду
      </button>
      
      {/* Переключатель режима прогноза */}
      <label className="text-white flex items-center space-x-2 ml-4">
        <input
          type="checkbox"
          checked={predictedMode}
          onChange={(e) => togglePredictMode(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="ml-2">
          {predictedMode ? "✓ Режим прогноза активен" : "Режим прогноза"}
        </span>
      </label>
    </div>
    
    {predictedMode && (
      <div className="flex space-x-3">
        <button 
          onClick={resetPredictions}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
        >
          Сбросить
        </button>
        <button 
          onClick={applyPredictions}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
        >
          Применить прогнозы
        </button>
      </div>
    )}
  </div>
  
  {predictedMode && (
    <p className="text-gray-400 text-sm mt-2">
      В режиме прогноза вы можете выбирать победителей, не отправляя данные на сервер.
      Нажмите на команду, чтобы отметить её как победителя.
    </p>
  )}
</div>
      
      <TournamentBracket
        rounds={rounds}
        onSelectWinner={handleSelectWinner}
        predictedMode={predictedMode}
      />
    </div>
  );
}