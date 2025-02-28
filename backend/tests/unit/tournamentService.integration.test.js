import TournamentService from '../../domain/services/TournamentService.js';
import FakeTournamentRepository from '../../domain/fakeRepositories/fakeTournamentRepository.js';
import FakeTeamRepository from '../../domain/fakeRepositories/fakeTeamRepository.js';
import MatchService from '../../domain/services/matchService.js';

// Создаем фейковые репозитории (в памяти)
const tournamentRepository = new FakeTournamentRepository();
const teamRepository = new FakeTeamRepository();
// Для matchService нам не нужен репозиторий, так как он генерирует матчи через фабрику
const matchService = new MatchService();

// Создаем экземпляр TournamentService с зависимостями
const tournamentService = new TournamentService(tournamentRepository, teamRepository, matchService);

describe('TournamentService Integration Tests', () => {
  let tournamentData;

  beforeEach(async () => {
    // Обнуляем репозиторий турниров, если необходимо
    tournamentRepository.tournaments = [];

    // Подготавливаем базовые данные турнира
    tournamentData = {
      id: 1,
      name: 'Champions League',
      discipline: 'Football',
      startDate: '2025-09-01',
      endDate: '2025-09-10',
      status: 'upcoming',
      teams: [],
      matches: []
    };
  });

  test('createTournament should create and save a tournament', async () => {
    const tournament = await tournamentService.createTournament(tournamentData);
    expect(tournament).toHaveProperty('id', tournamentData.id);
    expect(tournament).toHaveProperty('name', tournamentData.name);
    // Репозиторий теперь содержит 1 турнир
    expect(tournamentRepository.tournaments.length).toBe(1);
  });

  test('addTeamToTournament should add a new team', async () => {
    // Создадим турнир
    const tournament = await tournamentService.createTournament(tournamentData);

    // Команда для добавления
    const teamData = {
      id: 101,
      name: 'Team Alpha',
      rating: 95,
      players: ['p1', 'p2', 'p3', 'p4', 'p5']
    };

    const updatedTournament = await tournamentService.addTeamToTournament(tournament, teamData);
    expect(updatedTournament.teams).toBeDefined();
    expect(updatedTournament.teams.length).toBe(1);
    expect(updatedTournament.teams[0]).toHaveProperty('id', teamData.id);
  });

  test('generateMatches should create matches when enough teams', async () => {
    // Создаем турнир
    let tournament = await tournamentService.createTournament(tournamentData);

    // Добавляем несколько команд с разными рейтингами
    const teams = [
      { id: 101, name: 'Team A', rating: 95, players: ['p1'] },
      { id: 102, name: 'Team B', rating: 85, players: ['p2'] },
      { id: 103, name: 'Team C', rating: 75, players: ['p3'] },
      { id: 104, name: 'Team D', rating: 65, players: ['p4'] }
    ];

    for (const teamData of teams) {
      tournament = await tournamentService.addTeamToTournament(tournament, teamData);
    }

    const updatedTournament = await tournamentService.generateMatches(tournament);
    expect(updatedTournament.matches).toBeDefined();
    // Ожидается, что для 4 команд будет сформировано 2 матча (strong vs weak, etc.)
    expect(updatedTournament.matches.length).toBe(2);

    // Проверяем, что команды отсортированы по рейтингу: первый матч – сильнейшая и слабейшая
    const match = updatedTournament.matches[0];
    expect(match.teamA.rating).toBeGreaterThan(match.teamB.rating);
  });

  test('generateMatches should throw error if not enough teams', async () => {
    const tournament = await tournamentService.createTournament(tournamentData);
    await expect(tournamentService.generateMatches(tournament))
      .rejects
      .toThrow('Not enough teams');
  });
});