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
                <style>
                  body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    background-color: #FF6B35;
                    color: white;
                    padding: 20px;
                    text-align: center;
                  }
                  .content {
                    padding: 30px;
                    color: #333;
                  }
                  .button {
                    background-color: #FF6B35;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 20px;
                    transition: background-color 0.3s ease;
                  }
                  .button:hover {
                    background-color: #E84F1D;
                  }
                  .footer {
                    background-color: #f8f8f8;
                    color: #666;
                    text-align: center;
                    padding: 15px;
                    font-size: 0.8em;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Veer Raghav</h1>
                  </div>
                  <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Veer Raghav account. Don't worry, we've got you covered!</p>
                    <p>Click the button below to set a new password:</p>
                    <a href="${resetUrl}" class="button">Reset My Password</a>
                    <p>This link will expire in 10 minutes for security reasons.</p>
                    <p><strong>Important:</strong> If you didn't request this password reset, please ignore this email or contact our support team if you have any concerns.</p>
                  </div>
                  <div class="footer">
                    <p>&copy; 2023 Veer Raghav. All rights reserved.</p>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                  </div>
                </div>
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
// Import necessary modules
// import nodemailer from 'nodemailer';
// import User from '../Models/userModel.js';

// Utility function to send email
const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: true,
            },
        });

        await transporter.sendMail({
            from: `Veer Raghav <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

// Function to send booking confirmation email
export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    const { email, name, bookingId, service, checkInDate, checkOutDate, totalPrice } = bookingDetails;

    if (!email || !name || !bookingId || !checkInDate || !checkOutDate || !service) {
      throw new Error('Missing required booking details');
    }

    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #4CAF50;
                color: #fff;
                padding: 15px;
                text-align: center;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
            }
            .highlight {
                color: #4CAF50;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Booking Confirmation</div>
            <div class="content">
                <p>Dear <span class="highlight">${name}</span>,</p>
                <p>Thank you for booking with Veer Raghav. We are pleased to confirm your booking:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${bookingId}</li>
                    <li><strong>Service:</strong> ${service}</li>
                    <li><strong>Check-in Date:</strong> ${checkInDate}</li>
                    <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
                    <li><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</li>
                </ul>
                <p>We look forward to serving you. If you have any questions or need to reschedule, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
                <p>Best regards,</p>
                <p>The Veer Raghav Team</p>
            </div>
            <div class="footer">&copy; 2023 Veer Raghav. All rights reserved.</div>
        </div>
    </body>
    </html>
    `;

    // Send email using a pre-configured email service
    await sendEmail({
      to: email,
      subject: 'Booking Confirmation - Veer Raghav',
      html: emailTemplate,
    });

    console.log(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error.message);
    throw error; // Re-throw to handle it in the calling function
  }
};
