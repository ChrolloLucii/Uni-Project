import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import myRoutes from './routes/myRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import sequelize from './infrastructure/orm/sequelize.js'
import './infrastructure/models/teamModel.js'

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

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
app.use('/auth', authRouter);
app.use('/teams', teamRouter)
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