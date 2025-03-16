import TournamentRepository from '../../domain/repositories/tournamentRepository.js'
import TournamentModel from '../models/tournamentModel.js'

export default class TournamentRepositoryImpl extends TournamentRepository {
	async create(tournament) {
		console.log('tournament:', tournament)
		const {
			name,
			description = null,
			startDate = null,
			endDate = null,
			organizer = null,
			discipline = null,
			status = null,
			teams = [],
			matches = [],
			previousMatches = [],
			judges = [],
		} = tournament || {}
		// Дополнительная проверка:
		if (description === undefined) {
			console.error('description отсутствует в tournament')
		}
		const created = await TournamentModel.create({
			name,
			description,
			startDate,
			endDate,
			organizer,
			discipline,
			status,
			teams,
			matches,
			previousMatches,
			judges,
		})
		return created.toJSON()
	}

	async getById(id) {
		const found = await TournamentModel.findByPk(id)
		if (!found) return null
		return {
			id: found.id,
			name: found.name,
			description: found.description,
			startDate: found.startDate,
			endDate: found.endDate,
			organizer: found.organizer,
			discipline: found.discipline,
			status: found.status,
			teams: found.teams,
			matches: found.matches,
			previousMatches: found.previousMatches,
			judges: found.judges,
		}
	}

	async getAll() {
		const tournaments = await TournamentModel.findAll()
		return tournaments.map(t => ({
			id: t.id,
			name: t.name,
			description: t.description,
			startDate: t.startDate,
			endDate: t.endDate,
			organizer: t.organizer,
			discipline: t.discipline,
			status: t.status,
			teams: t.teams,
			matches: t.matches,
			previousMatches: t.previousMatches,
			judges: t.judges,
		}))
	}

	async update(tournament) {
		const {
			id,
			name,
			description,
			startDate,
			endDate,
			organizer,
			discipline,
			status,
			teams,
			matches,
			previousMatches,
			judges,
		} = tournament
		const found = await TournamentModel.findByPk(id)
		if (!found) {
			throw new Error('Tournament not found')
		}
		found.name = name
		found.description = description
		found.startDate = startDate
		found.endDate = endDate
		found.organizer = organizer
		found.discipline = discipline
		found.status = status
		found.teams = teams
		found.matches = matches
		found.previousMatches = previousMatches
		found.judges = judges
		await found.save()
		return {
			id: found.id,
			name: found.name,
			description: found.description,
			startDate: found.startDate,
			endDate: found.endDate,
			organizer: found.organizer,
			discipline: found.discipline,
			status: found.status,
			teams: found.teams,
			matches: found.matches,
			previousMatches: found.previousMatches,
			judges: found.judges,
		}
	}
	async findByMatchId(matchId) {
		// Получаем все турниры и ищем среди них тот, где в массиве matches есть матч с заданным ID
		const tournaments = await TournamentModel.findAll()
		for (let t of tournaments) {
			const data = t.toJSON()
			if (data.matches && Array.isArray(data.matches)) {
				const match = data.matches.find(m => m.id == matchId)
				if (match) {
					return data
				}
			}
		}
		return null
	}
	async deleteTournament(id) {
		const found = await TournamentModel.findByPk(id)
		if (!found) {
			throw new Error('Tournament not found')
		}
		await found.destroy()
	}

	// Дополнительные методы (например, findByMatchId и т.д. но уже потом)
}
