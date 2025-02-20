import express from 'express';
import userRouter from './userRoute.js';
import authRouter from './authRoute.js';
const Myroutes = express.Router();
/**
 * 
 * Пример
 * @module controllers/userController
 * @description Предоставляет функциональность для управления пользователями, включая операции такие как создание, получение, обновление и удаление учетных записей пользователей.
 *
 * @example
 * // Импорт контроллера
 * const userController = require('../controllers/userController');
 *
 * // Создание пользователя:
 * const newUser = userController.createUser({ name: 'John Doe', email: 'john@example.com' });
 *
 * // Получение пользователя:
 * const user = userController.getUser(newUser.id);
 *
 * // Обновление пользователя:
 * userController.updateUser(newUser.id, { email: 'john.doe@example.com' });
 *
 * // Удаление пользователя:
 * userController.deleteUser(newUser.id);
 */

Myroutes.use('/users',userRouter);
Myroutes.use('/auth', authRouter);

export default Myroutes;

