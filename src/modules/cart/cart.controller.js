import cartService from './cart.service.js';

const getCart = async (req, res) => {
	try {
		const cart = await cartService.getCart(req.user.id);
		return res.status(200).json(cart);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		if (!productId) {
			return res.status(400).json({ error: 'productId is required' });
		}

		await cartService.addToCart(req.user.id, productId, quantity || 1);
		
		const updatedCart = await cartService.getCart(req.user.id);
		return res.status(200).json({
			message: 'item added to cart successfully',
			cart: updatedCart
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateQuantity = async (req, res) => {
	try {
		const { productId } = req.params;
		const { quantity } = req.body;

		if (quantity === undefined) {
			return res.status(400).json({ error: 'quantity is required' });
		}

		await cartService.updateQuantity(req.user.id, productId, quantity);
		
		const updatedCart = await cartService.getCart(req.user.id);
		return res.status(200).json({
			message: 'cart updated successfully',
			cart: updatedCart
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const removeFromCart = async (req, res) => {
	try {
		const { productId } = req.params;
		await cartService.removeFromCart(req.user.id, productId);
		
		const updatedCart = await cartService.getCart(req.user.id);
		return res.status(200).json({
			message: 'item removed from cart',
			cart: updatedCart
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const clearCart = async (req, res) => {
	try {
		await cartService.clearCart(req.user.id);
		return res.status(200).json({
			message: 'cart cleared successfully',
			cart: { items: [], totalPrice: 0 }
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const cartController = {
	getCart,
	addToCart,
	updateQuantity,
	removeFromCart,
	clearCart
};

export default cartController;
