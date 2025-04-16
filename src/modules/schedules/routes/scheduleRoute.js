import express from 'express';
import scheduleController from '../controller/scheduleController.js';

const router = express.Router();

router.post('/register', scheduleController.register );
router.get('/getAll', scheduleController.scheduleAll );


export default router;
