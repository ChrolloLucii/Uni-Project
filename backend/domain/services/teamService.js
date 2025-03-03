
import TeamFactory from '../Factories/TeamFactory.js'
import { validateTeamData } from '../validators/teamValidator.js'

export default class TeamService {
	// Сервис домменого уровня для работы с операциями над командами
	constructor(teamRepository) {
		this.teamRepository = teamRepository
		this.teamFactory = new TeamFactory()
	}

	async createTeam(data) {
  
    const savedTeam = await this.teamRepository.create(data);
    return savedTeam;
  }

  async getTeamById(id) {
    return await this.teamRepository.getTeamById(id);
  }

  async getAllTeams() {
    return await this.teamRepository.getAllTeams();
  }

  async updateTeam(data) {
    const updatedTeam = await this.teamRepository.updateTeam(data);
    return updatedTeam;
  }

  async deleteTeam(id) {
    await this.teamRepository.deleteTeam(id);
  }
}
