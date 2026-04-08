import { prisma } from '../../lib/prisma.js';

const findItemsByUserId = async (userId) => {
	return prisma.cartItem.findMany({
		where: { userId },
		include: {
			product: {
				select: {
					id: true,
					title: true,
					price: true,
					image: true,
					stock: true,
					isActive: true
				}
			}
		}
	});
};

const findItemByUserAndProduct = async (userId, productId) => {
	return prisma.cartItem.findUnique({
		where: {
			userId_productId: { userId, productId }
		}
	});
};

const upsertItem = async (userId, productId, quantity) => {
	return prisma.cartItem.upsert({
		where: {
			userId_productId: { userId, productId }
		},
		update: { quantity },
		create: { userId, productId, quantity }
	});
};

const deleteItem = async (userId, productId) => {
	return prisma.cartItem.delete({
		where: {
			userId_productId: { userId, productId }
		}
	});
};

const clearCart = async (userId) => {
	return prisma.cartItem.deleteMany({
		where: { userId }
	});
};

const cartRepository = {
	findItemsByUserId,
	findItemByUserAndProduct,
	upsertItem,
	deleteItem,
	clearCart
};

export default cartRepository;
