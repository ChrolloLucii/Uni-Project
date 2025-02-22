export function validateTeamData(data) {
	const errors = []

	if (!data.name) {
		errors.push('Название команды обязательно.')
	}

	if (!Array.isArray(data.players) || data.players.length !== 5) {
		errors.push('Команда должна состоять ровно из 5 игроков.')
	}

	// Можно проверить captainIndex, если он есть
	if (data.captainIndex !== undefined) {
		if (
			typeof data.captainIndex !== 'number' ||
			data.captainIndex < 0 ||
			data.captainIndex >= data.players.length
		) {
			errors.push('Некорректный индекс капитана.')
		}
	}

	return errors
}
