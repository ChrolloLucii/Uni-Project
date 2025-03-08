import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import repository from '../domain/fakeRepositories/singletonRepo.js';

const secret = '12341234';

const authController = {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            
        
            const user = await repository.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
            }
            
         
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
                return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
            }
            
          
            const token = jwt.sign(
                { 
                    id: user.id, 
                    role: user.role,
                    username: user.username
                }, 
                secret, 
                { expiresIn: '24h' }
            );

            res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.status(200).json({ 
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    nickname: user.nickname
                }
            });
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            return res.status(500).json({ error: 'Ошибка авторизации' });
        }
    }
};

export default authController;