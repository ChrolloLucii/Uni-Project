import Team from '../entities/Team.js'

export default class TeamFactory {
	/**
	 * Создает экземпляр команды.
	 * @param {Object} data
	 * @param {number|string} [data.id]
	 * @param {string} data.name 
	 * @param {Array<Object>} data.players - Массив объектов игроков
	 * @param {number} [data.captainIndex=0] - Индекс игрока, который будет капитаном
	 * @returns {Team}
	 */
	createTeam({ id, name, players, captainIndex = 0 }) {
		return new Team({ id, name, players, captainIndex })
	}
}
