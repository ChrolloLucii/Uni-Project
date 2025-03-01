import tournamentServiceInstance from "../infrastructure/di/TournamentServiceInstance.js";

const TournamentServiceApp = {
  async createTournament(data) {
    try {
      const tournament = await tournamentServiceInstance.createTournament(data);
      return tournament;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async addTeamToTournament(tournamentId, teamData) {
    try {
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      const updatedTournament = await tournamentServiceInstance.addTeamToTournament(tournament, teamData);
      return updatedTournament;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async generateMatches(tournamentId) {
    try {
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      const updatedTournament = await tournamentServiceInstance.generateMatches(tournament);
      return updatedTournament;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async recordMatchResult(matchId, result){
    try{
      const updatedTournament = await tournamentServiceInstance.recordMatchResult(matchId, result);
      return updatedTournament;
  }
  catch(error){
    throw new Error(error.message);
  }
},
  async advanceRound(tournamentId){
    try{
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      const updatedTournament = await tournamentServiceInstance.advanceRound(tournament);
      return updatedTournament
    }
    catch(error){
      throw new Error(error.message);
    }

  }
};

export default TournamentServiceApp;