import TournamentServiceApp from "../services/tournamentService.js";

const TournamentController = {
  async createTournament(req, res) {
    try {
      const tournamentData = req.body;
      const tournament = await TournamentServiceApp.createTournament(tournamentData);
      return res.status(201).json(tournament);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async addTeamToTournament(req, res) {
    try {
      const { tournamentId } = req.params;
      if (!tournamentId) {
        return res.status(404).json({ error: 'Tournament id required' });
      }
      const teamData = req.body;
      // Вызываем метод addTeamToTournament, который принимает tournamentId и teamData
      const updatedTournament = await TournamentServiceApp.addTeamToTournament(tournamentId, teamData);
      return res.status(200).json(updatedTournament);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async generateMatches(req, res) {
    try {
      const { tournamentId } = req.params;
      if (!tournamentId) {
        return res.status(404).json({ error: 'Tournament id required' });
      }
      const updatedTournament = await TournamentServiceApp.generateMatches(tournamentId);
      return res.status(200).json(updatedTournament);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async recordMatchResult(req, res){
    try{
      const {matchId} = req.params;
      const {result} = req.body;
      const updatedTournament = await TournamentServiceApp.recordMatchResult(matchId, result);
      return res.status(200).json(updatedTournament);
    }
    catch(error){
      return res.status(400).json({error: error.message})
    }
  },
  async advanceRound(req, res){
    try{
      const {tournamentId} = req.params;
      const updatedTournament = await TournamentServiceApp.advanceRound(tournamentId);
      return res.status(200).json(updatedTournament);
    }
    catch(error){
      return res.status(400).json({error: error.message})
    }
  }
};

export default TournamentController;