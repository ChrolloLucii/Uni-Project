import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import myRoutes from './routes/myRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import sequelize from './infrastructure/orm/sequelize.js'
import tournamentRouter from './routes/tournamentRoutes.js'
import inviteRouter from './routes/inviteRouter.js';
import './infrastructure/models/teamModel.js'
import './infrastructure/models/tournamentModel.js'
import './infrastructure/models/inviteTokenModel.js'

import organizerRouter from './routes/organizerRoutes.js';
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(tournamentRouter);

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


app.use('/api', myRoutes);
app.use('/api/auth', authRouter);
app.use('/teams', teamRouter)
app.use('/api/organizer', organizerRouter);
app.use('/api/invites', inviteRouter);
sequelize
	.sync() 
	.then(() => {
		console.log('База данных успешно синхронизирована')
		app.listen(port, () => {
			console.log('Server is running on port localhost' + port)
		})
	})
	.catch(error => {
		console.error('Ошибка при синхронизации с БД:', error)
	})
export default app;