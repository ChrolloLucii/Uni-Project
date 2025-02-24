import User from "../entities/User.js";
import Role from "../entities/Role.js";

class UserFactory{
    createUser({id, role = Role.PLAYER, nickname, username, password, email}){
        const validRoles = [Role.CAPTAIN, Role.JUDGE, Role.ORGANIZER, Role.PLAYER];
        if (validRoles.includes(role)){
                return new User(id, role, nickname, username, password, email);
            }   
            else{
                throw new Error('Invalid role');
            }
    }
    createJudje ({id, nickname}){
        return new User(id, Role.JUDGE, nickname, username, password, email);
    }
    createOrganizer ({id, nickname}){
        return new User(id, Role.ORGANIZER, nickname, username, password, email);
    }
    createCaptain ({id, nickname}){
        return new User(id, Role.CAPTAIN, nickname);
    }
    createPlayer ({id, nickname}){
        return new User(id, Role.PLAYER, nickname);
    }
}

export default UserFactory;