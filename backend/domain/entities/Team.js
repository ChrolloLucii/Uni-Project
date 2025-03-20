export default class Team {
	constructor({ id, name, players, captainIndex = 0 }) {
		if (!name) {
			throw new Error('Название команды обязательно.')
		}
		if (!Array.isArray(players) || players.length !== 5) {
			throw new Error('Команда должна состоять ровно из 5 игроков.')
		}
		players.forEach(player => {
			if (!player.name || typeof player.rating !== 'number') {
				throw new Error('Каждый игрок должен иметь никнейм и числовой рейтинг.')
			}
		})

		this.id = id
		this.name = name
		// Проставляем роль "CAPTAIN" игроку с индексом captainIndex, остальные получают "PLAYER"
		this.players = players.map((player, index) => ({
			name: player.name,
			rating: player.rating,
			role: index === captainIndex ? 'CAPTAIN' : 'PLAYER',
		}))

		//средний рейтинг
		const totalRating = this.players.reduce(
			(sum, player) => sum + player.rating,
			0
		)
		this.teamRating = totalRating / this.players.length
	}
}
