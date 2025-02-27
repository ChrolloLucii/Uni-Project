import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'postgres', 
	host: 'localhost', 
	port: 5432,
	username: 'postgres', 
	password: '228red228', 
	database: 'tournament', 
	entities: [__dirname + '/../entities/*.ts'], // путь к сущностям
	synchronize: true, // синхронизация схемы 
})
