import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import axios from 'axios'

import myRoutes from './routes/myRoutes.js'
import teamRouter from './routes/teamRoutes.js'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'

import sequelize from './infrastructure/orm/sequelize.js'

import tournamentRouter from './routes/tournamentRoutes.js'
import inviteRouter from './routes/inviteRouter.js'
import './infrastructure/models/teamModel.js'
import './infrastructure/models/tournamentModel.js'
import './infrastructure/models/inviteTokenModel.js'

import organizerRouter from './routes/organizerRoutes.js'

// Gigachat
import { initGigachatSocket } from './infrastructure/websocket/gigachatSocket.js'
import TournamentRepositoryImpl from './infrastructure/repositories/TournamentRepositoryImpl.js'
import GigachatService from './domain/services/GigachatService.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('__tests__/unit'))

/**
 * Модуль маршрутов.
 *
 * Этот модуль обрабатывает маршрутизацию в приложении. Он определяет и экспортирует
 * все конфигурации маршрутов, используемые для сопоставления HTTP-запросов с соответствующими
 * контроллерами или функциями обработки. Используй этот модуль для интеграции
 * логики маршрутизации в основную инициализацию приложения.
 *
 * @module routes/myRoutes
 */

app.use('/api', myRoutes)
app.use('/api/auth', authRouter)
app.use('/teams', teamRouter)
app.use('/api/organizer', organizerRouter)
app.use('/api/invites', inviteRouter)
app.use(tournamentRouter)

const httpServer = http.createServer(app)

const tournamentRepository = new TournamentRepositoryImpl()
const gigachatApiKey =
	'YzY3MTczMDgtMTY0Yy00YzkxLTlkZjEtYTA4ZjNiZmNlMTAyOmJjNWIxMWQxLWNhZmUtNGJhMC1hZGUwLTY2YzNlZmNlYjNjYw=='
const gigachatService = new GigachatService(
	tournamentRepository,
	gigachatApiKey
)

initGigachatSocket(httpServer, gigachatService)

sequelize
	.sync()
	.then(() => {
		console.log('База данных успешно синхронизирована')
		httpServer.listen(port, () => {
			console.log('Server is running on port localhost:' + port)
		})
	})
	.catch(error => {
		console.error('Ошибка при синхронизации с БД:', error)
	})

export default app
