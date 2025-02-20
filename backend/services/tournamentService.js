import Tournament from '../domain/entities/Tournament.js'
import { validateTournamentData } from '../domain/validators/tournamentValidator.js'

export default class TournamentService {
	constructor(tournamentRepository) {
		this.tournamentRepository = tournamentRepository
	}

	async createTournament(data, user) {
		// Проверка, что у пользователя роль ORGANIZER
		if (user.role !== 'ORGANIZER') {
			throw new Error('Нет доступа для создания турнира.')
		}

		// Валидация данных турнира
		const errors = validateTournamentData(data)
		if (errors.length) {
			throw new Error(errors.join(' '))
		}

		// Создаём экземпляр сущности Tournament
		const tournament = new Tournament(data)

		// Сохраняем турнир через репозиторий
		const savedTournament = await this.tournamentRepository.create(tournament)
		return savedTournament
	}
}
