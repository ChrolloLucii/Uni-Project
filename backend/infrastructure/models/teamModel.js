import { DataTypes } from 'sequelize'
import sequelize from '../orm/sequelize.js'

const TeamModel = sequelize.define(
	'TeamModel',
	{
		id: {
			field: 'id_team',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			field: 'name',
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		players: {
			field: 'players',
			type: DataTypes.JSONB,
			allowNull: true,
		},
		teamRating: {
			field: 'teamRating',
			type: DataTypes.FLOAT, 
			allowNull: true,
		},
	},
	{
		tableName: 'Team',
		timestamps: false,
	}
)

export default TeamModel
