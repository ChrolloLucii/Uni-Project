import {Router} from 'express';
import TournamentController from '../controllers/tournamentController.js';

const tournamentRouter = Router();

tournamentRouter.post('/tournaments', TournamentController.createTournament);

tournamentRouter.post('/tournaments/:tournamentId/teams', TournamentController.addTeamToTournament);

tournamentRouter.post('/tournaments/:tournamentId/generate-matches', TournamentController.generateMatches);

tournamentRouter.post('/tournaments/:tournamentId/advance-round', TournamentController.advanceRound);

tournamentRouter.post('/matches/:matchId/record-result', TournamentController.recordMatchResult);

tournamentRouter.put('/tournaments/:tournamentId', TournamentController.updateTournament);

tournamentRouter.put('/tournaments/:tournamentId/teams', TournamentController.updateTeams);

tournamentRouter.put('/tournaments/:tournamentId/matches', TournamentController.updateMatches);

tournamentRouter.put('/tournaments/:tournamentId/teams/:teamId/disqualify', TournamentController.disqualifyTeam);

tournamentRouter.get('/tournaments', TournamentController.getAllTournaments);
tournamentRouter.get('/tournaments/:tournamentId', TournamentController.getTournament);
tournamentRouter.put('/tournaments/:tournamentId/judges', TournamentController.assignJudge);
export default tournamentRouter;