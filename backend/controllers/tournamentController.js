import TournamentServiceApp from "../services/tournamentService.js";

const TournamentController = {
	async createTournament(req, res) {
		try {
			const tournamentData = req.body
			const tournament = await TournamentServiceApp.createTournament(
				tournamentData
			)
			return res.status(201).json(tournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async addTeamToTournament(req, res) {
		try {
			const { tournamentId } = req.params
			if (!tournamentId) {
				return res.status(404).json({ error: 'Tournament id required' })
			}
			const teamData = req.body
			// Вызываем метод addTeamToTournament, который принимает tournamentId и teamData
			const updatedTournament = await TournamentServiceApp.addTeamToTournament(
				tournamentId,
				teamData
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async generateMatches(req, res) {
		try {
			const { tournamentId } = req.params
			if (!tournamentId) {
				return res.status(404).json({ error: 'Tournament id required' })
			}
			const updatedTournament = await TournamentServiceApp.generateMatches(
				tournamentId
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async recordMatchResult(req, res) {
		try {
			const { matchId } = req.params
			const { result } = req.body
			const updatedTournament = await TournamentServiceApp.recordMatchResult(
				matchId,
				result
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async advanceRound(req, res) {
		try {
			const { tournamentId } = req.params
			const updatedTournament = await TournamentServiceApp.advanceRound(
				tournamentId
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async updateTournament(req, res) {
		try {
			const { tournamentId } = req.params
			const updatedData = req.body
			const updatedTournament = await TournamentServiceApp.updateTournament(
				tournamentId,
				updatedData
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async updateTeams(req, res) {
		try {
			const { tournamentId } = req.params
			const teams = req.body

			const updatedTournament = await TournamentServiceApp.updateTeams(
				tournamentId,
				teams
			)

			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async updateMatches(req, res) {
		try {
			const { tournamentId } = req.params
			const matches = req.body
			const updatedTournament = await TournamentServiceApp.updateMatches(
				tournamentId,
				matches
			)

			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async disqualifyTeam(req, res) {
		try {
			const { tournamentId, teamId } = req.params
			const updatedTournament = await TournamentServiceApp.disqualifyTeam(
				tournamentId,
				teamId
			)

			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async getTournament(req, res) {
		try {
			const { tournamentId } = req.params
			const tournament = await TournamentServiceApp.getTournamentById(
				tournamentId
			)
			return res.status(200).json(tournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async getAllTournaments(req, res) {
		try {
			const tournaments = await TournamentServiceApp.getAllTournaments()
			return res.status(200).json(tournaments)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async assignJudge(req, res) {
		try {
			const { tournamentId } = req.params
			const judgeData = req.body
			const updatedTournament = await TournamentServiceApp.assignJudge(
				Number(tournamentId),
				judgeData
			)
			return res.status(200).json(updatedTournament)
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},
	async deleteTournament(req, res) {
		try {
			const { tournamentId } = req.params
			await TournamentServiceApp.deleteTournament(Number(tournamentId))
			return res.status(204).send() //No Content
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}
	},

	async getTournamentTeams(req, res){
		try{
		const {tournamentId} = req.params
		const teams = await TournamentServiceApp.getTournamentTeams(Number(tournamentId))
		return res.status(200).json(teams);
		}
		catch(error){
			return res.status(400).json({error: error.message});
		}
	}
}

export default TournamentController;