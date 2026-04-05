import { prisma } from '../../lib/prisma.js';

const findUserById = async (id) => {
	return prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			avatarUrl: true
		}
	});
};

const updateUser = async (id, data) => {
	return prisma.user.update({
		where: { id },
		data,
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			avatarUrl: true
		}
	});
};

const createAddress = async (userId, data) => {
	return prisma.address.create({
		data: {
			...data,
			userId
		}
	});
};

const findAddressesByUserId = async (userId) => {
	return prisma.address.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});
};

const findAddressByIdAndUser = async (id, userId) => {
	return prisma.address.findFirst({
		where: { id, userId }
	});
};

const updateAddress = async (id, data) => {
	return prisma.address.update({
		where: { id },
		data
	});
};

const unsetOtherDefaultAddresses = async (userId, excludeId) => {
	return prisma.address.updateMany({
		where: {
			userId,
			id: { not: excludeId },
			isDefault: true
		},
		data: {
			isDefault: false
		}
	});
};

const userRepository = {
	findUserById,
	updateUser,
	createAddress,
	findAddressesByUserId,
	findAddressByIdAndUser,
	updateAddress,
	unsetOtherDefaultAddresses
};

export default userRepository;
