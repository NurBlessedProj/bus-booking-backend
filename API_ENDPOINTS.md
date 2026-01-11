# API Endpoints Documentation

Base URL: `http://localhost:3000/api`

## Authentication Endpoints

### Register
- **POST** `/auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123456789",
    "password": "password123",
    "countryCode": "+237" // optional
  }
  ```

### Login
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Verify OTP
- **POST** `/auth/verify-otp`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```

### Resend OTP
- **POST** `/auth/resend-otp`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

### Get Current User
- **GET** `/auth/me`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

### Forgot Password
- **POST** `/auth/forgot-password`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

### Reset Password
- **PUT** `/auth/reset-password`
- **Access**: Public
- **Body**:
  ```json
  {
    "token": "reset_token_here",
    "password": "newpassword123"
  }
  ```

## Bus Endpoints

### Search Buses
- **GET** `/buses/search?from=Yaoundé&to=Douala&date=2024-03-15&page=1&limit=10`
- **Access**: Public
- **Query Params**:
  - `from`: Origin location (required)
  - `to`: Destination location (required)
  - `date`: Date (required, format: YYYY-MM-DD)
  - `page`: Page number (optional, default: 1)
  - `limit`: Items per page (optional, default: 10)

### Get All Buses
- **GET** `/buses?page=1&limit=10&agency=agency_id`
- **Access**: Public
- **Query Params**:
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)
  - `agency`: Filter by agency ID (optional)

### Get Single Bus
- **GET** `/buses/:id`
- **Access**: Public

### Get Bus Seats
- **GET** `/buses/:id/seats?date=2024-03-15`
- **Access**: Public
- **Query Params**:
  - `date`: Date for seat availability (optional, defaults to today)

### Create Bus (Admin)
- **POST** `/buses`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "agency": "agency_id",
    "busNumber": "BUS001",
    "type": "Standard",
    "route": {
      "from": "Yaoundé",
      "to": "Douala"
    },
    "departureTime": "2024-03-15T08:00:00Z",
    "arrivalTime": "2024-03-15T09:30:00Z",
    "totalSeats": 40,
    "price": 5000,
    "isVIP": false,
    "amenities": ["wifi", "ac", "charging"]
  }
  ```

### Update Bus (Admin)
- **PUT** `/buses/:id`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`

### Delete Bus (Admin)
- **DELETE** `/buses/:id`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`

## Booking Endpoints

### Create Booking
- **POST** `/bookings`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "bus": "bus_id",
    "seats": ["01", "02"],
    "passengers": [
      {
        "name": "John Doe",
        "age": 25,
        "seatNumber": "01",
        "gender": "Male"
      },
      {
        "name": "Jane Doe",
        "age": 23,
        "seatNumber": "02",
        "gender": "Female"
      }
    ],
    "route": {
      "from": "Yaoundé",
      "to": "Douala",
      "date": "2024-03-15T00:00:00Z",
      "departureTime": "08:00 AM",
      "arrivalTime": "09:30 AM"
    },
    "paymentMethod": "Cash"
  }
  ```

### Get My Bookings
- **GET** `/bookings?status=Confirmed&page=1&limit=10`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**:
  - `status`: Filter by status (Confirmed, Cancelled, Completed) (optional)
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)

### Get Single Booking
- **GET** `/bookings/:id`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

### Cancel Booking
- **PUT** `/bookings/:id/cancel`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "reason": "Change of plans"
  }
  ```

### Get Booking Ticket
- **GET** `/bookings/:id/ticket`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

## Agency Endpoints

### Get All Agencies
- **GET** `/agencies?page=1&limit=10`
- **Access**: Public
- **Query Params**:
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)

### Get Single Agency
- **GET** `/agencies/:id`
- **Access**: Public

### Get Agency Buses
- **GET** `/agencies/:id/buses?page=1&limit=10`
- **Access**: Public
- **Query Params**:
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)

### Create Agency (Admin)
- **POST** `/agencies`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Express VIP",
    "logo": "url_to_logo",
    "description": "Premium bus service",
    "amenities": ["wifi", "ac", "charging"],
    "contact": {
      "phone": "123456789",
      "email": "contact@expressvip.com",
      "address": "Address here"
    }
  }
  ```

### Update Agency (Admin)
- **PUT** `/agencies/:id`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`

### Delete Agency (Admin)
- **DELETE** `/agencies/:id`
- **Access**: Private/Admin
- **Headers**: `Authorization: Bearer <token>`

## User Endpoints

### Get Profile
- **GET** `/users/profile`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

### Update Profile
- **PUT** `/users/profile`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "John Doe Updated",
    "phone": "987654321",
    "countryCode": "+237"
  }
  ```

### Change Password
- **PUT** `/users/password`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```

### Get User Bookings
- **GET** `/users/bookings?status=Confirmed&page=1&limit=10`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**:
  - `status`: Filter by status (optional)
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Authentication

Most protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

The token is received after successful login or registration.

## Pagination

Many endpoints support pagination using query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes:
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "data": [ ... ]
}
```
