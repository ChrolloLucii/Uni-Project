import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import myRoutes from './routes/myRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import { AppDataSource } from './config/datasource.js'

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());

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
app.listen(port, () =>{
    console.log("Server is running on port " + port);
})