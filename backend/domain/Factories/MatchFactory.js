import Match from '../entities/Match.js';

export default class MatchFactory {
    createMatch({ id, teamA, teamB, scheduledTime, played, result }) {

    return new Match({
        
      id: id || Date.now(),
      teamA,
      teamB,
      scheduledTime: scheduledTime || new Date(),
      played: played !== undefined ? played : false,
      result: result !== undefined ? result : null
    });
  }
}