
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GenerateMatchesButton from '@/components/generateMatchesButton';
import TournamentBracket from '@/components/tournamentBracket';
import Footer from '@/components/footer';
import Header from '@/components/header';
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
  const [tournamentName, setTournamentName] = useState("");
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
    setTournamentName(tournament.name);
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
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок турнира */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">
              Управление турниром: {tournamentName}
            </h1>
            <p className="text-gray-400 mt-2">ID: {id}</p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Левая колонка - Управление командами */}
            <div className="xl:col-span-1 space-y-6">
              {/* Карточка с формой добавления команды */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                  Добавление команды
                </h2>
                <form onSubmit={handleAddTeam}>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor="id">
                      ID команды
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={newTeam.id}
                      onChange={handleTeamChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor="name">
                      Название команды
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newTeam.name}
                      onChange={handleTeamChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor="rating">
                      Средний MMR
                    </label>
                    <input
                      type="text"
                      id="rating"
                      name="rating"
                      value={newTeam.rating}
                      onChange={handleTeamChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 px-5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Добавить команду
                  </button>
                </form>
              </div>
              
              {/* Карточка со списком команд */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                  Команды в турнире <span className="text-gray-400">({teams.length})</span>
                </h2>
                {teams.length > 0 ? (
                  <div className="overflow-y-auto max-h-96">
                    <ul className="space-y-2">
                      {teams.map((team) => (
                        <li key={team.id} className="px-3 py-2 bg-gray-700 rounded-md flex items-center justify-between">
                          <span className="text-white font-medium">{team.name}</span>
                          <div className="text-sm text-gray-400">
                            ID: {team.id} | MMR: {team.rating}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Команды еще не добавлены
                  </p>
                )}
              </div>
              
              {/* Кнопка генерации матчей */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                  Генерация матчей
                </h2>
                <GenerateMatchesButton
                  onMatchesGenerated={(updatedMatches) => {
                    const newRounds = transformMatchesToBracket(updatedMatches);
                    setRounds(newRounds);
                    setOriginalRounds(newRounds);
                  }}
                  className="w-full py-2.5 px-5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            {/* Правая колонка - Турнирная сетка */}
            <div className="xl:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                  Управление сеткой турнира
                </h2>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Текущий раунд и кнопка продвижения */}
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg">
                        Текущий раунд: {getCurrentRoundNumber()}
                      </span>
                      
                      <button 
                        onClick={handleAdvanceRound}
                        disabled={predictedMode || !canAdvanceRound()}
                        className={`px-4 py-2 text-white text-sm rounded-lg transition ${
                          predictedMode || !canAdvanceRound() 
                            ? 'bg-gray-600 cursor-not-allowed opacity-60' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        title={
                          predictedMode 
                            ? "Недоступно в режиме прогноза" 
                            : !canAdvanceRound() 
                              ? "Завершите все матчи текущего раунда" 
                              : "Перейти к следующему раунду"
                        }
                      >
                        Перейти к следующему раунду
                      </button>
                    </div>
                    
                    {/* Управление режимом прогноза */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center space-x-2 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={predictedMode}
                          onChange={(e) => togglePredictMode(e.target.checked)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span>{predictedMode ? "Режим прогноза активен" : "Режим прогноза"}</span>
                      </label>
                      
                      {predictedMode && (
                        <div className="flex gap-2">
                          <button 
                            onClick={resetPredictions}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition"
                          >
                            Сбросить
                          </button>
                          <button 
                            onClick={applyPredictions}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition"
                          >
                            Применить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {predictedMode && (
                    <div className="mt-3 p-3 bg-blue-900 bg-opacity-30 border border-blue-800 text-blue-200 rounded-md">
                      <p className="text-sm">
                        В режиме прогноза вы можете выбирать победителей, не отправляя данные на сервер.
                        Нажмите на команду в матче, чтобы отметить её как победителя.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Турнирная сетка */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 overflow-x-auto">
                <TournamentBracket
                  rounds={rounds}
                  onSelectWinner={handleSelectWinner}
                  predictedMode={predictedMode}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}