export default class FakeMatchRepository {
    constructor() {
        this.matches = [];
    }
    async create(match) {
        this.matches.push(match);
        return match;
    }

    async getAll() {
        return this.matches;
      }


}