import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRouter from './routes/authRoute.js';
import inviteRouter from './routes/inviteRouter.js';
import organizerRouter from './routes/organizerRoutes.js';
import mockInviteController from './__tests__/mocks/mockInviteController.js';
import { authMiddleware, checkRole } from './__tests__/mocks/mockMiddleware.js';
// Импортируем все необходимые модели для тестирования
import './infrastructure/models/userModel.js';
import './infrastructure/models/inviteTokenModel.js';
import './infrastructure/models/teamModel.js';
import './infrastructure/models/tournamentModel.js';

// Создаем экземпляр приложения для тестов
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ВАЖНО: Специальные маршруты для тестирования должны идти ПЕРЕД
// импортированными маршрутами, чтобы они имели приоритет
app.post('/api/invites/register-judge', mockInviteController.register);
app.get('/api/invites/verify-token', mockInviteController.verifyToken);

// Стандартные маршруты API
app.use('/api/auth', authRouter);
// ВАЖНО: Сначала идут специальные маршруты, потом общие
app.use('/api/invites', inviteRouter);
app.use('/api/organizer', organizerRouter);
app.get('/api/organizer/profile', authMiddleware, (req, res) => {
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      nickname: req.user.nickname || 'Test User'
    });
  });
  
  // Маршрут для тестирования checkRole middleware
  app.get('/api/organizer/judge-tokens', authMiddleware, checkRole(['ORGANIZER']), (req, res) => {
    res.status(200).json([]);
  });

export default app;