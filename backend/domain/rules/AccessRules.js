import Role from '../entities/Role.js';
import Permission from '../entities/Permission.js';

//динамически определяем имена свойств объекта.
class AccessRules {
    [Role.ORGANIZER] = {
        [Permission.MANAGE_USERS]: true,
        [Permission.MANAGE_TEAMS]: true,
        [Permission.MANAGE_MATCHES]: true,
        [Permission.VIEW_TOURNAMENTS]: true,
        [Permission.MANAGE_TOURNAMENTS]: true,
        [Permission.MANAGE_JUDJES]: true
    };
    [Role.JUDGE] = {
        [Permission.MANAGE_MATCHES]: true,
        [Permission.MANAGE_TEAMS]: true,
        [Permission.MANAGE_USERS]: true,
        [Permission.VIEW_TOURNAMENTS]: true,
        [Permission.MANAGE_TOURNAMENTS]: true,
        [Permission.MANAGE_JUDJES]: false
    };
    [Role.CAPTAIN] = {
        [Permission.MANAGE_MATCHES]: false,
        [Permission.MANAGE_TEAMS]: true,
        [Permission.MANAGE_USERS]: false,
        [Permission.VIEW_TOURNAMENTS]: true,
        [Permission.MANAGE_TOURNAMENTS]: false,
        [Permission.MANAGE_JUDJES]: false
    };

    [Role.PLAYER] = {
        [Permission.MANAGE_MATCHES]: false,
        [Permission.MANAGE_TEAMS]: false,
        [Permission.MANAGE_USERS]: false,
        [Permission.VIEW_TOURNAMENTS]: true,
        [Permission.MANAGE_TOURNAMENTS]: false,
        [Permission.MANAGE_JUDJES]: false
    };
}
export default AccessRules;
