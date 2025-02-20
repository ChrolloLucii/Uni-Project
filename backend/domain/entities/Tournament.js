class Tournament {
	constructor({ id, name, discipline, startDate, endDate, status, teams }) {
		this.id = id // Идентификатор турнира
		this.name = name // Название турнира
		this.discipline = discipline // Название дисциплины
		this.startDate = new Date(startDate) // Дата начала турнира
		this.endDate = new Date(endDate) // Дата окончания турнира
		this.status = status // 'upcoming', 'ongoing', 'completed'
		this.teams = teams || [] // Количетсво названий команд (максимум 16)
	}
}
export default Tournament