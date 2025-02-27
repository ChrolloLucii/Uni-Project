
export default class Team { // Класс Team описывает команду в виде объекта
    
	constructor({ id, name, rating, players }) {
		this.id = id
		this.name = name
		this.players = players
		this.rating = rating
	}
}
