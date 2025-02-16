function validateTournamentData(data) {
	const errors = []

	if (!data.name) errors.push('Название турнира обязательно.')
	if (!data.discipline) errors.push('Название дисциплины обязательно.')
	if (!data.startDate) errors.push('Дата начала обязательна.')
	if (!data.endDate) errors.push('Дата окончания обязательна.')

	// Проверка дат
	const startDate = new Date(data.startDate)
	const endDate = new Date(data.endDate)
	if (startDate > endDate)
		errors.push('Дата начала не может быть позже даты окончания.')

	// Проверка статуса
	const allowedStatuses = ['upcoming', 'ongoing', 'completed']
	if (!allowedStatuses.includes(data.status))
		errors.push('Некорректный статус турнира.')

	// Проверка количества команд (максимум 16)
	if (data.teams && data.teams.length > 16) errors.push('Максимум 16 команд.')

	return errors
}

module.exports = { validateTournamentData }
