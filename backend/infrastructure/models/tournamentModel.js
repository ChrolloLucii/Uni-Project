import { DataTypes } from 'sequelize'
import sequelize from '../orm/sequelize.js'

const TournamentModel = sequelize.define(
	'TournamentModel',
	{
		id: {
			field: 'id',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			field: 'name',
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			field: 'description',
			type: DataTypes.STRING,
			allowNull: true,
		},
		startDate: {
			field: 'startDate',
			type: DataTypes.DATE,
			allowNull: false,
		},
		endDate: {
			field: 'endDate',
			type: DataTypes.DATE,
			allowNull: true,
		},
		organizer: {
			field: 'organizer',
			type: DataTypes.STRING,
			allowNull: true,
		},
		discipline: {
			field: 'discipline',
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Unknown',
		},
		status: {
			field: 'status',
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'upcoming',
		},
		teams: {
			field: 'teams',
			type: DataTypes.JSONB,
			allowNull: true,
		},
		matches: {
			field: 'matches',
			type: DataTypes.JSONB,
			allowNull: true,
		},
		previousMatches: {
			field: 'previousMatches',
			type: DataTypes.JSONB,
			allowNull: true,
		},
		judges: {
			field: 'judges',
			type: DataTypes.JSONB,
			allowNull: true,
		},
	},
	{
		tableName: 'Tournament',
		timestamps: false, 
	}
)

export default TournamentModel
