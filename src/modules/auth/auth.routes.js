import express from 'express';
import authController from './auth.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;