import Tournament from '../entities/Tournament.js'
import TournamentFactory from '../Factories/TournamentFactory.js'
import MatchFactory from '../Factories/MatchFactory.js'
import TeamFactory from '../Factories/TeamFactory.js'
import MatchService from './matchService.js'

export default class TournamentService {
  constructor(tournamentRepository, teamRepository, matchService) {
    this.tournamentRepository = tournamentRepository;
    this.teamRepository = teamRepository;
    this.matchService = matchService;

    this.tournamentFactory = new TournamentFactory();
    this.teamFactory = new TeamFactory();
    this.matchFactory = new MatchFactory();
  }

  async createTournament(data) {
    const tournament = this.tournamentFactory.createTournament(data);

    const savedTournament = await this.tournamentRepository.create(tournament);
    return savedTournament;
  }

  async addTeamToTournament(tournament, teamData) {

    const team = this.teamFactory.createTeam(teamData);

    if (!tournament.teams) {
      tournament.teams = [];
    }
    tournament.teams.push(team);

    const updatedTournament = await this.tournamentRepository.update(tournament);
    return updatedTournament;
  }
    
  async generateMatches(tournament) {
    if (!tournament.teams || tournament.teams.length < 2) {
      throw new Error('Not enough teams');
    }
    
    const sortedTeams = [...tournament.teams].sort((a, b) => b.rating - a.rating);

    const matches = this.matchService.generateMatches(sortedTeams, this.matchFactory);
    tournament.matches = matches;

    const updatedTournament = await this.tournamentRepository.update(tournament);
    return updatedTournament;
  }

  async recordMatchResult(matchId, result){
    const tournament = await this.tournamentRepository.findByMatchId(matchId);
    if (!tournament){
      throw new Error('Tournament not found');
    }
    const match = tournament.matches.find(match => match.id == matchId);
    if (!match){
      throw new Error('Match not found');
    }
    match.result = result;
    match.played = true;
    const updatedTournament = await this.tournamentRepository.update(tournament);
    return updatedTournament;
  }

  async advanceRound(tournament){
    const winners = tournament.matches.filter(match => match.played).map(match=>
    {
      if (match.result === 'teamA'){
        return match.teamA;
      }
      else if (match.result === 'teamB'){
        return match.teamB;
      }
      else if (match.result === 'bye'){
        return match.teamA;
      }
    });
    if (winners.length < 2){
      throw new Error('Not enough winners');
    }

    const newMatches = [];
    
    let byeTeam = null;
    if (winners.length % 2 !==0) {
      byeTeam = winners[winners.length-1];
    }
    const numPairs = Math.floor(winners.length/2);

    for (let i = 0; i< numPairs; i++){
    const teamA = winners[i];
    const teamB = winners[winners.length - i -1];
    if (byeTeam && teamB === byeTeam && i === Math.floor(winners.length/2)) {
      break;
    }
    const newMatch = this.matchFactory.createMatch({
      teamA,
      teamB,
      scheduledTime: new Date(),
      played: false,
      result: null
    });
    newMatches.push(newMatch);
  }
  if (byeTeam){
    const byeMatch = this.matchFactory.createMatch({
      teamA: byeTeam,
      teamB: null,
      scheduledTime: new Date(),
      played: true,
      result: 'bye',
      isBye: true
    });
    newMatches.push(byeMatch);
  }
  tournament.previousMatches = tournament.previousMatches ? tournament.previousMatches.concat(tournament.matches) : tournament.matches.slice();

  // Обновляем сетку матчей новым раундом
  tournament.matches = newMatches;
  const updatedTournament = await this.tournamentRepository.update(tournament);
  return updatedTournament;
}
  }