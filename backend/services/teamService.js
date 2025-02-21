// backend/services/teamService.js
import TeamFactory from '../factories/TeamFactory.js'
import { validateTeamData } from '../domain/validators/teamValidator.js'

export default class TeamService {
	constructor(teamRepository) {
		this.teamRepository = teamRepository
		this.teamFactory = new TeamFactory()
	}

	async createTeam(data) {
		// Валидируем входные данные
		const errors = validateTeamData(data)
		if (errors.length > 0) {
			throw new Error(errors.join(' '))
		}

		// Создаем команду через фабрику
		const team = this.teamFactory.createTeam(data)

		// Сохраняем команду через репозиторий
		const savedTeam = await this.teamRepository.create(team)

		return savedTeam
	}
}
