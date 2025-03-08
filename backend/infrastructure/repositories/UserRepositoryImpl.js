import UserModel from '../models/userModel.js';

class UserRepositoryImpl {
    async create(user) {
        const created = await UserModel.create(user);
        return created.toJSON();
    }
    
    async findById(id) {
        const user = await UserModel.findByPk(id);
        return user ? user.toJSON() : null;
    }
    
    async findByUsername(username) {
        const user = await UserModel.findOne({ where: { username } });
        return user ? user.toJSON() : null;
    }
    
    async update(user) {
        const { id } = user;
        const found = await UserModel.findByPk(id);
        if (!found) throw new Error('User not found');
        
        await found.update(user);
        return found.toJSON();
    }
    
    async delete(id) {
        const user = await UserModel.findByPk(id);
        if (!user) throw new Error('User not found');
        
        await user.destroy();
    }
    
    async findAll() {
        const users = await UserModel.findAll();
        return users.map(user => user.toJSON());
    }
}

export default UserRepositoryImpl;