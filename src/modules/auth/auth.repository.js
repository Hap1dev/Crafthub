import { prisma } from '../../lib/prisma.js';

const findUserByEmail = async (email) => {
	return prisma.user.findUnique({
		where: { email }
	});
};

const findUserById = async (id) => {
	return prisma.user.findUnique({
		where: { id }
	});
};

const createUser = async (data) => {
	return prisma.user.create({
		data
	});
};

const updateUser = async (id, data) => {
	return prisma.user.update({
		where: { id },
		data
	});
};

const findUserByResetToken = async (resetTokenHash) => {
	return prisma.user.findFirst({
		where: {
			resetPasswordToken: resetTokenHash,
			resetPasswordExpiresAt: {
				gt: new Date()
			}
		}
	});
};

const findUserByVerificationToken = async (verificationTokenHash) => {
	return prisma.user.findFirst({
		where: {
			verificationToken: verificationTokenHash,
			verificationTokenExpiresAt: {
				gt: new Date()
			}
		}
	});
};

const authRepository = {
	findUserByEmail,
	findUserById,
	createUser,
	updateUser,
	findUserByResetToken,
	findUserByVerificationToken
};

export default authRepository;
