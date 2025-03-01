import {Router} from 'express';
import TournamentController from '../controllers/tournamentController.js';

const tournamentRouter = Router();

tournamentRouter.post('/tournaments', TournamentController.createTournament);

tournamentRouter.post('/tournaments/:tournamentId/teams', TournamentController.addTeamToTournament);

tournamentRouter.post('/tournaments/:tournamentId/generate-matches', TournamentController.generateMatches);

tournamentRouter.post('/tournaments/:tournamentId/advance-round', TournamentController.advanceRound);

tournamentRouter.post('/matches/:matchId/record-result', TournamentController.recordMatchResult);

export default tournamentRouter;