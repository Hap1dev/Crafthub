import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
		name: user.name,
		email: user.email,
		role: user.role
	};
}

const login = async (data) => {
	// 1. check if user with email exist
	const user = await prisma.user.findUnique({
		where: {
			email: data.email
		}
	});
	if(!user){
		throw new Error('user not found');
	}
	// 2. if yes, compare entered password with correct password
	const match = bcrypt.compare(data.password, user.password);
	// 3. if true, create access token
	if(!match){
		throw new Error('invalid password');
	}
	const payload = {
		id: user.id,
		email: user.email
	}
	const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
	const refreshToken = await jwt.sign({ ...payload, type: 'refresh', jti: crypto.randomBytes(16).toString('hex') }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
	const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
	const refreshTokenExpiresAt = calculateRefreshTokenExpiry();
	await updateUserRefreshToken({
		userId: user.id,
		refreshTokenHash,
		refreshTokenExpiresAt
	});
	// 4. return user
	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		},
		tokens: {
			accessToken,
			refreshToken
		}
	}
}

const refresh = async (refreshToken) => {
	// 1. ensure refreshToken is passed
	if(!refreshToken){
		throw new Error('refresh token is required');
	}
	const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	const userId = decoded.id;
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	if(!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt){
		throw new Error('invalid refresh token');
	}
	const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
	if(!isMatch){
		throw new Error('invalid refresh token');
	}

	if(new Date() > user.refreshTokenExpiresAt){
		throw new Error('refresh token is expired');
	}
	const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user);
	// 2. ensure refreshToken is valid
	// 3. ensure refreshToken is not expired
	// 4. generate new accessToken and refreshToken
	// 5. return access and refresh token
	return {
		newAccessToken,
		newRefreshToken
	};
}

const logout = async (userId) => {
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			refreshTokenHash: null,
			refreshTokenExpiresAt: null
		}
	});
}

const generateTokens = async (user) => {
	const payload = { id: user.id, email: user.email };
	const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
	const refreshToken = await jwt.sign({ ...payload, typ: "refresh", jti: crypto.randomBytes(16).toString('hex') }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
	return { accessToken, refreshToken }
}

const calculateRefreshTokenExpiry = () => {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);
	return expiresAt;
}

const updateUserRefreshToken = async ({ userId, refreshTokenHash, refreshTokenExpiresAt }) => {
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			refreshTokenHash,
			refreshTokenExpiresAt
		}
	});
}

const authService = {
	register,
	login,
	refresh,
	logout
}

export default authService;