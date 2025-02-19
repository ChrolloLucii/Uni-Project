import express from 'express';
import userController from '../controllers/userController.js';
const userRouter = express.Router();

// Маршрут для регистрации нового пользователя
userRouter.post('/', userController.registration);

// Маршрут для получения пользователя по id
userRouter.get('/:id', userController.getById);

// Маршрут для получения списка всех пользователей
userRouter.get('/', userController.getAll);

// Маршрут для обновления данных пользователя
userRouter.put('/', userController.update);

// Маршрут для удаления пользователя по id
userRouter.delete('/:id', userController.delete);

export default userRouter;