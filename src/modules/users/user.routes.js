import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userController from './user.controller.js';
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

// Multer configuration for avatar upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = 'public/uploads/avatars';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error('only images (jpeg, jpg, png) are allowed'));
	}
});

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', upload.single('avatar'), userController.updateAvatar);

// Address routes
router.post('/addresses', userController.createAddress);
router.get('/addresses', userController.getAddresses);
router.patch('/addresses/:id', userController.updateAddress);

export default router;
