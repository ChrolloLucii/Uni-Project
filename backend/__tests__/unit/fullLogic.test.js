import TournamentService from '../../domain/services/tournamentService.js';
import TeamService from '../../domain/services/teamService.js';
import UserService from '../../domain/services/userService.js';
import FakeTournamentRepository from '../../domain/fakeRepositories/fakeTournamentRepository.js';
import FakeTeamRepository from '../../domain/fakeRepositories/fakeTeamRepository.js';
import FakeUserRepository from '../../domain/fakeRepositories/fakeUserRepository.js';
import MatchService from '../../domain/services/matchService.js';

// Создадим экземпляры сервисов с ин-мемори репозиториями
const tournamentRepository = new FakeTournamentRepository();
const teamRepository = new FakeTeamRepository();
const userRepository = new FakeUserRepository(); // либо singleton репозиторий, если он определён
const matchService = new MatchService();

const tournamentService = new TournamentService(tournamentRepository, teamRepository, matchService);
const teamService = new TeamService(teamRepository);
const userService = new UserService(userRepository);

describe('Full Backend Logic Integration Tests', () => {

  describe('User Logic', () => {
    beforeEach(() => {
      // Для пользователей можно обнулять коллекцию
      userRepository.users = new Map();
    });
    
    test('should register and retrieve a user', async () => {
      const userData = { id: 1, role: 'ORGANIZER', nickname: 'OrganizerOne', username: 'org1', password: 'pass', email: 'org1@example.com' };
      const registeredUser = await userService.registerUser(userData);
      expect(registeredUser).toHaveProperty('id', 1);
      const fetchedUser = await userService.getUserById(1);
      expect(fetchedUser).toBeDefined();
      expect(fetchedUser.username).toBe('org1');
    });

    test('should update and delete a user', async () => {
      const userData = { id: 2, role: 'PLAYER', nickname: 'PlayerOne', username: 'player1', password: 'pass', email: 'player1@example.com' };
      await userService.registerUser(userData);
      const updated = await userService.updateUser({ ...userData, nickname: 'PlayerOneUpdated' });
      expect(updated.nickname).toBe('PlayerOneUpdated');
      await userService.deleteUser(2);
      const deleted = await userService.getUserById(2);
      expect(deleted).toBeUndefined();
    });
  });

  describe('Team Logic', () => {
    beforeEach(() => {
      teamRepository.teams = [];
    });

    test('should create a team and retrieve it', async () => {
      const teamData = { id: '101', name: 'Team Alpha', rating: 95, players: ['p1', 'p2', 'p3', 'p4', 'p5'] };
      const team = await teamService.createTeam(teamData);
      expect(team).toHaveProperty('id', '101');
      const fetched = await teamRepository.findById('101');
      expect(fetched).toBeDefined();
      expect(fetched.name).toBe('Team Alpha');
    });
  });

  describe('Tournament Logic', () => {
    let tournamentData;

    beforeEach(async () => {
      // Обнуляем репозиторий турниров
      tournamentRepository.tournaments = [];
      tournamentData = {
        id: "1",
        name: 'Champions League',
        discipline: 'Football',
        startDate: '2025-09-01',
        endDate: '2025-09-10',
        status: 'upcoming',
        teams: [],
        matches: [],
        previousMatches: []
      };
    });

    test('should create a tournament', async () => {
      const tournament = await tournamentService.createTournament(tournamentData);
      expect(tournament).toBeDefined();
      expect(tournament.id).toEqual("1");
      expect(tournamentRepository.tournaments.length).toBe(1);
    });

    test('should add teams and generate matches (with bye if needed)', async () => {
      let tournament = await tournamentService.createTournament(tournamentData);

      // Добавляем 5 команд – порядок не важен, внутреннее сортирование по рейтингу происходит в генерации матчей
      const teams = [
        { id: "101", name: 'Team A', rating: 100, players: ['a1', 'a2', 'a3', 'a4', 'a5'] },
        { id: "102", name: 'Team B', rating: 90, players: ['b1', 'b2', 'b3', 'b4', 'b5'] },
        { id: "103", name: 'Team C', rating: 80, players: ['c1', 'c2', 'c3', 'c4', 'c5'] },
        { id: "104", name: 'Team D', rating: 70, players: ['d1', 'd2', 'd3', 'd4', 'd5'] },
        { id: "105", name: 'Team E', rating: 60, players: ['e1', 'e2', 'e3', 'e4', 'e5'] },
      ];

      for (const teamData of teams) {
        tournament = await tournamentService.addTeamToTournament(tournament, teamData);
      }
      expect(tournament.teams.length).toBe(5);

      // Генерируем матчи – для нечетного количества команд должна быть как минимум одна bye
      tournament = await tournamentService.generateMatches(tournament);
      expect(tournament.matches.length).toBeGreaterThanOrEqual(3);
      // Проверяем, что bye-мяч (match) создан через фабрику и имеет поле bye === true
      const byeMatch = tournament.matches.find(match => match.result === 'bye');
      expect(byeMatch).toBeDefined();
      expect(byeMatch).toHaveProperty('id');
      expect(byeMatch.result).toBe('bye');
      // Если byeMatch существует, то его teamB должно быть null
      expect(byeMatch.teamB).toBeNull();
    });

    test('should record match result and advance round', async () => {
      // Создадим турнир и добавим 5 команд
      let tournament = await tournamentService.createTournament(tournamentData);
      const teams = [
        { id: "101", name: 'Team A', rating: 100, players: ['a1', 'a2', 'a3', 'a4', 'a5'] },
        { id: "102", name: 'Team B', rating: 90, players: ['b1', 'b2', 'b3', 'b4', 'b5'] },
        { id: "103", name: 'Team C', rating: 80, players: ['c1', 'c2', 'c3', 'c4', 'c5'] },
        { id: "104", name: 'Team D', rating: 70, players: ['d1', 'd2', 'd3', 'd4', 'd5'] },
        { id: "105", name: 'Team E', rating: 60, players: ['e1', 'e2', 'e3', 'e4', 'e5'] },
      ];
      for (const teamData of teams) {
        tournament = await tournamentService.addTeamToTournament(tournament, teamData);
      }
      tournament = await tournamentService.generateMatches(tournament);
      
      // Запишем результаты для обычных матчей – для простоты считаем, что победителем становится teamA
      // (Также bye-матч уже имеет result: 'bye')
      for (const match of tournament.matches) {
        if (match.result === null) {
          // Убедимся, что мы передаём правильное значение: "teamA"
          tournament = await tournamentService.recordMatchResult(match.id, 'teamA');
        }
      }
      // Проверяем, что все обычные матчи стали сыгранными
      for (const match of tournament.matches) {
        if (match.result !== 'bye') {
          expect(match.played).toBe(true);
          expect(match.result).toBe('teamA');
        }
      }

      // Переход в следующий раунд – новая сетка генерируется на основе победителей текущего раунда
      tournament = await tournamentService.advanceRound(tournament);
      // Если в предыдущем раунде было bye, то в новом раунде должны появиться пары из победителей
      expect(tournament.matches.length).toBeGreaterThanOrEqual(1);
      // Проверяем, что в новом раунде все матчи созданы через фабрику (имеют id)
      tournament.matches.forEach(match => {
        expect(match).toHaveProperty('id');
      });
      // Также предыдущие матчи должны сохраниться в previousMatches (если настроено такое хранение)
      expect(tournament.previousMatches.length).toBeGreaterThan(0);
    });
    test('updateTournament should update tournament details', async () => {
      const tournament = await tournamentService.createTournament(tournamentData);
  
      const updateData = {
        name: 'Updated Tournament Name',
        discipline: 'Updated Discipline',
        startDate: '2025-10-01',
        endDate: '2025-10-10',
        status: 'ongoing'
      };
  
      const updatedTournament = await tournamentService.updateTournament(tournament.id, updateData);
      expect(updatedTournament.name).toBe(updateData.name);
      expect(updatedTournament.discipline).toBe(updateData.discipline);
      expect(new Date(updatedTournament.startDate)).toEqual(new Date(updateData.startDate));
      expect(new Date(updatedTournament.endDate)).toEqual(new Date(updateData.endDate));
      expect(updatedTournament.status).toBe(updateData.status);
    });
    test('updateTeams should update teams and regenerate matches', async () => {
      const tournament = await tournamentService.createTournament(tournamentData);
  
      const teams = [
        { id: "101", name: 'Team A', rating: 100, players: ['a1', 'a2', 'a3', 'a4', 'a5'] },
        { id: "102", name: 'Team B', rating: 90, players: ['b1', 'b2', 'b3', 'b4', 'b5'] }
      ];
  
      const updatedTournament = await tournamentService.updateTeams(tournament.id, teams);
      expect(updatedTournament.teams.length).toBe(2);
      expect(updatedTournament.matches.length).toBe(1); // 2 команды -> 1 матч
    });
  
    test('disqualifyTeam should remove team and regenerate matches', async () => {
      const tournament = await tournamentService.createTournament(tournamentData);
  
      const teams = [
        { id: "101", name: 'Team A', rating: 100, players: ['a1', 'a2', 'a3', 'a4', 'a5'] },
        { id: "102", name: 'Team B', rating: 90, players: ['b1', 'b2', 'b3', 'b4', 'b5'] },
        { id: "103", name: 'Team C', rating: 80, players: ['c1', 'c2', 'c3', 'c4', 'c5'] }
      ];
  
      for (const teamData of teams) {
        await tournamentService.addTeamToTournament(tournament, teamData);
      }
  
      const updatedTournament = await tournamentService.disqualifyTeam(tournament.id, "102");
      expect(updatedTournament.teams.length).toBe(2);
      expect(updatedTournament.matches.length).toBe(1); // 2 команды -> 1 матч
    });
    describe('assignJudge', () => {
      let tournamentService;
    
      beforeEach(() => {

        tournamentService = new TournamentService();
        tournamentService.tournamentRepository = {
          getById: jest.fn().mockResolvedValue({
            id: 2,
            judges: []
          }),
          update: jest.fn().mockImplementation(tournament => Promise.resolve(tournament))
        };
      });
    
      it('должен добавить судью, если его там нет', async () => {
        const judgeData = { id: "1", name: "Лев" };
        const tournament = await tournamentService.assignJudge("2", judgeData);
    
        expect(tournament.judges).toContainEqual(judgeData);
      });
    });
  });
});