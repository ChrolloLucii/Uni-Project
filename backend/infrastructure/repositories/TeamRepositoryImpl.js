import TeamRepository from '../../domain/repositories/TeamRepository.js'
import TeamModel from '../models/teamModel.js'

export default class TeamRepositoryImpl extends TeamRepository {
	async create(team) {
		const { name, players } = team
		const created = await TeamModel.create({ name, players })
		// Возвращаем доменную модель
		return { id: created.id, name: created.name, players: created.players }
	}
    // Возвращает объект команды по id
	async getTeamById(id) {
		const found = await TeamModel.findByPk(id)
		if (!found) return null
		return { id: found.id, name: found.name, players: found.players }
	}
    // Возвращает все команды
	async getAllTeams() {
		const teams = await TeamModel.findAll()
		return teams.map(team => ({
			id: team.id,
			name: team.name,
			players: team.players,
		}))
	}
    // Обновляет команду
	async updateTeam(updatedTeam) {
		const { id, name, players } = updatedTeam
		const team = await TeamModel.findByPk(id)
		if (!team) {
			throw new Error('Team not found')
		}
		team.name = name
		team.players = players
		await team.save()
		return { id: team.id, name: team.name, players: team.players }
	}

	async deleteTeam(id) {
		const team = await TeamModel.findByPk(id)
		if (!team) {
			throw new Error('Team not found')
		}
		await team.destroy()
	}
}
