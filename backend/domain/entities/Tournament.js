class Tournament {
	constructor({ id, name, discipline, startDate, endDate, status, teams, matches, previousMatches, judges }) {
		this.id = id 
		this.name = name 
		this.discipline = discipline 
		this.startDate = new Date(startDate) 
		this.endDate = new Date(endDate) 
		this.status = status // 'upcoming', 'ongoing', 'completed'
		this.teams = teams // Количетсво названий команд (максимум 16)
		this.matches = matches
		this.previousMatches = previousMatches || []
		this.judges = judges || [];
	}
}
export default Tournament