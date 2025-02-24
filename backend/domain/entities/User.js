import AccessRules from '../rules/AccessRules.js';
import Permission from './Permission.js';

class User {
  constructor(id, role, nickname, username, password, email) {
    this.id = id;
    this.nickname = nickname;
    this.role = role;
    this.username= username;
    this.password = password
    this.email = email;
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