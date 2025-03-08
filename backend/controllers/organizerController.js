import inviteServiceInstance from '../infrastructure/di/InviteServiceInstance.js';
import repository from '../domain/fakeRepositories/singletonRepo.js';

const organizerController = {
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await repository.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            
            return res.status(200).json({
                id: user.id,
                name: user.nickname,
                role: user.role
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async generateJudgeToken(req, res) {
        try {

            const organizerId = req.user.id;
            
            const tokenRecord = await inviteServiceInstance.generateInviteToken({ 
                role: 'JUDGE',
                createdBy: organizerId
            });
            
            return res.status(201).json(tokenRecord);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getJudgeTokens(req, res) {
        try {

            const organizerId = req.user.id;
            
            const tokens = await inviteServiceInstance.getTokensByOrganizer(organizerId);
            
            return res.status(200).json(tokens);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteJudgeToken(req, res) {
        try {
            const { tokenId } = req.params;
            const organizerId = req.user.id;
            
            await inviteServiceInstance.deleteToken(tokenId, organizerId);
            
            return res.status(204).send();
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
};

export default organizerController;