import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRouter from './routes/authRoute.js';
import inviteRouter from './routes/inviteRouter.js';
import organizerRouter from './routes/organizerRoutes.js';
import mockInviteController from './__tests__/mocks/mockInviteController.js';
import { authMiddleware, checkRole } from './__tests__/mocks/mockMiddleware.js';

import UserModel from './infrastructure/models/userModel.js';
import InviteTokenModel from './infrastructure/models/inviteTokenModel.js';
import './infrastructure/models/teamModel.js';
import './infrastructure/models/tournamentModel.js';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.post('/api/invites/register-judge', mockInviteController.register);
app.get('/api/invites/verify-token', mockInviteController.verifyToken);


app.use('/api/auth', authRouter);

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
  app.post('/api/organizer/generate-judge-token', authMiddleware, checkRole(['ORGANIZER']), (req, res) => {
    const token = 'generated-token-' + Date.now();
    
    InviteTokenModel.create({
      token,
      organizerId: req.user.id,
      role: 'JUDGE',
      used: false
    })
      .then(inviteToken => {
        res.status(201).json({ 
          token: inviteToken.token,
          id: inviteToken.id,
          role: inviteToken.role
        });
      })
      .catch(err => {
        console.error('Error generating token:', err);
        res.status(500).json({ message: 'Error generating token' });
      });
  });
  
  // Маршрут для получения списка токенов
  app.get('/api/organizer/judge-tokens', authMiddleware, checkRole(['ORGANIZER']), (req, res) => {
    InviteTokenModel.findAll({ 
      where: { organizerId: req.user.id } 
    })
      .then(tokens => {
        res.status(200).json(tokens);
      })
      .catch(err => {
        console.error('Error fetching tokens:', err);
        res.status(500).json({ message: 'Error fetching tokens' });
      });
  });
  
  // Маршрут для удаления токена
  app.delete('/api/organizer/judge-tokens/:id', authMiddleware, checkRole(['ORGANIZER']), (req, res) => {
    const { id } = req.params;
    
    InviteTokenModel.destroy({ 
      where: { 
        id, 
        organizerId: req.user.id 
      } 
    })
      .then(count => {
        if (count === 0) {
          return res.status(404).json({ message: 'Token not found or not authorized' });
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Token deleted successfully' 
        });
      })
      .catch(err => {
        console.error('Error deleting token:', err);
        res.status(500).json({ message: 'Error deleting token' });
      });
  });
  app.post('/api/tournaments', authMiddleware, checkRole(['ORGANIZER']), async (req, res) => {
    try {
      const tournamentData = {
        ...req.body,
        organizer: req.body.organizer || String(req.user.id),
        teams: req.body.teams || [],
        matches: req.body.matches || [],
        previousMatches: req.body.previousMatches || [],
        judges: req.body.judges || []
      };
      
      const tournament = await TournamentModel.create(tournamentData);
      res.status(201).json(tournament);
    } catch (error) {
      console.error('Error creating tournament:', error);
      res.status(400).json({ error: error.message });
    }
  });
  
  
  
export default app;