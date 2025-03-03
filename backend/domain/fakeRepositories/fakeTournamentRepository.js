export default class FakeTournamentRepository {
    constructor() {
        this.tournaments = [];
    }
    async getById(id) {
        return this.tournaments.find(t => t.id == id);
    }
    async create(tournament){
        this.tournaments.push(tournament);
        return tournament;
    }

    async update(tournament) {
        const index = this.tournaments.findIndex(t => t.id == tournament.id);
        if (index == -1) {
            throw new Error('Tournament not found');
        }
        this.tournaments[index] = tournament;
        return tournament;
    }

    async getAll() {
        return this.tournaments;
    }

    async findByMatchId(matchId) {
        return this.tournaments.find(tournament => {
          return tournament.matches && tournament.matches.some(match => match.id === matchId);
        });
      }
}