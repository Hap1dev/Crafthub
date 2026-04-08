import productRepository from './product.repository.js';

const getAll = async ({ page, limit }) => {
	const skip = (page - 1) * limit;
	const take = limit;
	// Only return active products
	return productRepository.findAll({ 
		skip, 
		take, 
		where: { isActive: true } 
	});
}

const getById = async (id) => {
	const data = await productRepository.findById(id);
	if (!data || !data.isActive) {
		throw new Error('product not found');
	}
	return data;
}

const createProduct = async ({ title, description, image, price, stock, categoryId, isActive, sellerId }) => {
	if(!title || !price || !stock || !categoryId || !image){
		throw new Error('missing required fields');
	}

	// Basic validation for price and stock
	if (price < 0 || stock < 0) {
		throw new Error('price and stock must be positive numbers');
	}

	return productRepository.create({
		title,
		description,
		image,
		price,
		stock,
		categoryId,
		sellerId,
		isActive: isActive !== undefined ? isActive : true
	});
}

const softDelete = async (userId, productId) => {
	const product = await productRepository.findById(productId);
	if (!product) {
		throw new Error('product not found');
	}
	
	if(product.sellerId !== userId){
		throw new Error('you can only delete your own product');
	}

	return productRepository.update(productId, {
		isActive: false
	});
}

const updateProduct = async (userId, productId, newData) => {
	const product = await productRepository.findById(productId);
	if (!product) {
		throw new Error('product not found');
	}

	if(product.sellerId !== userId){
		throw new Error('you can only update your own product');
	}

	return productRepository.update(productId, newData);
}

const productService = {
	createProduct,
	getAll,
	getById,
	softDelete,
	updateProduct
};

export default productService;
