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

  },
  async updateTournament(tournamentId, updatedData){
    try{
    const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      const updatedTournament = await tournamentServiceInstance.updateTournament(tournamentId, updatedData);
      return updatedTournament;
  }
  catch(error){
    throw new Error(error.message);
  }

  },
  async updateTeams(tournamentId, teams) {
    try{
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      tournament.teams = teams;

      tournament.matches = tournamentServiceInstance.matchService.generateMatches(teams, tournamentServiceInstance.matchFactory);

      const updatedTournament = await tournamentServiceInstance.update(tournament);
      return updatedTournament;

    }
    catch(error){
      throw new Error(error.message);
    }
  },

  async updateMatches(tournamentId, matches){
    try{
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      tournament.matches = matches;
      const updatedTournament = await tournamentServiceInstance.updateMatches(tournament, matches);
      return updatedTournament;
    }
    catch(error){
      throw new Error(error.message);
    }
  },
  async disqualifyTeam(tournamentId, teamId){
    try{
     const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      tournament.teams = tournament.teams.filter(team=> team.id !== teamId);

      tournament.matches = tournamentServiceInstance.matchService.generateMatches(tournament.teams, tournamentServiceInstance.matchFactory);
      
      const updatedTournament = await tournamentServiceInstance.update(tournament);
      return updatedTournament;
    }
    catch(error){
      throw new Error(error.message);
    }
  },
  async getTournamentById(tournamentId){
    try{
      const tournament = await tournamentServiceInstance.getTournamentById(Number(tournamentId));
      return tournament;
    }
    catch(error){
      throw new Error(error.message);
    }
  },
  async getAllTournaments(){
    try{
      const tournaments = await tournamentServiceInstance.getAllTournaments();
      return tournaments;
    }
    
    catch(error){
      throw new Error(error.message)
    } 
  },
  async assignJudge(tournamentId, judgeData){
    try{
      const tournament = await tournamentServiceInstance.tournamentRepository.getById(Number(tournamentId));
      if (!tournament) {
        throw new Error('Tournament not found');
      }
      const updatedTournament = await tournamentServiceInstance.assignJudge(tournament, judgeData);
      return updatedTournament;
    }
    catch(error){
      throw new Error(error.message);
    }
  }
};

export default TournamentServiceApp;