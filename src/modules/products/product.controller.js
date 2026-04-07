import productService from './product.service.js';

const getAll = async (req, res) => {
	try{
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const data = await productService.getAll({ page, limit });
		return res.status(200).json({ products: data });
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const getById = async (req, res) => {
	try{
		const data = await productService.getById(req.params.id);
		return res.status(200).json(data);
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const createProduct = async (req, res) => {
	try{
		const productData = { ...req.body, sellerId: req.user.id };
		if (req.file) {
			productData.image = `/uploads/products/${req.file.filename}`;
		}
		
		// Convert price, stock and isActive to correct types as they come as strings in multipart/form-data
		if (productData.price) productData.price = parseFloat(productData.price);
		if (productData.stock) productData.stock = parseInt(productData.stock);
		if (productData.isActive !== undefined) {
			productData.isActive = productData.isActive === 'true' || productData.isActive === true;
		}

		const data = await productService.createProduct(productData);
		return res.status(200).json({
			message: 'product created sucessfully',
			...data
		});
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const softDelete = async(req, res) => {
	try{
		const data = await productService.softDelete(req.user.id, req.params.id);
		return res.status(200).json({
			message: 'product deleted successfully',
			product: data
		});
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const updateProduct = async (req, res) => {
	try{
		const updateData = { ...req.body };
		if (req.file) {
			updateData.image = `/uploads/products/${req.file.filename}`;
		}

		// Convert price, stock and isActive to correct types as they come as strings in multipart/form-data
		if (updateData.price) updateData.price = parseFloat(updateData.price);
		if (updateData.stock) updateData.stock = parseInt(updateData.stock);
		if (updateData.isActive !== undefined) {
			updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
		}

		const data = await productService.updateProduct(req.user.id, req.params.id, updateData);
		return res.status(200).json({
			message: 'product updated successfully',
			product: data
		});
	}catch(error){	
		return res.status(500).json({ error: error.message });
	}
}

const productController = {
	createProduct,
	getAll,
	getById,
	softDelete,
	updateProduct
}

export default productController;