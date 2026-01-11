# Backend API Structure

This document outlines the planned API structure for the Bus Booking App backend.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Application configuration
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   ├── bus.controller.js
│   │   ├── booking.controller.js
│   │   ├── agency.controller.js
│   │   └── user.controller.js
│   ├── models/                # Mongoose models
│   │   ├── User.model.js
│   │   ├── Bus.model.js
│   │   ├── Agency.model.js
│   │   ├── Booking.model.js
│   │   ├── Seat.model.js
│   │   ├── Route.model.js
│   │   └── Payment.model.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── bus.routes.js
│   │   ├── booking.routes.js
│   │   ├── agency.routes.js
│   │   └── user.routes.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── booking.service.js
│   │   └── payment.service.js
│   ├── utils/                 # Utility functions
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── server.js              # Express app entry point
├── env.example                # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── API_STRUCTURE.md
```

## Planned API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-otp` - OTP verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /me` - Get current user (protected)
- `POST /refresh-token` - Refresh JWT token

### Buses (`/api/buses`)
- `GET /search` - Search buses by route and date
  - Query params: `from`, `to`, `date`
- `GET /:id` - Get bus details
- `GET /:id/seats` - Get bus seat availability
- `GET /` - Get all buses (with filters)

### Bookings (`/api/bookings`)
- `POST /` - Create new booking (protected)
- `GET /` - Get user bookings (protected)
- `GET /:id` - Get booking details (protected)
- `PUT /:id/cancel` - Cancel booking (protected)
- `GET /:id/ticket` - Get booking ticket/QR code (protected)

### Agencies (`/api/agencies`)
- `GET /` - Get all agencies
- `GET /:id` - Get agency details
- `GET /:id/buses` - Get agency buses

### Users (`/api/users`)
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `GET /bookings` - Get user bookings (protected)
- `PUT /password` - Change password (protected)

## Data Models (MongoDB Schema)

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  countryCode: String,
  role: String (default: 'user'),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Agency
```javascript
{
  name: String,
  logo: String,
  description: String,
  rating: Number,
  amenities: [String],
  contact: {
    phone: String,
    email: String
  },
  createdAt: Date
}
```

### Bus
```javascript
{
  agency: ObjectId (ref: Agency),
  type: String, // 'Luxury', 'Standard', 'Economy'
  route: {
    from: String,
    to: String,
    departureTime: Date,
    arrivalTime: Date,
    duration: Number
  },
  totalSeats: Number,
  availableSeats: Number,
  price: Number,
  isVIP: Boolean,
  amenities: [String],
  createdAt: Date
}
```

### Seat
```javascript
{
  bus: ObjectId (ref: Bus),
  seatNumber: String,
  type: String, // 'Window', 'Aisle', 'Extra legroom'
  isAvailable: Boolean,
  isBooked: Boolean
}
```

### Booking
```javascript
{
  user: ObjectId (ref: User),
  bus: ObjectId (ref: Bus),
  seats: [ObjectId] (ref: Seat),
  passengers: [{
    name: String,
    age: Number,
    seatNumber: String
  }],
  route: {
    from: String,
    to: String,
    date: Date,
    departureTime: String,
    arrivalTime: String
  },
  totalPrice: Number,
  status: String, // 'Confirmed', 'Cancelled', 'Completed'
  bookingId: String (unique),
  qrCode: String,
  createdAt: Date
}
```

## Next Steps

1. ✅ Backend folder structure created
2. ✅ Express server setup
3. ⏳ Install dependencies: `npm install`
4. ⏳ Set up MongoDB connection
5. ⏳ Create User model and authentication
6. ⏳ Create Bus and Agency models
7. ⏳ Create Booking model
8. ⏳ Implement authentication routes
9. ⏳ Implement bus search routes
10. ⏳ Implement booking routes
11. ⏳ Add JWT authentication middleware
12. ⏳ Add input validation
13. ⏳ Add error handling
14. ⏳ Add email service for OTP
15. ⏳ Connect Flutter app to backend API

## Getting Started

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration

5. Start development server:
   ```bash
   npm run dev
   ```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Email**: nodemailer (for OTP)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware
