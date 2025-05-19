// src/routes/user.routes.js
import express from 'express';
import authController from '../controller/authController.js';
import adminController from '../controller/adminController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', adminController.login );
router.post('/admin/getMe', adminController.getMe );

router.post('/register', authController.register );
router.post('/login', authController.login );
router.post('/getMe',authMiddleware, authController.getMe );
router.post('/getAllUser', authController.getAlluser );
router.get('/getLastAtt', authMiddleware, authController.getLastAtt );
router.get('/getAttByUser/:user_public_id',  authController.getAttByUser );

export default router;
