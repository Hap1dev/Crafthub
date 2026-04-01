import { prisma } from '../../lib/prisma.js';

const getAll = async ({ page, limit }) => {
	const data = await prisma.product.findMany({
		skip: (page - 1) * limit,
		take: limit,
		orderBy: { createdAt: "desc" }
	});
	return data;
}

const getById = async (id) => {
	const data = await prisma.product.findUnique({
		where: {
			id: id
		}
	});
	return data;
}

const createProduct = async ({ title, description, image, price, stock, categoryId, isActive, sellerId }) => {
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

const deleteProduct = async (id) => {
	const data = await prisma.product.delete({
		where: {
			id: id
		}
	});
	return data;
}

const productService = {
	createProduct,
	getAll,
	getById,
	deleteProduct
};

export default productService;