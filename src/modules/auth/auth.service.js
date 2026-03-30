import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

const register = async (data) => {
	const existingUser = await prisma.user.findUnique({
		where: {
			email: data.email
		}
	});

	if(existingUser){
		throw new Error('user already exist');
	}

	const passwordHash = await bcrypt.hash(data.password, 10);
	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			password: passwordHash,
			role: data.role
		}
	});

	return {
		id: user.id,
		email: user.email,
		role: user.role
	};
}

const login = async (data) => {
	
}

const authService = {
	register
}

export default authService;