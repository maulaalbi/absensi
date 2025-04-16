// src/routes/user.routes.js
import express from 'express';
import authController from '../controller/authController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login );
router.post('/getMe',authMiddleware, authController.getMe );
router.post('/getAllUser', authController.getAlluser );

export default router;
