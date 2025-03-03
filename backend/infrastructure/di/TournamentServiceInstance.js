import TournamentRepositoryImpl from '../../infrastructure/repositories/TournamentRepositoryImpl.js'
import TournamentService from '../../domain/services/tournamentService.js'
import MatchService from '../../domain/services/matchService.js'
import teamRepository from '../../domain/fakeRepositories/singletonTeamRepository.js'

const matchService = new MatchService()
const tournamentRepository = new TournamentRepositoryImpl()
const tournamentServiceInstance = new TournamentService(
	tournamentRepository,
	teamRepository,
	matchService
)
export default tournamentServiceInstance
