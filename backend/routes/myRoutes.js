import express from 'express';
import userRouter from './userRoute.js';
import teamRouter from './teamRoutes.js';
import tournamentRouter from './tournamentRoutes.js';
import judgeRouter from './judgeRoute.js';
const Myroutes = express.Router();

Myroutes.use('/users', userRouter);
Myroutes.use('/teams',teamRouter);
Myroutes.use('/',tournamentRouter);
Myroutes.use('/', judgeRouter);

export default Myroutes;

