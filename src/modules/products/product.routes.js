import express from 'express';
import productController from './product.controller.js';
import authenticate from '../../middlewares/authenticate.js';
import authorize from '../../middlewares/authorize.js';

const router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize(['SELLER']), productController.createProduct);
router.delete('/:id', authenticate, authorize(['SELLER']), productController.softDelete);
router.patch('/:id', authenticate, authorize(['SELLER']), productController.updateProduct);

export default router;