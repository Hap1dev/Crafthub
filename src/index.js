import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

app.listen(PORT, () => {
	console.log(`Server Listening to Port ${PORT}`);
});