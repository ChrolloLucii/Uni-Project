
import { DataTypes } from 'sequelize'
import sequelize from '../orm/sequelize.js'

const TeamModel = sequelize.define(
	'Team',
	{
		// Автоматически будет создан id (primary key)
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Храним массив игроков как JSON (в каждом игроке есть name и role)
		players: {
			type: DataTypes.JSONB, 
			allowNull: false,
		},
	},
	{
		tableName: 'teams',
		timestamps: true, // createdAt, updatedAt
	}
)

export default TeamModel
