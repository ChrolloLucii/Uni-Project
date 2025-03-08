import inviteServiceInstance from '../infrastructure/di/InviteServiceInstance.js';

const inviteController = {
    register: async (req, res) => {
        try {
            const { token, username, password, nickname, email } = req.body;
            
            const user = await inviteServiceInstance.registerUserFromInvite({
                token, username, password, nickname, email
            });
            
            res.status(200).json({
                message: 'User registered successfully',
                user,
                redirectUrl: '/login'
            });
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    },

    verifyToken: async (req, res) => {
        try {
            const { token } = req.query;
            
            if (!token) {
                return res.status(400).json({ error: 'Token not provided' });
            }
            
            // Проверка валидности токена
            await inviteServiceInstance.verifyInviteToken(token);
            
            return res.status(200).json({ valid: true, role: 'JUDGE' });
        } catch (error) {
            return res.status(400).json({ error: 'Invalid token', message: error.message });
        }
    }
};

export default inviteController;