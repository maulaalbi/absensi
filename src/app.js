// src/app.js
import express from 'express';
import userRoutes from './modules/auth/routes/userRoute.js';
import scheduleRouter from './modules/schedules/routes/scheduleRoute.js'
import checkInRouter from './modules/attendance/routes/checkInRoute.js'
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/schedule', scheduleRouter);
app.use('/api/checkIn',checkInRouter );

export default app;
