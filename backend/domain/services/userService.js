// Сервис домменого уровня для работы с операциями над пользователями 
// Реализация операций регистрации пользователя, получения, обновления и удаления.
// Сервис использует фабрику для создания пользователя и --> обращается к репозиторию для сохранения данных


import UserFactory from "../Factories/UserFactory.js"; // импорт фабрики для создания пользователя
//import UserRepositoryInterface from "../repositories/userRepositoryInterface";
import tournamentServiceInstance from "../../infrastructure/di/TournamentServiceInstance.js";

class UserService {
    constructor(userRepository){
        this.userRepository = userRepository;
        this.userFactory = new UserFactory();
    }
    async registerUser({id, role, nickname, username, password, email}){
        const user = this.userFactory.createUser({id, role, nickname, username, password, email});
        return await this.userRepository.create(user);

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
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error('Пользователь не найден');
        
        if (user.role === 'JUDGE') {
            const allTournaments = await tournamentServiceInstance.getAllTournaments();
            
            for (const tournament of allTournaments) {
                if (Array.isArray(tournament.judges) && 
                    tournament.judges.some(j => j.id === id || j.id === String(id))) {
                    
                    tournament.judges = tournament.judges.filter(j => 
                        j.id !== id && j.id !== String(id)
                    );
                    
                    await tournamentServiceInstance.updateTournament(
                        tournament.id, 
                        { judges: tournament.judges }
                    );
                }
            }
        }
        
        return await this.userRepository.delete(id);
    }
}
    
    export default UserService;