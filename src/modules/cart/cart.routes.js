import express from 'express';
import cartController from './cart.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.patch('/:productId', cartController.updateQuantity);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
