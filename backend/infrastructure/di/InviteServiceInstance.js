import InviteTokenRepositoryImpl from '../repositories/InviteTokenRepositoryImpl.js';
import InviteService from '../../services/inviteService.js';
import repository from '../../domain/fakeRepositories/singletonRepo.js';
import bcrypt from 'bcrypt'; // Добавьте этот импорт!
const inviteTokenRepository = new InviteTokenRepositoryImpl();

// Обновляем сервис для работы с репозиторием
const inviteServiceInstance = {
    ...InviteService,
    
    // Переопределяем методы для работы с репозиторием
    async generateInviteToken(payload) {
        const { role, createdBy } = payload;
        const finalRole = role || 'JUDGE';
        const tokenPayload = { role: finalRole };
        const tokenValue = InviteService.generateInviteToken(payload);
        
        // Сохраняем токен в базу данных
        return inviteTokenRepository.create({
            token: tokenValue,
            organizerId: createdBy, 
            role: finalRole
        });
    },
    
    async verifyInviteToken(token) {
        // Проверяем JWT
        const decoded = InviteService.verifyInviteToken(token);
        
        // Проверяем наличие в БД и статус
        const tokenRecord = await inviteTokenRepository.findByToken(token);
        if (!tokenRecord) {
            throw new Error('Token not found in database');
        }
        
        if (tokenRecord.used) {
            throw new Error('Token already used');
        }
        
        return decoded;
    },
    
    async registerUserFromInvite({ token, username, password, nickname, email }) {
        // Проверка токена через JWT
        const inviteData = InviteService.verifyInviteToken(token);
        
        // Проверка наличия токена в БД
        const tokenRecord = await inviteTokenRepository.findByToken(token);
        if (!tokenRecord) {
            throw new Error('Token not found in database');
        }
        
        if (tokenRecord.used) {
            throw new Error('Token already used');
        }
        
        // Хеширование пароля - добавляем эту часть
        const saltRounds = 10;
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error('Ошибка хеширования:', error);
            hashedPassword = password; // Временно для отладки
        }
        
        // Создание пользователя с хешированным паролем
        const user = {
            role: inviteData.role,
            nickname,
            username,
            password: hashedPassword, // Используем хешированный пароль
            email
        };
        
        console.log('Регистрация судьи:', { username, email, role: inviteData.role }); // Для отладки
        
        // Создаем пользователя через репозиторий
        const createdUser = await repository.create(user);
        
        // Помечаем токен как использованный
        await inviteTokenRepository.markAsUsed(token, createdUser.id);
        
        return createdUser;
    },
    
    async getTokensByOrganizer(organizerId) {
        return inviteTokenRepository.findByOrganizer(organizerId);
    },
    
    async deleteToken(id, organizerId) {
        const token = await inviteTokenRepository.findById(id);
        if (!token) {
            throw new Error('Token not found');
        }
        
        if (token.organizerId !== organizerId) {
            throw new Error('Unauthorized: Token belongs to another organizer');
        }
        
        await inviteTokenRepository.delete(id);
    }
};

export default inviteServiceInstance;