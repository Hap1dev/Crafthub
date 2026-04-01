import { prisma } from '../../lib/prisma.js';

const create = async ({ title, description, image, price, stock, categoryId, isActive, sellerId }) => {
	if(!title || !price || !stock || !categoryId){
		throw new Error('missing required fields')
	}

	const data = await prisma.product.create({
		data: {
			title,
			description,
			image,
			price,
			stock,
			categoryId,
			sellerId,
			isActive
		}
	});

	return data;
}

const productService = {
	create
};

export default productService;