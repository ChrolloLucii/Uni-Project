
import { Sequelize } from 'sequelize'
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:1234@db:5432/tournament';
const sequelize = new Sequelize(databaseUrl, {
	dialect: 'postgres',
	logging: false,
	dialectOptions: {
	  ssl: process.env.NODE_ENV === 'production' ? {
		require: true,
		rejectUnauthorized: false
	  } : false
	}
  });
  export default sequelize;