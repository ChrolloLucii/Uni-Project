import TournamentService from '../domain/services/tournamentService.js';
import FakeTournamentRepository from '../domain/fakeRepositories/fakeTournamentRepository.js';
import FakeTeamRepository from '../domain/fakeRepositories/fakeTeamRepository.js';
import MatchService from '../domain/services/matchService.js';
// Создаем фейковые репозитории (в памяти)
const tournamentRepository = new FakeTournamentRepository();
const teamRepository = new FakeTeamRepository();
const matchService = new MatchService();

// Создаем экземпляр TournamentService с зависимостями
const tournamentService = new TournamentService(tournamentRepository, teamRepository, matchService);

describe('Система управления турнирами', () => {
  let tournamentData;

  beforeEach(() => {
    // Очищаем репозиторий перед каждым тестом
    tournamentRepository.tournaments = [];
    tournamentData = {
      id: 1,
      name: 'Тестовый турнир',
      description: 'Описание тестового турнира',
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      organizer: '101',
      discipline: 'dota2',
      status: 'upcoming',
      teams: [],
      matches: [],
      previousMatches: [],
      judges: []
    };
  });

  // Тест 1: Создание турнира организатором
  test('Создание турнира организатором', async () => {
    const tournament = await tournamentService.createTournament(tournamentData);
    expect(tournament).toHaveProperty('id', tournamentData.id);
    expect(tournament).toHaveProperty('name', tournamentData.name);
    expect(tournament).toHaveProperty('discipline', tournamentData.discipline);
    expect(tournamentRepository.tournaments.length).toBe(1);
    expect(tournamentRepository.tournaments[0].id).toBe(tournamentData.id);
  });

  // Тест 2: Получение списка всех турниров
  test('Получение списка всех турниров', async () => {
    // Создаем несколько турниров в репозитории
    await tournamentService.createTournament(tournamentData);
    await tournamentService.createTournament({
      ...tournamentData,
      id: 2,
      name: 'Второй турнир',
      discipline: 'Киберспорт'
    });
    const tournaments = await tournamentService.getAllTournaments();
    
    expect(Array.isArray(tournaments)).toBe(true);
    expect(tournaments.length).toBe(2);
    const names = tournaments.map(t => t.name);
    expect(names).toContain('Тестовый турнир');
    expect(names).toContain('Второй турнир');
  });

  // Тест 3: Получение информации о турнире по ID
  test('Получение информации о турнире по ID', async () => {
    await tournamentService.createTournament(tournamentData);
    

    const tournament = await tournamentService.getTournamentById(tournamentData.id);
    expect(tournament).toHaveProperty('id', tournamentData.id);
    expect(tournament).toHaveProperty('name', tournamentData.name);
    expect(tournament).toHaveProperty('description', tournamentData.description);
    expect(tournament).toHaveProperty('discipline', tournamentData.discipline);
  });

  // Тест 4: Обновление информации о турнире
  test('Обновление информации о турнире', async () => {
    await tournamentService.createTournament(tournamentData);
    const updateData = {
      name: 'Обновленный турнир',
      description: 'Новое описание',
      discipline: 'Киберспорт',
      status: 'ongoing'
    };
    const updatedTournament = await tournamentService.updateTournament(
      tournamentData.id, 
      updateData
    );
    expect(updatedTournament).toHaveProperty('name', updateData.name);
    expect(updatedTournament).toHaveProperty('description', updateData.description);
    expect(updatedTournament).toHaveProperty('discipline', updateData.discipline);
    expect(updatedTournament).toHaveProperty('status', updateData.status);
    
    // Проверяем обновление в репозитории
    const tournamentFromRepo = await tournamentService.getTournamentById(tournamentData.id);
    expect(tournamentFromRepo.name).toBe(updateData.name);
  });

  // Тест 5: Удаление турнира
  test('Удаление турнира', async () => {
    await tournamentService.createTournament(tournamentData);

    expect(tournamentRepository.tournaments.length).toBe(1);

    await tournamentService.deleteTournament(tournamentData.id);
    expect(tournamentRepository.tournaments.length).toBe(0);
    await expect(
      tournamentService.getTournamentById(tournamentData.id)
    ).rejects.toThrow('Tournament not found');
  });

  //Добавление команды в турнир
  test('Добавление команды в турнир', async () => {
    const tournament = await tournamentService.createTournament(tournamentData);
    

    const teamData = {
      id: 101,
      name: 'Новая команда',
      rating: 85,
      players: ['Игрок 1', 'Игрок 2', 'Игрок 3']
    };
    const updatedTournament = await tournamentService.addTeamToTournament(tournament, teamData);
    expect(updatedTournament.teams).toBeDefined();
    expect(updatedTournament.teams.length).toBe(1);
    expect(updatedTournament.teams[0]).toHaveProperty('id', teamData.id);
    expect(updatedTournament.teams[0]).toHaveProperty('name', teamData.name);
  });

  // Генерация матчей для турнира
  test('Генерация матчей для турнира', async () => {
    // Создаем турнир
    let tournament = await tournamentService.createTournament(tournamentData);
    
    const teams = [
      { id: 101, name: 'Команда A', rating: 90, players: ['A1', 'A2', 'A3'] },
      { id: 102, name: 'Команда B', rating: 85, players: ['B1', 'B2', 'B3'] },
      { id: 103, name: 'Команда C', rating: 95, players: ['C1', 'C2', 'C3'] },
      { id: 104, name: 'Команда D', rating: 80, players: ['D1', 'D2', 'D3'] }
    ];
    
    for (const team of teams) {
      tournament = await tournamentService.addTeamToTournament(tournament, team);
    }
    
    const tournamentWithMatches = await tournamentService.generateMatches(tournament);
    
    expect(tournamentWithMatches.matches).toBeDefined();
    expect(tournamentWithMatches.matches.length).toBe(2); // Для 4 команд создается 2 матча
    
    const firstMatch = tournamentWithMatches.matches[0];
    expect(firstMatch).toHaveProperty('teamA');
    expect(firstMatch).toHaveProperty('teamB');
    expect(firstMatch).toHaveProperty('scheduledTime');
    expect(firstMatch).toHaveProperty('played', false);
    expect(firstMatch).toHaveProperty('result', null);
  });

 
  test('Назначение судьи на турнир', async () => {
    // Создаем турнир
    await tournamentService.createTournament(tournamentData);
    
    // Данные судьи
    const judgeData = {
      id: 201,
      name: 'Судья Иванов',
      role: 'JUDGE',
      qualification: 'Международная категория'
    };
    
    const updatedTournament = await tournamentService.assignJudge(
      tournamentData.id, 
      judgeData
    );
    

    expect(updatedTournament.judges).toBeDefined();
    expect(updatedTournament.judges.length).toBe(1);
    expect(updatedTournament.judges[0]).toHaveProperty('id', judgeData.id);
    expect(updatedTournament.judges[0]).toHaveProperty('name', judgeData.name);
  });

  // Генерация bye-матча при нечетном количестве команд
test('Генерация bye-матча при нечетном количестве команд', async () => {
  // Создаем турнир
  let tournament = await tournamentService.createTournament(tournamentData);
  
  // Добавляем нечетное количество команд (5 команд)
  const teams = [
    { id: 101, name: 'Команда A', rating: 90, players: ['A1', 'A2', 'A3'] },
    { id: 102, name: 'Команда B', rating: 85, players: ['B1', 'B2', 'B3'] },
    { id: 103, name: 'Команда C', rating: 95, players: ['C1', 'C2', 'C3'] },
    { id: 104, name: 'Команда D', rating: 80, players: ['D1', 'D2', 'D3'] },
    { id: 105, name: 'Команда E', rating: 75, players: ['E1', 'E2', 'E3'] }
  ];
  
  for (const team of teams) {
    tournament = await tournamentService.addTeamToTournament(tournament, team);
  }
  

  const tournamentWithMatches = await tournamentService.generateMatches(tournament);
  
  expect(tournamentWithMatches.matches).toBeDefined();
  expect(tournamentWithMatches.matches.length).toBe(3);
  
  // Ищем bye-матч
  const byeMatch = tournamentWithMatches.matches.find(match => 
    (match.teamA && !match.teamB) || (!match.teamA && match.teamB)
  );
  
  // Проверяем, что bye-матч существует
  expect(byeMatch).toBeDefined();
  
 
  expect(Boolean(byeMatch.teamA) !== Boolean(byeMatch.teamB)).toBe(true);
  
  expect(Boolean(byeMatch.teamA) || Boolean(byeMatch.teamB)).toBe(true);

  if (byeMatch.teamA) {
    expect(byeMatch.teamB).toBeFalsy();
  } else {
    expect(byeMatch.teamA).toBeFalsy();
  }
});

// Запись результата матча
test('Запись результата матча', async () => {
  let tournament = await tournamentService.createTournament(tournamentData);
  
  const teams = [
    { id: 101, name: 'Команда A', rating: 90, players: ['A1', 'A2', 'A3'] },
    { id: 102, name: 'Команда B', rating: 85, players: ['B1', 'B2', 'B3'] }
  ];
  
  for (const team of teams) {
    tournament = await tournamentService.addTeamToTournament(tournament, team);
  }
  
  tournament = await tournamentService.generateMatches(tournament);
  const match = tournament.matches[0];
  
  const matchResult = {
    winner: match.teamA.id, 
    scoreTeamA: 2,
    scoreTeamB: 1,
    notes: 'Отличная игра',
    duration: '1:45'
  };
  
  const updatedTournament = await tournamentService.recordMatchResult(
    match.id, 
    matchResult
  );
  
  const updatedMatch = updatedTournament.matches.find(m => m.id === match.id);
  
  expect(updatedMatch).toHaveProperty('played', true);
  expect(updatedMatch).toHaveProperty('result');
  expect(updatedMatch.result).toHaveProperty('winner', matchResult.winner);
  expect(updatedMatch.result).toHaveProperty('scoreTeamA', matchResult.scoreTeamA);
  expect(updatedMatch.result).toHaveProperty('scoreTeamB', matchResult.scoreTeamB);
  const latestTournament = await tournamentService.getTournamentById(tournament.id);
  const matchInTournament = latestTournament.matches.find(m => m.id === match.id);
  expect(matchInTournament.played).toBe(true);
  expect(matchInTournament.result.winner).toBe(matchResult.winner);
});

// Продвижение раунда
test('Продвижение раунда', async () => {
  let tournament = await tournamentService.createTournament(tournamentData);
  const teams = [
    { id: 101, name: 'Команда A', rating: 90, players: ['A1', 'A2', 'A3'] },
    { id: 102, name: 'Команда B', rating: 85, players: ['B1', 'B2', 'B3'] },
    { id: 103, name: 'Команда C', rating: 95, players: ['C1', 'C2', 'C3'] },
    { id: 104, name: 'Команда D', rating: 80, players: ['D1', 'D2', 'D3'] }
  ];
  
  for (const team of teams) {
    tournament = await tournamentService.addTeamToTournament(tournament, team);
  }
  tournament = await tournamentService.generateMatches(tournament);
  
  for (const match of tournament.matches) {
    const teamA = match.teamA
    const teamB = match.teamB
    tournament = await tournamentService.recordMatchResult(
      match.id, 
      {
       result: teamA
      }
    );
  }
  
  const nextRoundTournament = await tournamentService.advanceRound(tournament);
  
  expect(nextRoundTournament.previousMatches).toBeDefined();
  expect(nextRoundTournament.previousMatches.length).toBe(2);
  

  expect(nextRoundTournament.matches).toBeDefined();
  expect(nextRoundTournament.matches.length).toBe(1); 
  const finalsMatch = nextRoundTournament.matches[0];
  expect(finalsMatch.round).toBe(2); // Второй раунд
});

// Завершение турнира
test('Завершение турнира', async () => {
  let tournament = await tournamentService.createTournament(tournamentData);
  const teams = [
    { id: 101, name: 'Команда A', rating: 90, players: ['A1', 'A2', 'A3'] },
    { id: 102, name: 'Команда B', rating: 85, players: ['B1', 'B2', 'B3'] }
  ];
  
  for (const team of teams) {
    tournament = await tournamentService.addTeamToTournament(tournament, team);
  }
  
  tournament = await tournamentService.generateMatches(tournament);
  
  const match = tournament.matches[0];
  tournament = await tournamentService.recordMatchResult(match.id, {
    winner: match.teamA.id,
    scoreTeamA: 3,
    scoreTeamB: 1
  });
  
  const completedTournament = await tournamentService.updateTournament(
    tournament.id, 
    {
      status: 'completed',
      winner: match.teamA // Устанавливаем победителя
    }
  );
  expect(completedTournament).toHaveProperty('status', 'completed');
  expect(completedTournament).toHaveProperty('winner');
  expect(completedTournament.winner).toHaveProperty('id', match.teamA.id);
  expect(completedTournament.winner).toHaveProperty('name', match.teamA.name);
});
});