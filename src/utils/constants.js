module.exports = {
  // Booking Status
  BOOKING_STATUS: {
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CASH: 'Cash',
    CARD: 'Card',
    WALLET: 'Wallet',
  },

  // Bus Types
  BUS_TYPES: {
    LUXURY: 'Luxury',
    STANDARD: 'Standard',
    ECONOMY: 'Economy',
  },

  // Seat Types
  SEAT_TYPES: {
    WINDOW: 'Window',
    AISLE: 'Aisle',
    EXTRA_LEGROOM: 'Extra legroom',
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  // OTP Configuration
  OTP_EXPIRE_TIME: 10 * 60 * 1000, // 10 minutes in milliseconds
  OTP_LENGTH: 6,

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
