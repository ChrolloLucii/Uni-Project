import bcrypt from 'bcrypt';
import sequelize from '../infrastructure/orm/sequelize.js';
import UserModel from '../infrastructure/models/userModel.js';
import InviteTokenModel from '../infrastructure/models/inviteTokenModel.js';

const createOrganizer = async () => {
    try {
       
        await sequelize.authenticate();
        console.log('Соединение с базой данных установлено');
        
      
        console.log('Синхронизация моделей с базой данных...');
        await UserModel.sync({ force: true }); 
        await InviteTokenModel.sync({ force: true });
        console.log('Модели синхронизированы');
        
     
        const saltRounds = 10;
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
       
        const organizer = await UserModel.create({
            username: 'admin',
            nickname: 'Организатор',
            password: hashedPassword,
            email: 'admin@example.com',
            role: 'ORGANIZER'
        });
        
        console.log('Организатор успешно создан:', organizer.username);
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        await sequelize.close();
    }
};

createOrganizer();