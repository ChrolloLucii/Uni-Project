// backend/controllers/teamController.js
import TeamService from '../domain/services/teamService.js'
import TeamRepositoryImpl from '../infrastructure/repositories/TeamRepositoryImpl.js'

const repository = new TeamRepositoryImpl()
const teamService = new TeamService(repository)

export default {
async registration(req, res) {
  try {
    const { name, players, rating } = req.body;
    const team = await teamService.createTeam({ name, players, rating });
    return res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
},
   // реализация метода getTeamById
	async getTeamById(req, res) {
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

	async getAllTeams(req, res) {
		try {
			const teams = await teamService.getAllTeams()
			res.status(200).json(teams)
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	async updateTeam(req, res) {
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
