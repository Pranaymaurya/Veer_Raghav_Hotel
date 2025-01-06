import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../Models/userModel.js';

// Initialize nodemailer transporter with error handling
const createTransporter = () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials are not properly configured');
        }

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Add timeout to prevent hanging
            tls: {
                rejectUnauthorized: true
            },
            connectionTimeout: 5000,
            greetingTimeout: 5000
        });
    } catch (error) {
        console.error('Transporter creation failed:', error);
        throw error;
    }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
    let user = null;

    try {
        // Validate email
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Find user
        user = await User.findOne({ email });

        if (!user) {
            // Return a specific message if the user doesn't exist
            return res.status(404).json({
                success: false,
                message: 'No account exists with this email address. Please check your email or create a new account.'
            });
        }

        // Generate reset token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 600000; // 10 minutes

        // Update user with reset token
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create email template
        const emailTemplate = {
            to: email,
            subject: 'Password Reset Request - Veer Raghav',
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - Veer Raghav</title>
              </head>
              <body>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the link below to proceed:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
              </body>
              </html>
            `
        };

        try {
            const transporter = createTransporter();
            await transporter.verify();
            await transporter.sendMail(emailTemplate);

            return res.json({
                success: true,
                message: 'A password reset link has been sent to your email.'
            });

        } catch (emailError) {
            console.error('Email sending error:', emailError);

            // Reset the token if email fails
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Failed to send reset email. Please try again later.'
            });
        }

    } catch (error) {
        console.error('Password reset error:', error);

        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request. Please try again later.'
        });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Password validation (add any additional validation as needed)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};