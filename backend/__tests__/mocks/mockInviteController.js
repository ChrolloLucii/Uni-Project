import bcrypt from 'bcrypt';
import UserModel from '../../infrastructure/models/userModel.js';
import InviteTokenModel from '../../infrastructure/models/inviteTokenModel.js';

const mockInviteController = {
  register: async (req, res) => {
    try {
      console.log('Mock: Получен запрос на регистрацию судьи', req.body);
      const { token, username, password, nickname, email } = req.body;
      
      // Проверяем токен
      const inviteToken = await InviteTokenModel.findOne({ where: { token } });
      
      if (!inviteToken) {
        console.error('Mock: Токен не найден:', token);
        return res.status(400).json({ message: 'Token not found' });
      }
      
      if (inviteToken.used) {
        console.error('Mock: Токен уже использован:', token);
        return res.status(400).json({ message: 'Token already used' });
      }
      
      const existingUser = await UserModel.findOne({ where: { username } });
      if (existingUser) {
        console.error('Mock: Пользователь уже существует:', username);
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await UserModel.create({
        username,
        password: hashedPassword,
        nickname,
        email,
        role: 'JUDGE'
      });
      
      console.log('Mock: Создан судья с ID:', user.id);
      
      await InviteTokenModel.update(
        { 
          used: true, 
          userId: user.id 
        },
        { 
          where: { token } 
        }
      );
      
      console.log('Mock: Токен помечен как использованный');
      
      return res.status(200).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          nickname: user.nickname
        }
      });
    } catch (error) {
      console.error('Ошибка в мок-контроллере:', error);
      return res.status(500).json({ message: error.message });
    }
  },
  
  verifyToken: async (req, res) => {
    try {
      const { token } = req.query;
      
      const inviteToken = await InviteTokenModel.findOne({ where: { token } });
      
      if (!inviteToken) {
        return res.status(400).json({ valid: false, message: 'Token not found' });
      }
      
      if (inviteToken.used) {
        return res.status(400).json({ valid: false, message: 'Token already used' });
      }
      
      return res.status(200).json({ 
        valid: true, 
        role: inviteToken.role 
      });
    } catch (error) {
      return res.status(500).json({ valid: false, message: error.message });
    }
  }
};

export default mockInviteController;