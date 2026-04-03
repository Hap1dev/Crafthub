import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetPasswordEmail = async (email, token) => {
	const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
	
	try {
		const { data, error } = await resend.emails.send({
			from: 'Crafthub <onboarding@resend.dev>', // Resend default for testing, update to verified domain
			to: [email],
			subject: 'Reset Your Password',
			html: `
				<h1>Password Reset Request</h1>
				<p>You requested a password reset. Please click the link below to set a new password:</p>
				<a href="${resetLink}">Reset Password</a>
				<p>This link will expire in 1 hour.</p>
				<p>If you didn't request this, please ignore this email.</p>
			`
		});

		if (error) {
			console.error('Resend error:', error);
			throw new Error('Failed to send reset password email');
		}

		console.log('Email sent successfully:', data.id);
		return data;
	} catch (error) {
		console.error('Error sending email via Resend:', error);
		throw new Error('Failed to send reset password email');
	}
};

export default {
	sendResetPasswordEmail
};