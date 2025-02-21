import jwt from 'jsonwebtoken';
import fakeUserRepository from '../domain/fakeRepositories/fakeUserRepository.js';
const secretKey = '12341234'

const repository = new fakeUserRepository();

const login = async (username, password) => {

    const user = Array.from(repository.users.values()).find(u=> u.username === username);
    if (!user){
        throw new Error('UserNotFound');
    }
    if (user.password !== password){
        throw new Error('InvalidPassword');
    }

    const token = jwt.sign(
        {id : user.id , nickname: user.nickname, role: user.role},
        secretKey,
        {expiresIn: '1h'}
    );
    return token;
};

export default login;