// backend/tests/tournamentServiceTest.js
import assert from 'assert'
import TournamentService from '../services/tournamentService.js'

// Фейковый репозиторий для имитации сохранения турнира
const fakeTournamentRepository = {
	async create(tournament) {
		// Имитация сохранения: возвращаем турнир с присвоенным id
		return { id: 1, ...tournament }
	},
}

const tournamentService = new TournamentService(fakeTournamentRepository)

const validTournamentData = {
    id: 1,
	name: 'Champions League',
	discipline: 'Football',
	startDate: '2025-09-01',
	endDate: '2025-09-10',
	status: 'upcoming',
	teams: ['Team 1', 'Team 2'],
}

const organizerUser = { role: 'ORGANIZER' }
const nonOrganizerUser = { role: 'PLAYER' }

async function runTests() {
	// Тест 1: Успешное создание турнира
	try {
		const result = await tournamentService.createTournament(
			validTournamentData,
			organizerUser
		)
		assert.strictEqual(result.id, 1, 'У турнира должен быть id = 1')
		assert.strictEqual(
			result.name,
			validTournamentData.name,
			'Название турнира должно совпадать'
		)
		console.log('✔ Тест: успешное создание турнира пройден')
	} catch (err) {
		console.error('✖ Тест: успешное создание турнира провален:', err.message)
	}

	// Тест 2: Ошибка, если пользователь не имеет роль ORGANIZER
	try {
		await tournamentService.createTournament(
			validTournamentData,
			nonOrganizerUser
		)
		console.error(
			'✖ Тест: создание турнира не-организатором должно провалиться, но прошло'
		)
	} catch (err) {
		assert(
			err.message.includes('Нет доступа'),
			'Ошибка должна сообщать о недостатке прав'
		)
		console.log('✔ Тест: проверка роли не-организатора пройдена')
	}

	// Тест 3: Ошибка при отсутствии названия турнира
	try {
		const invalidData = { ...validTournamentData, name: '' }
		await tournamentService.createTournament(invalidData, organizerUser)
		console.error(
			'✖ Тест: создание турнира без названия должно провалиться, но прошло'
		)
	} catch (err) {
		assert(
			err.message.includes('Название турнира обязательно'),
			'Ошибка должна сообщать о пустом названии'
		)
		console.log('✔ Тест: проверка отсутствия названия турнира пройдена')
	}

	// Тест 4: Ошибка при превышении лимита команд (более 16)
	try {
		const invalidData = {
			...validTournamentData,
			teams: Array(17).fill('Team'),
		}
		await tournamentService.createTournament(invalidData, organizerUser)
		console.error(
			'✖ Тест: создание турнира с более чем 16 командами должно провалиться, но прошло'
		)
	} catch (err) {
		assert(
			err.message.includes('Максимум 16 команд'),
			'Ошибка должна сообщать о превышении лимита команд'
		)
		console.log('✔ Тест: проверка лимита команд пройдена')
	}
}

runTests()
