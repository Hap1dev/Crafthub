import express from 'express';
import path from 'path';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';
import userRoutes from './modules/users/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
	console.log(`Server Listening to Port ${PORT}`);
});