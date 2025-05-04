// src/routes/user.routes.js
import express from 'express';
import attendanceCheckInContorller from '../controller/attendanceCheckInContorller.js';
import authMiddleware from '../../../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register',authMiddleware , attendanceCheckInContorller.register );
router.get('/getAll' , attendanceCheckInContorller.getAll );
router.get('/getCheckIn' , attendanceCheckInContorller.getCheckInAll );
router.get('/getCheckInToday' , attendanceCheckInContorller.getCheckInToday );


export default router;
