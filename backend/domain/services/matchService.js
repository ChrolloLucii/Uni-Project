export default class MatchService {

    generateMatches(sortedTeams, matchFactory) {
        const matches = [];
        const numPairs = Math.floor(sortedTeams.length / 2);

        for (let i = 0; i<numPairs; i ++){
            const teamA = sortedTeams[i];
            const teamB = sortedTeams[sortedTeams.length - i - 1];
            const match = matchFactory.createMatch({teamA, teamB
, scheduledTime: new Date(),
played: false,
result: null
            

            });
            matches.push(match);
            
        }

        if (sortedTeams.length % 2 === 1 ){
            const byeTeam = sortedTeams[numPairs];
            matches.push({bye: true, team: byeTeam});

        }
        return matches;
    }

}