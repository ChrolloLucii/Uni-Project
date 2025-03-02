class Tournament {
	constructor({
		id,
		name,
		discipline,
		description,
		startDate,
		endDate,
		status,
		teams,
		matches,
		previousMatches,
		judges,
	}) {
		this.id = id
		this.name = name
		this.description = description
		this.discipline = discipline
		this.startDate = new Date(startDate)
		this.endDate = new Date(endDate)
		this.status = status // 'upcoming', 'ongoing', 'completed'
		this.teams = teams || []
		this.matches = matches || []
		this.previousMatches = previousMatches || []
		this.judges = judges || []
	}
}
export default Tournament