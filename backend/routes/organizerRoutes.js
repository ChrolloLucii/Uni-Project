import express from 'express';
import organizerController from '../controllers/organizerController.js';
import { authMiddleware, checkRole } from '../middleware/authMiddleware.js';

const organizerRouter = express.Router();

// Получение профиля организатора
organizerRouter.get('/profile', authMiddleware, checkRole(['ORGANIZER']), organizerController.getProfile);

// Генерация токена для судьи
organizerRouter.post('/generate-judge-token', authMiddleware, checkRole(['ORGANIZER']), organizerController.generateJudgeToken);

// Получение токенов организатора
organizerRouter.get('/judge-tokens', authMiddleware, checkRole(['ORGANIZER']), organizerController.getJudgeTokens);

// Удаление токена
organizerRouter.delete('/judge-tokens/:tokenId', authMiddleware, checkRole(['ORGANIZER']), organizerController.deleteJudgeToken);

export default organizerRouter;