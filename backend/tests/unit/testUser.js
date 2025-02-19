import UserService from '../../domain/services/userService.js';
import FakeUserRepository from '../../domain/fakeRepositories/fakeUserRepository.js';
import { beforeEach } from 'node:test';

describe('UserService - Unit Test', () =>{
        let userService;
        let fakeRepo;

        beforeEach( () => {
            fakeRepo = new FakeUserRepository();
            userService = new UserService(fakeRepo); 
        }
    );

        test('Должен Зарегистрировать пользователя', async () => {
            const UserData = {id: 1, nickname: 'test', role: 'PLAYER'};
            const user = await userService.registerUser(UserData);
            expect(user).toEqual(UserData);
        });

        test('Должен получить пользователя по id', async () => {
            const UserData = {id: 2, nickname: 'test2', role: 'ORGANIZER'};
            await userService.registerUser(UserData);
            const user = await userService.getUserById(2);
            expect(user).toEqual(UserData);
        });

        test('Должен обновить пользователя', async () => {
            const UserData = { id : 3, nickname : 'test3', role: 'CAPTAIN'};
            await userService.registerUser(UserData);
            const updatedUser =  await userService.updateUser({ id: 3, nickname: 'test3', role: 'JUDGE'});
            expect(updatedUser).toEqual({ id: 3, nickname: 'test3', role: 'JUDGE'});
        })

        test('Должен вывести всех пользователей', async () => {
            const users = [];
            for (let i = 0; i < 5; i++){
                users.push({id: i, nickname: `test${i}`, role: 'PLAYER'});
            }
            const response = [];
        })
})