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
		const data = await productService.createProduct({ ...req.body, sellerId: req.user.id });
		return res.status(200).json({
			message: 'product created sucessfully',
			...data
		});
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const deleteProduct = async(req, res) => {
	try{
		const data = await productService.deleteProduct(req.params.id);
		return res.status(200).json({
			message: 'product deleted successfully',
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
	deleteProduct
}

export default productController;