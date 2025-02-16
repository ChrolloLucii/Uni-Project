import User from "../entities/User.js";
import Role from "../entities/Role.js";
class UserFactory{
    createUser({id, role = Role.PLAYER, nickname, teamId}){
            if (Object.values(Role).includes(role)){
                return new User(id, role, nickname, teamId);
            }   
            else{
                throw new Error('Invalid role');
            }
    }
    createJudje ({id, nickname}){
        return new User(id, Role.JUDGE, nickname, null);
    }
    createOrganizer ({id, nickname}){
        return new User(id, Role.ORGANIZER, nickname, null);
    }
    createCaptain ({id, nickname, teamId}){
        return new User(id, Role.CAPTAIN, nickname, teamId);
    }
}

export default UserFactory;