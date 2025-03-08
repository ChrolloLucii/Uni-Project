import express from 'express';
import inviteController from '../controllers/inviteController.js';

const inviteRouter = express.Router();

// Регистрация по приглашению
inviteRouter.post('/register-judge', inviteController.register);

// Проверка валидности токена
inviteRouter.get('/verify-token', inviteController.verifyToken);

export default inviteRouter;