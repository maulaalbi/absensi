// src/routes/user.routes.js
import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import attendanceCheckOutContorller from '../controller/attendanceCheckOutContorller.js';


const router = express.Router();

router.post('/register',authMiddleware , attendanceCheckOutContorller.register );
router.get('/getAll' , attendanceCheckOutContorller.getAll );
router.get('/getCheckOut' , attendanceCheckOutContorller.getCheckOutAll );


export default router;
