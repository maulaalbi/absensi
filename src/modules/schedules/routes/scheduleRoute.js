import express from 'express';
import scheduleController from '../controller/scheduleController.js';
import adminMiddleware from '../../../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/register',adminMiddleware, scheduleController.register );
router.get('/getAll', scheduleController.scheduleAll );
router.get('/scheduleToday', scheduleController.scheduleToday );


export default router;
