import Team from '../entities/Team.js'

export default class TeamFactory {
  createTeam(data) {
    return new Team({
      id: data.id, 
      name: data.name,
      rating: data.rating,
      players: data.players || []
    });
  }
}