import AccessRules from '../rules/AccessRules.js';
import Permission from './Permission.js';

class User {
  constructor(id, nickname, role) {
    this.id = id;
    this.nickname = nickname;
    this.role = role;
  }

  hasPermission(permission) {
    return AccessRules[this.role]?.includes(permission) || false;
  }
  canManageUsers() {
    return this.hasPermission(Permission.MANAGE_USERS);
  }
  canManageTournaments() {
    return this.hasPermission(Permission.MANAGE_TOURNAMENTS);
  }
  canManageJudges() {
    return this.hasPermission(Permission.MANAGE_JUDGES);
  }

  canManageTeams() {
    return this.hasPermission(Permission.MANAGE_TEAMS);
  }
  
  canManageMatches() {
    return this.hasPermission(Permission.MANAGE_MATCHES);
  }

  canViewTournaments() {
    return this.hasPermission(Permission.VIEW_TOURNAMENTS);
  }
}
export default User;