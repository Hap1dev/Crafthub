import cartRepository from './cart.repository.js';
import productRepository from '../products/product.repository.js';

const getCart = async (userId) => {
	const items = await cartRepository.findItemsByUserId(userId);
	
	// Calculate total price and filter out inactive products just in case
	const activeItems = items.filter(item => item.product.isActive);
	const totalPrice = activeItems.reduce((acc, item) => {
		return acc + (parseFloat(item.product.price) * item.quantity);
	}, 0);

	return {
		items: activeItems,
		totalPrice: parseFloat(totalPrice.toFixed(2))
	};
};

const addToCart = async (userId, productId, quantity = 1) => {
	const product = await productRepository.findById(productId);
	
	if (!product || !product.isActive) {
		throw new Error('product not found or inactive');
	}

	const existingItem = await cartRepository.findItemByUserAndProduct(userId, productId);
	const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

	if (newQuantity > product.stock) {
		throw new Error(`insufficient stock. only ${product.stock} items available`);
	}

	if (newQuantity <= 0) {
		throw new Error('quantity must be greater than 0');
	}

	return cartRepository.upsertItem(userId, productId, newQuantity);
};

const updateQuantity = async (userId, productId, quantity) => {
	const product = await productRepository.findById(productId);
	
	if (!product || !product.isActive) {
		throw new Error('product not found or inactive');
	}

	if (quantity > product.stock) {
		throw new Error(`insufficient stock. only ${product.stock} items available`);
	}

	if (quantity <= 0) {
		// If quantity is 0 or less, we can either remove it or throw error. 
		// Let's remove it for better UX.
		return cartRepository.deleteItem(userId, productId);
	}

	return cartRepository.upsertItem(userId, productId, quantity);
};

const removeFromCart = async (userId, productId) => {
	return cartRepository.deleteItem(userId, productId);
};

const clearCart = async (userId) => {
	return cartRepository.clearCart(userId);
};

const cartService = {
	getCart,
	addToCart,
	updateQuantity,
	removeFromCart,
	clearCart
};

export default cartService;
