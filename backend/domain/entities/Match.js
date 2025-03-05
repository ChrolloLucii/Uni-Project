class Match {
  constructor({ id, teamA, teamB, scheduledTime, played, result, round, isBye }) {
    this.id = id;
    this.teamA = teamA;
    this.teamB = teamB;
    this.scheduledTime = scheduledTime;
    this.played = played || false;
    this.result = result || null;
    this.round = round || 1;
    this.isBye = isBye || false;
  }
}
export default Match;