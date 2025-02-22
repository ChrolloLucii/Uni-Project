
export default class Team { // Класс Team описывает команду в виде объекта
    
	constructor({ id, name, players }) {
		if (!name) {
			throw new Error('Название команды обязательно.')
		}
		if (!Array.isArray(players) || players.length !== 5) {
			throw new Error('Команда должна состоять ровно из 5 игроков.')
		}
		const captainCount = players.filter(
			player => player.role === 'CAPTAIN' // Проверяем, что у игрока роль капитана
		).length
		if (captainCount !== 1) {
			throw new Error('В команде должен быть ровно один капитан.')
		}

		this.id = id
		this.name = name
		this.players = players
	}
}
