// src/routes/user.routes.js
import express from 'express';
import attendanceCheckInContorller from '../controller/attendanceCheckInContorller.js';
import authMiddleware from '../../../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register',authMiddleware , attendanceCheckInContorller.register );
router.get('/getAll' , attendanceCheckInContorller.getAll );


export default router;
