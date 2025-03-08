import InviteTokenRepository from '../../domain/repositories/inviteTokenRepository.js';
import InviteTokenModel from '../models/inviteTokenModel.js';

export default class InviteTokenRepositoryImpl extends InviteTokenRepository {
    async create(token) {
        const { token: tokenValue, organizerId, role } = token;
        
        const created = await InviteTokenModel.create({
            token: tokenValue,
            organizerId,
            role,
            used: false
        });
        
        return created.toJSON();
    }
    
    async findById(id) {
        const found = await InviteTokenModel.findByPk(id);
        if (!found) return null;
        return found.toJSON();
    }
    
    async findByToken(tokenValue) {
        const found = await InviteTokenModel.findOne({
            where: { token: tokenValue }
        });
        
        if (!found) return null;
        return found.toJSON();
    }
    
    async findByOrganizer(organizerId) {
        const tokens = await InviteTokenModel.findAll({
            where: { organizerId },
            order: [['createdAt', 'DESC']]
        });
        
        return tokens.map(token => token.toJSON());
    }
    
    async update(token) {
        const { id, token: tokenValue, organizerId, role, used, usedAt, usedBy } = token;
        
        const found = await InviteTokenModel.findByPk(id);
        if (!found) {
            throw new Error('Token not found');
        }
        
        found.token = tokenValue;
        found.organizerId = organizerId;
        found.role = role;
        found.used = used;
        found.usedAt = usedAt;
        found.usedBy = usedBy;
        
        await found.save();
        
        return found.toJSON();
    }
    
    async delete(id) {
        const found = await InviteTokenModel.findByPk(id);
        if (!found) {
            throw new Error('Token not found');
        }
        
        await found.destroy();
    }
    
    async markAsUsed(tokenValue, userId) {
        const found = await InviteTokenModel.findOne({
            where: { token: tokenValue }
        });
        
        if (!found) {
            throw new Error('Token not found');
        }
        
        if (found.used) {
            throw new Error('Token already used');
        }
        
        found.used = true;
        found.usedAt = new Date();
        found.usedBy = userId;
        
        await found.save();
        
        return found.toJSON();
    }
}