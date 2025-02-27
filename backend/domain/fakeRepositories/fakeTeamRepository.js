
export default class fakeTeamRepository { // Экспортируем класс fakeTeamRepository
	constructor() {
		this.teams = [];
	}

	async create(team) {
		this.teams.push(team)
		return team
	}

	async findById(id) { // принимает id команды и возвращает команду с таким id
		return this.teams.find(team => team.id === id)
	}

	async getAllTeams() { //возвращает массив всех команд
		return this.teams
	}

	async updateTeam(updatedTeam) { // принимает обновленную команду и обновляет ее в массиве команд
		const index = this.teams.findIndex(team => team.id === updatedTeam.id)
		if (index === -1) {
			throw new Error('Team not found')
		}
		this.teams[index] = updatedTeam
		return updatedTeam
	}

	async deleteTeam(id) { // принимает id команды и удаляет ее из массива команд
		const index = this.teams.findIndex(team => team.id === id)
		if (index === -1) {
			throw new Error('Team not found')
		}
		this.teams.splice(index, 1)
	}
}
