import nodemailer from 'nodemailer';

// You would normally set these in .env
// For development, we'll use ethereal.email or allow passing via env
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
	port: process.env.EMAIL_PORT || 587,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

const sendResetPasswordEmail = async (email, token) => {
	const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
	
	const mailOptions = {
		from: '"Crafthub" <no-reply@crafthub.com>',
		to: email,
		subject: 'Reset Your Password',
		html: `
			<h1>Password Reset Request</h1>
			<p>You requested a password reset. Please click the link below to set a new password:</p>
			<a href="${resetLink}">Reset Password</a>
			<p>This link will expire in 1 hour.</p>
			<p>If you didn't request this, please ignore this email.</p>
		`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: %s', info.messageId);
		// If using ethereal, log the URL to preview the email
		if (process.env.EMAIL_HOST === 'smtp.ethereal.email' || !process.env.EMAIL_HOST) {
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		}
		return info;
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Failed to send reset password email');
	}
};

export default {
	sendResetPasswordEmail
};