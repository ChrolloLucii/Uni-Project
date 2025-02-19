// Сервис домменого уровня для работы с операциями над пользователями 
// Реализация операций регистрации пользователя, получения, обновления и удаления.
// Сервис использует фабрику для создания пользователя и --> обращается к репозиторию для сохранения данных


import UserFactory from "../Factories/UserFactory.js";
//import UserRepositoryInterface from "../repositories/userRepositoryInterface";


class UserService {
    constructor(userRepository){
        this.userRepository = userRepository;
    }
    async registerUser({id, nickname, role}){
        const user = UserFactory.createUser({id, nickname, role});
        return await this.userRepository.createUser(user);

    }
    async getUserById(id) {
        return await this.userRepository.findById(id);
      }
    
      async getAllUsers() {
        return await this.userRepository.findAll();
      }
    
      async updateUser(user) {
        return await this.userRepository.update(user);
      }
    
      async deleteUser(id) {
        return await this.userRepository.delete(id);
      }
    }
    
    export default UserService;