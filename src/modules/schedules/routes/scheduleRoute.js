import express from 'express';
import scheduleController from '../controller/scheduleController.js';

const router = express.Router();

router.post('/register', scheduleController.register );
router.get('/getAll', scheduleController.scheduleAll );
router.get('/scheduleToday', scheduleController.scheduleToday );


export default router;
