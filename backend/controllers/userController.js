import UserAppService from '../services/userAppService.js';

const UserController = {
        async registration(req, res){
            return await UserAppService.registration(req, res);
        },
        async getById(req, res){
            return await UserAppService.getUserById(req, res);
        },
        async getAll(req, res){
            return await UserAppService.getAllUsers(req, res);
        },
        async update(req, res){ 
            return await UserAppService.updateUser(req, res);
        },
        async delete(req, res){ 
            return await UserAppService.deleteUser(req, res);
        }
}

export default UserController;
