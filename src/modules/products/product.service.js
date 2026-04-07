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
	if(!title || !price || !stock || !categoryId || !image){
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

const softDelete = async (userId, productId) => {
	const product = await prisma.product.findUnique({
		where: {
			id: productId
		}
	});
	if(product.sellerId !== userId){
		throw new Error('you can only delete your own product');
	}
	const data = await prisma.product.update({
		where: {
			id: productId
		},
		data: {
			isActive: false
		}
	});
	return data;
}

const updateProduct = async (userId, productId, newData) => {
	const product = await prisma.product.findUnique({
		where: {
			id: productId
		}
	});
	if(product.sellerId !== userId){
		throw new Error('you can only update your own product');
	}
	const data = await prisma.product.update({
		where: { id: productId },
		data: newData
	});
	return data;
}

const productService = {
	createProduct,
	getAll,
	getById,
	softDelete,
	updateProduct
};

export default productService;