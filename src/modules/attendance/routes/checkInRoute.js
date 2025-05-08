// src/routes/user.routes.js
import express from 'express';
import attendanceCheckInContorller from '../controller/attendanceCheckInContorller.js';
import authMiddleware from '../../../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register',authMiddleware , attendanceCheckInContorller.register );
router.get('/getAll' , attendanceCheckInContorller.getAll );
router.get('/getAttByCheck' , attendanceCheckInContorller.getAttByCheck );
router.get('/getCheckIn' , attendanceCheckInContorller.getCheckInAll );
router.get('/getCheckInToday' , attendanceCheckInContorller.getCheckInToday );
router.get('/sumCheck' ,authMiddleware, attendanceCheckInContorller.sumCheckIn );
router.get('/checkInByTime/:year/:month' ,authMiddleware, attendanceCheckInContorller.checkInByTime );


export default router;
