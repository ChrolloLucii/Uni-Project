import tournamentRepository from '../../domain/fakeRepositories/singletonTournamentsRepository.js';
import TournamentService from '../../domain/services/TournamentService.js';
import MatchService from '../../domain/services/matchService.js';
import teamRepository from '../../domain/fakeRepositories/singletonTeamRepository.js';


const matchService = new MatchService();
const tournamentServiceInstance = new TournamentService(tournamentRepository, teamRepository, matchService);
export default tournamentServiceInstance;