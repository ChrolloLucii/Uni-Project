import Team from '../entities/Team.js'

export default class TeamFactory {
	/**
	 *  Метод создает объект команды.
	 *
	 * @param {Object} data
	 * @param {number|string} [data.id] // Идентификатор команды (необязательно)
	 * @param {string} data.name // Название команды.
	 * @param {Array<string|object>} data.players - Массив с именами игроков или объектами игроков.
	 * @param {number} [data.captainIndex=0] - Индекс игрока, который будет назначен капитаном.
	 * @returns {Team}
	 */
	createTeam({ id, name, players, captainIndex = 0 }) {
		if (!players || players.length !== 5) {
			throw new Error('Команда должна состоять ровно из 5 игроков.')
		}
        
		if (captainIndex < 0 || captainIndex >= players.length) {
			throw new Error('Некорректный индекс капитана.')
		}

		// Преобразуем каждый элемент массива в объект с полями { name, role }
		const processedPlayers = players.map((player, index) => {
			if (typeof player === 'string') {
				return {
					name: player,
					role: index === captainIndex ? 'CAPTAIN' : 'PLAYER',
				}
			} else if (typeof player === 'object' && player !== null) {
				return {
					name: player.name,
					role: index === captainIndex ? 'CAPTAIN' : 'PLAYER',
				}
			}
			throw new Error('Некорректный формат игрока.')
		})

		return new Team({ id, name, players: processedPlayers })
	}
}
