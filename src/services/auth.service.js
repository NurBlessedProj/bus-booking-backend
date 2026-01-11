const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const config = require('../config/config');
const { generateOTP } = require('../utils/helpers');
const { OTP_EXPIRE_TIME } = require('../utils/constants');
const emailService = require('./email.service');

// Generate JWT Token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Generate and send OTP
exports.generateAndSendOTP = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('User not found');
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_TIME);

    user.otp = {
      code: otp,
      expiresAt,
    };

    await user.save();

    // Send OTP via email
    await emailService.sendOTPEmail(email, otp);

    return { success: true, message: 'OTP sent to email' };
  } catch (error) {
    throw error;
  }
};

// Verify OTP
exports.verifyOTP = async (email, otpCode) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.otp || !user.otp.code) {
      throw new Error('OTP not found. Please request a new one.');
    }

    if (user.otp.code !== otpCode) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > user.otp.expiresAt) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Verify user and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate token for auto-login after verification
    const token = exports.generateToken(user._id);

    return { 
      success: true, 
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      }
    };
  } catch (error) {
    throw error;
  }
};

// Generate password reset token
exports.generatePasswordResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    return { success: true, resetToken };
  } catch (error) {
    throw error;
  }
};

// Reset password
exports.resetPassword = async (resetToken, newPassword) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    throw error;
  }
};
