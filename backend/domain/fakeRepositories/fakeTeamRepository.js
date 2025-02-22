
export default class fakeTeamRepository { // Экспортируем класс fakeTeamRepository
	constructor() {
		this.teams = []
		this.currentId = 1
	}

	async create(team) { // Метод create принимает команду и добавляет ее в массив команд
		team.id = this.currentId++
		this.teams.push(team)
		return team
	}

	async getTeamById(id) { // Метод getTeamById принимает id команды и возвращает команду с таким id
		return this.teams.find(team => team.id === id)
	}

	async getAllTeams() { // Метод getAllTeams возвращает массив всех команд
		return this.teams
	}

	async updateTeam(updatedTeam) { // Метод updateTeam принимает обновленную команду и обновляет ее в массиве команд
		const index = this.teams.findIndex(team => team.id === updatedTeam.id)
		if (index === -1) {
			throw new Error('Team not found')
		}
		this.teams[index] = updatedTeam
		return updatedTeam
	}

	async deleteTeam(id) { // Метод deleteTeam принимает id команды и удаляет ее из массива команд
		const index = this.teams.findIndex(team => team.id === id)
		if (index === -1) {
			throw new Error('Team not found')
		}
		this.teams.splice(index, 1)
	}
}
