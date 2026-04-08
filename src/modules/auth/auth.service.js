import authRepository from './auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mailer from '../../lib/mailer.js';

const register = async (data) => {
	const existingUser = await authRepository.findUserByEmail(data.email);

	if(existingUser){
		throw new Error('user already exist');
	}

	const verificationToken = crypto.randomBytes(32).toString('hex');
	const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
	const verificationTokenExpiresAt = new Date();
	verificationTokenExpiresAt.setHours(verificationTokenExpiresAt.getHours() + 24);

	const passwordHash = await bcrypt.hash(data.password, 10);
	const user = await authRepository.createUser({
		name: data.name,
		email: data.email,
		password: passwordHash,
		role: data.role,
		verificationToken: verificationTokenHash,
		verificationTokenExpiresAt
	});

	await mailer.sendVerificationEmail(user.email, verificationToken);

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		isVerified: user.isVerified
	};
}

const login = async (data) => {
	const user = await authRepository.findUserByEmail(data.email);
	if(!user){
		throw new Error('invalid credentials');
	}

	if (!user.isVerified) {
		throw new Error('please verify your email before logging in');
	}

	const match = await bcrypt.compare(data.password, user.password);
	if(!match){
		throw new Error('invalid credentials');
	}

	const { accessToken, refreshToken } = await generateTokens(user);
	const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
	const refreshTokenExpiresAt = calculateRefreshTokenExpiry();
	
	await updateUserRefreshToken({
		userId: user.id,
		refreshTokenHash,
		refreshTokenExpiresAt
	});

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
	if(!refreshToken){
		throw new Error('refresh token is required');
	}
	const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	const userId = decoded.id;
	
	const user = await authRepository.findUserById(userId);
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
	
	const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
	const newRefreshTokenExpiresAt = calculateRefreshTokenExpiry();
	
	await updateUserRefreshToken({
		userId: user.id,
		refreshTokenHash: newRefreshTokenHash,
		refreshTokenExpiresAt: newRefreshTokenExpiresAt
	});

	return {
		newAccessToken,
		newRefreshToken
	};
}

const logout = async (userId) => {
	await authRepository.updateUser(userId, {
		refreshTokenHash: null,
		refreshTokenExpiresAt: null
	});
}

const forgotPassword = async (email) => {
	const user = await authRepository.findUserByEmail(email);
	if(!user){
		throw new Error('user not found');
	}

	const resetToken = crypto.randomBytes(32).toString('hex');
	const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 1);

	await authRepository.updateUser(user.id, {
		resetPasswordToken: resetTokenHash,
		resetPasswordExpiresAt: expiresAt
	});

	await mailer.sendResetPasswordEmail(user.email, resetToken);
}

const resetPassword = async (data) => {
	const { token, newPassword } = data;
	const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

	const user = await authRepository.findUserByResetToken(resetTokenHash);

	if (!user) {
		throw new Error('invalid or expired reset token');
	}

	const passwordHash = await bcrypt.hash(newPassword, 10);
	await authRepository.updateUser(user.id, {
		password: passwordHash,
		resetPasswordToken: null,
		resetPasswordExpiresAt: null,
		refreshTokenHash: null,
		refreshTokenExpiresAt: null
	});
}

const verifyEmail = async (token) => {
	const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');

	const user = await authRepository.findUserByVerificationToken(verificationTokenHash);

	if (!user) {
		throw new Error('invalid or expired verification token');
	}

	await authRepository.updateUser(user.id, {
		isVerified: true,
		verificationToken: null,
		verificationTokenExpiresAt: null
	});
}

const resendVerification = async (email) => {
	const user = await authRepository.findUserByEmail(email);

	if (!user) {
		throw new Error('user not found');
	}

	if (user.isVerified) {
		throw new Error('user already verified');
	}

	const verificationToken = crypto.randomBytes(32).toString('hex');
	const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
	const verificationTokenExpiresAt = new Date();
	verificationTokenExpiresAt.setHours(verificationTokenExpiresAt.getHours() + 24);

	await authRepository.updateUser(user.id, {
		verificationToken: verificationTokenHash,
		verificationTokenExpiresAt
	});

	await mailer.sendVerificationEmail(user.email, verificationToken);
}

const generateTokens = async (user) => {
	const payload = { id: user.id, email: user.email, role: user.role };
	const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
	const refreshToken = await jwt.sign({ ...payload, type: "refresh", jti: crypto.randomBytes(16).toString('hex') }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
	return { accessToken, refreshToken }
}

const calculateRefreshTokenExpiry = () => {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);
	return expiresAt;
}

const updateUserRefreshToken = async ({ userId, refreshTokenHash, refreshTokenExpiresAt }) => {
	await authRepository.updateUser(userId, {
		refreshTokenHash,
		refreshTokenExpiresAt
	});
}

const authService = {
	register,
	login,
	refresh,
	logout,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendVerification
}

export default authService;
