import {v4 as uuidv4} from 'uuid'
import Match from '../entities/Match.js';

export default class MatchFactory {
    createMatch({ id, teamA, teamB, scheduledTime, played, result, isBye = false }) {

    return new Match({
      id: uuidv4(),
      teamA,
      teamB,
      scheduledTime: scheduledTime || new Date(),
      played: played !== undefined ? played : false,
      result: result !== undefined ? result : null,
      bye: isBye
    });
  }
}