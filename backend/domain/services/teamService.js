
import TeamFactory from '../Factories/TeamFactory.js'
import { validateTeamData } from '../validators/teamValidator.js'

export default class TeamService { // Сервис домменого уровня для работы с операциями над командами
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

	async getTeamById(id) {
        
		return await this.teamRepository.getTeamById(id)
	}

	async getAllTeams() { // Метод getAllTeams возвращает массив всех команд
		return await this.teamRepository.getAllTeams()
	}

	async updateTeam(data) {
		// В данном примере предполагается, что data содержит корректный id и обновленные данные
		const updatedTeam = await this.teamRepository.updateTeam(data)
		return updatedTeam
	}

	async deleteTeam(id) {
		await this.teamRepository.deleteTeam(id)
	}
}
