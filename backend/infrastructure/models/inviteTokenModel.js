import { DataTypes } from 'sequelize';
import sequelize from '../orm/sequelize.js';

const InviteTokenModel = sequelize.define('InviteToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'JUDGE'
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    usedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'invite_tokens',
    timestamps: true
});

export default InviteTokenModel;