import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import JudgeController from '../controllers/judgeController.js';

const judgeRouter = express.Router();
judgeRouter.get('/judges', authMiddleware, JudgeController.getJudges);
export default judgeRouter;