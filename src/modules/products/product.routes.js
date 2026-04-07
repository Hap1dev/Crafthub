import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productController from './product.controller.js';
import authenticate from '../../middlewares/authenticate.js';
import authorize from '../../middlewares/authorize.js';

const router = express.Router();

// Multer configuration for product image upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = 'public/uploads/products';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|webp/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error('only images (jpeg, jpg, png, webp) are allowed'));
	}
});

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize(['SELLER']), upload.single('image'), productController.createProduct);
router.delete('/:id', authenticate, authorize(['SELLER']), productController.softDelete);
router.patch('/:id', authenticate, authorize(['SELLER']), upload.single('image'), productController.updateProduct);

export default router;