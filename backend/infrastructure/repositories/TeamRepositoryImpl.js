// backend/infrastructure/repositories/TeamRepositoryImpl.js
import TeamRepository from '../../domain/repositories/TeamRepository.js'
import TeamModel from '../models/teamModel.js'

export default class TeamRepositoryImpl extends TeamRepository {
	async create(team) {
		const { name, captain, players, rating } = team

		const created = await TeamModel.create({
			name,
			players, // Массив
			rating,
		})

		// Возвращаем то, что нужно сервису
		return {
			id_team: created.id_team,
			name: created.name,
			players: created.players,
			rating: created.rating,
		}
	}

	async getTeamById(id) {
		// Ищем команду по id и возвращаем ее
		const found = await TeamModel.findByPk(id)
		if (!found) return null
		return {
			id_team: found.id_team,
			name: found.name,
			players: found.players,
			rating: found.rating,
		}
	}

	async getAllTeams() {
		 // Получаем все команды из базы данных и возвращаем их
		const teams = await TeamModel.findAll()
		return teams.map(team => ({
			id_team: team.id_team,
			name: team.name,
			players: team.players,
			rating: team.rating,
		}))
	}

	async updateTeam(updatedTeam) {
		const { id_team, name, captain, players, rating } = updatedTeam
		const team = await TeamModel.findByPk(id_team)
		if (!team) {
			throw new Error('Team not found')
		}
		team.name = name
		team.players = players
		team.rating = rating
		await team.save()

		return {
			id_team: team.id_team,
			name: team.name,
			players: team.players,
			rating: team.rating,
		}
	}

	async deleteTeam(id) {
		const team = await TeamModel.findByPk(id)
		if (!team) {
			throw new Error('Team not found')
		}
		await team.destroy()
	}
}
