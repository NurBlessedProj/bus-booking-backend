# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://blessednur67:HOODQUAN67@cluster0.wftw5hq.mongodb.net/bus_booking_app?retryWrites=true&w=majority&appName=Cluster
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Email configuration (optional for now)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URL (for mobile app, use * or omit)
   FRONTEND_URL=*
   ```
   
   **Notes**: 
   - The database name `bus_booking_app` is included in the connection string before the query parameters (`?`).
   - For mobile apps, `FRONTEND_URL` can be `*` or omitted (mobile apps don't need CORS restrictions).
   - See `MOBILE_APP_CONFIG.md` for more details on mobile app configuration.

4. **Start MongoDB** (if running locally)
   ```bash
   # On Linux/Mac
   mongod
   
   # Or use MongoDB service
   sudo systemctl start mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

## Testing the API

Once the server is running, you can test it:

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Register a user**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "123456789",
       "password": "password123"
     }'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

   Note: After registration, check console/logs for OTP (if email is not configured).

## API Documentation

- See `API_ENDPOINTS.md` for complete API documentation
- See `API_STRUCTURE.md` for project structure
- See `README.md` for general information

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, error, validation middleware
│   ├── services/        # Business logic (auth, email)
│   ├── utils/           # Helpers, validators, constants
│   └── server.js        # Express app entry point
├── env.example          # Environment variables template
├── package.json         # Dependencies
└── README.md           # Documentation
```

## Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check MONGODB_URI in .env file
   - For MongoDB Atlas, make sure your IP is whitelisted

2. **Port Already in Use**
   - Change PORT in .env file
   - Or kill the process using the port

3. **Email Not Working**
   - Email service is optional
   - OTP will be logged to console if email is not configured
   - For Gmail, use App Password instead of regular password

## Next Steps

1. Test all API endpoints using Postman or similar tool
2. Connect Flutter app to backend API
3. Set up production environment variables
4. Deploy backend to cloud (Heroku, AWS, etc.)

## Development Tips

- Use `npm run dev` for development (auto-restart on file changes)
- Check console logs for errors and debug information
- OTP codes are logged to console if email is not configured
- All models support soft delete (isActive flag)
- Protected routes require JWT token in Authorization header
