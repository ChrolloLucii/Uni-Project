class Match{
    constructor(id, teamA, teamB, scheduledTime, played, result){
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.scheduledTime = scheduledTime;
        this.played = played || false;
        this.result = result || null; // {teamA, teamB, draw} 
    }
}
export default Match;