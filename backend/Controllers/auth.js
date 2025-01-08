import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../Models/userModel.js';

// Utility function to create nodemailer transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials are not properly configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  });
};

// Centralized email-sending function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `Veer Raghav <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email sending failed');
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account exists with this email address. Please check your email or create a new account.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 600000; // 10 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailTemplate = `
      <html>
      <!-- Your HTML content for the password reset email -->
      <body>
        <h1>Password Reset Request</h1>
        <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request - Veer Raghav',
      html: emailTemplate,
    });

    return res.json({
      success: true,
      message: 'A password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Password reset error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Send booking confirmation email
export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    const { email, name, bookingId, service, checkInDate, checkOutDate, totalPrice } = bookingDetails;

    if (!email || !name || !bookingId || !checkInDate || !checkOutDate || !service) {
      throw new Error('Missing required booking details');
    }

    const emailTemplate = `
      <html>
      <!-- Your HTML content for the booking confirmation email -->
      <body>
        <h1>Booking Confirmation</h1>
        <p>Dear ${name},</p>
        <p>Your booking for ${service} has been confirmed. Details:</p>
        <ul>
          <li>Booking ID: ${bookingId}</li>
          <li>Check-in: ${checkInDate}</li>
          <li>Check-out: ${checkOutDate}</li>
          <li>Total Price: $${totalPrice.toFixed(2)}</li>
        </ul>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Booking Confirmation - Veer Raghav',
      html: emailTemplate,
    });

    console.log(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error.message);
    throw error;
  }
};
