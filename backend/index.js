import express, { json } from 'express';
const app = express();
const port = process.env.PORT || 4000;

app.use(json());

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
import myRoutes from './routes/myRoutes.js';

app.use('/api', myRoutes);

app.listen(port, () =>{
    console.log("Server is running on port " + port);
})