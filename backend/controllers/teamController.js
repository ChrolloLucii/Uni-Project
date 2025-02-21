import TeamService from '../domain/services/teamService.js'
import FakeTeamRepository from '../domain/fakeRepositories/fakeTeamRepository.js'

const repository = new FakeTeamRepository() // Создаем экземпляр репозитория для команд
const teamService = new TeamService(repository) // Создаем экземпляр сервиса для команд

export default {
	async registration(req, res) {
		try {
			// Ожидаем, что в теле запроса передадут: id, name, players и опционально captainIndex
			const { id, name, players, captainIndex } = req.body
			const team = await teamService.createTeam({
				id,
				name,
				players,
				captainIndex,
			})
			return res.status(201).json(team) // Отправляем созданную команду
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	async getTeamById(req, res) { // Метод getTeamById возвращает команду по id
		try {
			const { id } = req.params
			const team = await teamService.getTeamById(Number(id))
			if (team) {
				res.status(200).json(team)
			} else {
				res.status(404).json({ message: 'Team not found' })
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	async getAllTeams(req, res) { // Метод getAllTeams возвращает массив всех команд
		try {
			const teams = await teamService.getAllTeams()
			res.status(200).json(teams)
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	async updateTeam(req, res) { // Метод updateTeam обновляет команду
		try {
			const teamData = req.body
			const updatedTeam = await teamService.updateTeam(teamData)
			res.status(200).json(updatedTeam)
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	async deleteTeam(req, res) {
		try {
			const { id } = req.params
			await teamService.deleteTeam(Number(id))
			res.status(204).send()
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},
}
