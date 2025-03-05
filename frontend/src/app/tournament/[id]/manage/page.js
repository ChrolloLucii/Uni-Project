//// filepath: /c:/Users/admin/Uni-Project/frontend/src/app/tournament/[id]/manage/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GenerateMatchesButton from '@/components/generateMatchesButton';
import TournamentBracket from '@/components/tournamentBracket';

// Функция преобразования полученных матчей в формат для TournamentBracket
function transformMatchesToBracket(tournament) {
    const allMatches = [
        ...(tournament.previousMatches || []),
        ...(tournament.matches || [])
    ];
  
    const roundsMap = {};
    allMatches.forEach((match) => {
      const round = match.round ||1;
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
        winnerId: match.result || null
      });
    });
    return Object.keys(roundsMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((roundNum) => ({ title: `Раунд ${roundNum}`, matches: roundsMap[roundNum] }));
  }

export default function ManageTournamentPage() {
  const { id } = useParams();
  const [newTeam, setNewTeam] = useState({ id: "", name: "", rating: "", players: [] });
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [predictedMode, setPredictedMode] = useState(false);

  // Фетчим данные турнира (команды и матчи) с бэкенда
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

  // Фетчим команды (если требуется отдельный эндпоинт)
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
        // Найдём нужный матч в текущих раундах
        const currentMatch = rounds.flatMap(round => round.matches).find(m => m.id === matchId);
        if (!currentMatch) throw new Error("Матч не найден");
        // Определим значение result ("teamA" или "teamB")
        let result;
        if (currentMatch.teamA.id == teamId) {
          result = "teamA";
        } else if (currentMatch.teamB.id == teamId) {
          result = "teamB";
        } else {
          throw new Error("Некорректное значение teamId");
        }
        // Отправляем запрос на запись результата непосредственно к backend
        const res = await fetch(`http://localhost:4000/api/matches/${matchId}/record-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "result" : result })
        });
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const updatedTournament = await res.json();
        if (updatedTournament.matches) {
          const updatedRounds = transformMatchesToBracket(updatedTournament.matches);
          setRounds(updatedRounds);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Режим предикта – обновляем только локальное состояние сетки
      const updatedRounds = rounds.map((round) => ({
        ...round,
        matches: round.matches.map((match) => {
          if (match.id === matchId) {
            return { ...match, winnerId: teamId };
          }
          return match;
        })
      }));
      setRounds(updatedRounds);
    }
  };

  return (
    <div className="mt-8">
      <GenerateMatchesButton
        onMatchesGenerated={(updatedMatches) => {
          const newRounds = transformMatchesToBracket(updatedMatches);
          setRounds(newRounds);
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
      <label className="text-white mb-4 block">
        <input
          type="checkbox"
          checked={predictedMode}
          onChange={(e) => setPredictedMode(e.target.checked)}
        />{" "}
        Режим предикта
      </label>
      <TournamentBracket
        rounds={rounds}
        onSelectWinner={handleSelectWinner}
        predictedMode={predictedMode}
      />
    </div>
  );
}