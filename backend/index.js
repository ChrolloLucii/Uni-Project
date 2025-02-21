import express from 'express';
import myRoutes from './routes/myRoutes.js';
import teamRouter from './routes/teamRoutes.js';

import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 4000;

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
app.use('/teams', teamRouter)
app.listen(port, () =>{
    console.log("Server is running on port " + port);
})