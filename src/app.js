// src/app.js
import express from 'express';
import userRoutes from './modules/auth/routes/userRoute.js';
import scheduleRouter from './modules/schedules/routes/scheduleRoute.js'
import checkInRouter from './modules/attendance/routes/checkInRoute.js'
import checkOutRouter from './modules/attendance/routes/checkOutRoute.js'
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/schedule', scheduleRouter);
app.use('/api/checkIn',checkInRouter );
app.use('/api/checkOut', checkOutRouter );

export default app;
