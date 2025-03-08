import express from 'express';
import AuthController from '../controllers/AuthController.js';
import InviteController from '../controllers/inviteController.js';
import generateContoller from '../controllers/generaetContoller.js';
const authRouter = express.Router();

authRouter.post('/login', AuthController.login);

authRouter.post('/generate', generateContoller.generateToken);
authRouter.post('/register', InviteController.register);
export default authRouter;