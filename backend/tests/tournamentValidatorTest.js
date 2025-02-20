// backend/tests/tournamentValidatorTest.js
import assert from 'assert'
import { validateTournamentData } from '../domain/validators/tournamentValidator.js'

function runValidatorTests() {
	// Тест: отсутствие названия турнира
	let data = {
		discipline: 'Football',
		startDate: '2025-09-01',
		endDate: '2025-09-10',
		status: 'upcoming',
		teams: [],
	}
	let errors = validateTournamentData(data)
	assert(
		errors.includes('Название турнира обязательно.'),
		'Должна быть ошибка по отсутствию названия турнира'
	)

	// Тест: отсутствие дисциплины
	data = {
		name: 'Champions League',
		startDate: '2025-09-01',
		endDate: '2025-09-10',
		status: 'upcoming',
		teams: [],
	}
	errors = validateTournamentData(data)
	assert(
		errors.includes('Название дисциплины обязательно.'),
		'Должна быть ошибка по отсутствию дисциплины'
	)

	// Тест: дата начала позже даты окончания
	data = {
		name: 'Champions League',
		discipline: 'Football',
		startDate: '2025-09-11',
		endDate: '2025-09-10',
		status: 'upcoming',
		teams: [],
	}
	errors = validateTournamentData(data)
	assert(
		errors.includes('Дата начала не может быть позже даты окончания.'),
		'Должна быть ошибка по датам'
	)

	// Тест: некорректный статус турнира
	data = {
		name: 'Champions League',
		discipline: 'Football',
		startDate: '2025-09-01',
		endDate: '2025-09-10',
		status: 'invalidStatus',
		teams: [],
	}
	errors = validateTournamentData(data)
	assert(
		errors.includes('Некорректный статус турнира.'),
		'Должна быть ошибка по статусу'
	)

	// Тест: превышение лимита команд
	data = {
		name: 'Champions League',
		discipline: 'Football',
		startDate: '2025-09-01',
		endDate: '2025-09-10',
		status: 'upcoming',
		teams: Array(18).fill('Team'),
	}
	errors = validateTournamentData(data)
	assert(
		errors.includes('Максимум 16 команд.'),
		'Должна быть ошибка по количеству команд'
	)

	// Тест: корректные данные
	data = {
		name: 'Champions League',
		discipline: 'Football',
		startDate: '2025-09-01',
		endDate: '2025-09-10',
		status: 'upcoming',
		teams: ['Team 1', 'Team 2'],
	}
	errors = validateTournamentData(data)
	assert.strictEqual(errors.length, 0, 'Ошибок в валидаторе быть не должно')

	console.log('Все тесты валидатора турнира прошли успешно!')
}

runValidatorTests()
