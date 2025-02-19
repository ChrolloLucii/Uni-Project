import User from "../entities/User.js";
import Role from "../entities/Role.js";

class UserFactory{
    createUser({id, role = Role.PLAYER, nickname}){
        const validRoles = [Role.CAPTAIN, Role.JUDGE, Role.ORGANIZER, Role.PLAYER];
        if (validRoles.includes(role)){
                return new User(id, role, nickname);
            }   
            else{
                throw new Error('Invalid role');
            }
    }
    createJudje ({id, nickname}){
        return new User(id, Role.JUDGE, nickname);
    }
    createOrganizer ({id, nickname}){
        return new User(id, Role.ORGANIZER, nickname);
    }
    createCaptain ({id, nickname}){
        return new User(id, Role.CAPTAIN, nickname);
    }
    createPlayer ({id, nickname}){
        return new User(id, Role.PLAYER, nickname);
    }
}

export default UserFactory;