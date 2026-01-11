const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Verify transporter (only if email is configured)
if (config.email.user && config.email.pass) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email service not configured:', error.message);
      console.log('⚠️  Email functionality will be disabled');
    } else {
      console.log('✅ Email service ready');
    }
  });
} else {
  console.log('⚠️  Email credentials not configured. Email functionality will be disabled.');
}

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  // If email not configured, just log and return success
  if (!config.email.user || !config.email.pass) {
    console.log(`📧 OTP for ${email}: ${otp}`);
    return true;
  }

  try {
    const mailOptions = {
      from: `"${config.appName}" <${config.email.user}>`,
      to: email,
      subject: 'OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9500;">OTP Verification Code</h2>
          <p>Your OTP verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #FF9500; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken) => {
  // If email not configured, just log and return success
  if (!config.email.user || !config.email.pass) {
    console.log(`📧 Password reset token for ${email}: ${resetToken}`);
    console.log(`📱 Mobile app deep link: busbookingapp://reset-password?token=${resetToken}`);
    return true;
  }

  try {
    // For mobile app: Use deep link format, fallback to web URL if configured
    // Format: busbookingapp://reset-password?token=xxx
    const resetUrl = config.frontendUrl && config.frontendUrl !== '*' && config.frontendUrl !== 'http://localhost:3000'
      ? `${config.frontendUrl}/reset-password?token=${resetToken}`
      : `busbookingapp://reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${config.appName}" <${config.email.user}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9500;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF9500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

// Send booking confirmation email
exports.sendBookingConfirmationEmail = async (email, booking) => {
  // If email not configured, just log and return success
  if (!config.email.user || !config.email.pass) {
    console.log(`📧 Booking confirmation for ${email}: ${booking.bookingId}`);
    return true;
  }

  try {
    const mailOptions = {
      from: `"${config.appName}" <${config.email.user}>`,
      to: email,
      subject: `Booking Confirmation - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9500;">Booking Confirmed!</h2>
          <p>Your booking has been confirmed. Here are the details:</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Route:</strong> ${booking.route.from} to ${booking.route.to}</p>
            <p><strong>Date:</strong> ${new Date(booking.route.date).toLocaleDateString()}</p>
            <p><strong>Departure:</strong> ${booking.route.departureTime}</p>
            <p><strong>Arrival:</strong> ${booking.route.arrivalTime}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice} XAF</p>
          </div>
          <p>Thank you for booking with us!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return false;
  }
};

// Send booking cancellation email
exports.sendBookingCancellationEmail = async (email, booking) => {
  // If email not configured, just log and return success
  if (!config.email.user || !config.email.pass) {
    console.log(`📧 Booking cancellation for ${email}: ${booking.bookingId}`);
    return true;
  }

  try {
    const mailOptions = {
      from: `"${config.appName}" <${config.email.user}>`,
      to: email,
      subject: `Booking Cancelled - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Booking Cancelled</h2>
          <p>Your booking has been cancelled.</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Route:</strong> ${booking.route.from} to ${booking.route.to}</p>
            <p><strong>Refund Amount:</strong> ${booking.totalPrice} XAF</p>
          </div>
          <p>We hope to see you again soon!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking cancellation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking cancellation email:', error);
    return false;
  }
};
