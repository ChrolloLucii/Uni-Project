import TournamentService from "../../domain/services/tournamentService";
import FakeTournamentRepository from "../../domain/fakeRepositories/fakeTournamentRepository";
import MatchService from "../../domain/services/matchService";

import {v4 as uuidv4} from 'uuid';
describe('Автоматическое продвижение раундов', () => {
    let tournamentService;
    let tournamentRepository;
    let matchService;
    let tournament;
    
    beforeEach(async () => {
        tournamentRepository = new FakeTournamentRepository();
        matchService = new MatchService();
        tournamentService = new TournamentService(tournamentRepository, null, matchService);
        
        // Создаем тестовый турнир
        tournament = await tournamentService.createTournament({
            id: 1,
            name: "Тестовый турнир",
            discipline: "Тестовая дисциплина",
            teams: [
                { id: "101", name: "Team A", rating: 100 },
                { id: "102", name: "Team B", rating: 90 },
                { id: "103", name: "Team C", rating: 80 },
                { id: "104", name: "Team D", rating: 70 }
            ]
        });
        
        // Генерируем матчи
        tournament = await tournamentService.generateMatches(tournament);
    });
    
    test('должен автоматически продвигать раунд после записи результата последнего матча', async () => {
        // Получаем первые два матча
        const match1 = tournament.matches[0];
        const match2 = tournament.matches[1];
        
        // Записываем результат первого матча
        await tournamentService.recordMatchResult(match1.id, "teamA");
        
        // Записываем результат второго матча, это должно вызвать авто-продвижение
        const updatedTournament = await tournamentService.recordMatchResult(match2.id, "teamB");
        
        // Проверяем, что был создан новый раунд
        expect(updatedTournament.matches.length).toBe(1);
        expect(updatedTournament.matches[0].round).toBe(2);
        
        // Проверяем, что старые матчи перенесены в previousMatches
        expect(updatedTournament.previousMatches.length).toBe(2);
    });
});