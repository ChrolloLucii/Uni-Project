export default class FakeTournamentRepository {
    constructor() {
        this.tournaments = [];
    }

    async create(tournament){
        this.tournaments.push(tournament);
        return tournament;
    }

    async update(tournament){
        const index = this.tournaments.findIndex(t => t.id === tournament.id);
        if (index === -1){
            throw new Error('Tournament not found');
        }
        this.tournaments[index] = tournament;
        return tournament;

    }


    async getAll(){
        return this.tournaments;
    }
}