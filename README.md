# Bus Booking Backend API

Backend API server for the Bus Booking App built with Express.js and Node.js.

## Features

- User Authentication (Register, Login, OTP Verification)
- Bus Search and Listings
- Booking Management
- Agency Management
- Seat Selection
- Payment Processing (to be integrated)
- User Profile Management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Validation**: express-validator
- **Email**: nodemailer (for OTP)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints (To be implemented)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Buses
- `GET /api/buses/search` - Search buses by route and date
- `GET /api/buses/:id` - Get bus details
- `GET /api/buses/:id/seats` - Get bus seat availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Agencies
- `GET /api/agencies` - Get all agencies
- `GET /api/agencies/:id` - Get agency details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Database Models (To be created)

- User
- Bus
- Agency
- Booking
- Seat
- Route
- Payment

## Development

The server runs on `http://localhost:3000` by default.

## Environment Variables

See `.env.example` for required environment variables.
