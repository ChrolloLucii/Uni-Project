import Team from '../entities/Team.js'

import {v4 as uuid} from 'uuid';

export default class TeamFactory {
  createTeam(data) {
    return new Team({
      id: data.id || uuid(),
      name: data.name,
      rating: data.rating,
      players: data.players || []
    });
  }
}