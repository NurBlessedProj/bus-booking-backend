module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bus_booking_app',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Email (Resend)
  email: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL, // Format: "App Name <noreply@yourdomain.com>"
  },
  
  // App
  appName: process.env.APP_NAME || 'Bus Booking App',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  
  // Frontend URL (optional for mobile apps)
  // For mobile: Can be '*' or deep link scheme like 'busbookingapp://'
  // For web: Actual web URL like 'http://localhost:3000'
  frontendUrl: process.env.FRONTEND_URL || '*',
};
