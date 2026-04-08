import { prisma } from '../../lib/prisma.js';

const findAll = async ({ skip, take, where = {} }) => {
	return prisma.product.findMany({
		where,
		skip,
		take,
		orderBy: { createdAt: 'desc' }
	});
};

const findById = async (id) => {
	return prisma.product.findUnique({
		where: { id }
	});
};

const create = async (data) => {
	return prisma.product.create({
		data
	});
};

const update = async (id, data) => {
	return prisma.product.update({
		where: { id },
		data
	});
};

const productRepository = {
	findAll,
	findById,
	create,
	update
};

export default productRepository;
