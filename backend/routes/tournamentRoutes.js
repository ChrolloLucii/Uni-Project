import {Router} from 'express';
import TournamentController from '../controllers/tournamentController.js';

const tournamentRouter = Router();

tournamentRouter.post('/tournaments', TournamentController.createTournament);

tournamentRouter.post('/tournaments/:tournamentId/teams', TournamentController.addTeamToTournament);

tournamentRouter.post('/tournaments/:tournamentId/generate-matches', TournamentController.generateMatches);

export default tournamentRouter;