import Tournament from '../entities/Tournament.js'
import TournamentFactory from '../Factories/TournamentFactory.js'
import MatchFactory from '../Factories/MatchFactory.js'
import TeamFactory from '../Factories/TeamFactory.js'
import MatchService from './matchService.js'

export default class TournamentService {
	constructor(tournamentRepository, teamRepository, matchService) {
		this.tournamentRepository = tournamentRepository
		this.teamRepository = teamRepository
		this.matchService = matchService

		this.tournamentFactory = new TournamentFactory()
		this.teamFactory = new TeamFactory()
		this.matchFactory = new MatchFactory()
	}

	async createTournament(data) {
		const tournament = this.tournamentFactory.createTournament(data)

		const savedTournament = await this.tournamentRepository.create(tournament)
		return savedTournament
	}

	async addTeamToTournament(tournament, teamData) {
		const team = this.teamFactory.createTeam(teamData)
		if (!Array.isArray(tournament.teams)) tournament.teams = []
		tournament.teams.push(team)
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}

	async generateMatches(tournament) {
		if (!tournament.teams || tournament.teams.length < 2) {
		  throw new Error('Not enough teams');
		}
	  
		const sortedTeams = [...tournament.teams].sort(
		  (a, b) => b.rating - a.rating
		);
	  
		// Генерируем матчи (все будут для первого раунда)
		const matches = this.matchService.generateMatches(
		  sortedTeams,
		  this.matchFactory
		);
	  
		// Устанавливаем номер раунда для всех сгенерированных матчей – раунд 1
		matches.forEach(match => {
		  match.round = 1;
		});
	  
		tournament.matches = matches;
	  
		const updatedTournament = await this.tournamentRepository.update(tournament);
		return updatedTournament;
	  }
	  

	async recordMatchResult(matchId, result) {
		const tournament = await this.tournamentRepository.findByMatchId(matchId)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		const match = tournament.matches.find(match => match.id == matchId)
		if (!match) {
			throw new Error('Match not found')
		}
		match.result = result
		match.played = true
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}

	async advanceRound(tournament) {
		// Найдём максимальный номер раунда из текущих матчей
		const currentRound = Math.max(...tournament.matches.map(match => match.round || 1));
		const winners = [];
		for (const match of tournament.matches) {
		  if (match.played) {
			if (match.result === 'bye') {
			  // Если BYE, команда-победитель – teamA (предполагается, что teamB отсутствует)
			  if (!winners.find(team => team.id === match.teamA.id)) {
				winners.push(match.teamA);
			  }
			} else {
			  winners.push(match.result === 'teamA' ? match.teamA : match.teamB);
			}
		  }
		}
		if (winners.length < 2) {
		  throw new Error('Not enough winners');
		}
	  
		const newMatches = [];
		// Если число победителей нечётное – оставляем последнюю команду на BYE
		let byeTeam = null;
		if (winners.length % 2 !== 0) {
		  byeTeam = winners.pop();
		}
	  
		const numPairs = Math.floor(winners.length / 2);
		for (let i = 0; i < numPairs; i++) {
		  const teamA = winners[i];
		  const teamB = winners[winners.length - i - 1];
		  const newMatch = this.matchFactory.createMatch({
			teamA,
			teamB,
			scheduledTime: new Date(),
			played: false,
			result: null,
		  });
		  // Устанавливаем для нового раунда номер равный текущему + 1
		  newMatch.round = currentRound + 1;
		  newMatches.push(newMatch);
		}
	  
		if (byeTeam) {
		  const byeMatch = this.matchFactory.createMatch({
			teamA: byeTeam,
			teamB: null,
			scheduledTime: new Date(),
			played: true,
			result: 'bye',
			isBye: true,
		  });
		  // Также для bye-матча устанавливаем раунд текущего + 1
		  byeMatch.round = currentRound + 1;
		  newMatches.push(byeMatch);
		}
	  
		// Сохраняем текущие матчи как предыдущие, а новые матчи устанавливаем как текущие
		tournament.previousMatches = tournament.previousMatches
		  ? tournament.previousMatches.concat(tournament.matches)
		  : tournament.matches.slice();
	  
		tournament.matches = newMatches;
		const updatedTournament = await this.tournamentRepository.update(tournament);
		return updatedTournament;
	  }

	async updateTournament(tournamentId, updateData) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		Object.assign(tournament, updateData)
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}

	async updateTeams(tournamentId, teams) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		tournament.teams = teams

		tournament.matches = this.matchService.generateMatches(
			teams,
			this.matchFactory
		)
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}

	async updateMatches(tournamentId, matches) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		tournament.matches = matches
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}
	async disqualifyTeam(tournamentId, teamId) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		tournament.teams = tournament.teams.filter(team => team.id !== teamId)
		tournament.matches = this.matchService.generateMatches(
			tournament.teams,
			this.matchFactory
		)
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}

	async getTournamentById(tournamentId) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		return tournament
	}
	async getAllTournaments() {
		const tournaments = await this.tournamentRepository.getAll()
		return tournaments
	}

	async assignJudge(tournamentId, judgeData) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		if (!Array.isArray(tournament.judges)) {
			tournament.judges = []
		}
		if (!tournament.judges.find(j => j.id === judgeData.id)) {
			tournament.judges.push(judgeData)
		}
		const updatedTournament = await this.tournamentRepository.update(tournament)
		return updatedTournament
	}
  	async deleteTournament(tournamentId) {
		const tournament = await this.tournamentRepository.getById(
			Number(tournamentId)
		)
		if (!tournament) {
			throw new Error('Tournament not found')
		}
		await this.tournamentRepository.delete(tournamentId)
	}

	async getTournamentTeams(tournamentId){
		const tournament = await this.tournamentRepository.getById(Number(tournamentId)
		)
		if (!tournament){
			throw new Error('Tournament not found')
		}
		return tournament.teams;
	}
}
