import productService from './product.service.js';

const create = async (req, res) => {
	try{
		const data = await productService.create({ ...req.body, sellerId: req.user.id });
		return res.status(200).json({
			message: 'product created sucessfully',
			...data
		});
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const productController = {
	create
}

export default productController;