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
}