const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agency = require('../models/Agency.model');
const Bus = require('../models/Bus.model');
const User = require('../models/User.model');
const Booking = require('../models/Booking.model');
const Seat = require('../models/Seat.model');

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://blessednur67:HOODQUAN67@cluster0.wftw5hq.mongodb.net/bus_booking_app?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB Connected");

    console.log("\n🗑️  Starting cleanup...");

    // Delete in order to respect foreign key constraints
    const seatCount = await Seat.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const busCount = await Bus.countDocuments();
    const agencyCount = await Agency.countDocuments();
    const userCount = await User.countDocuments();

    console.log(`📊 Current data:`);
    console.log(`   - Seats: ${seatCount}`);
    console.log(`   - Bookings: ${bookingCount}`);
    console.log(`   - Buses: ${busCount}`);
    console.log(`   - Agencies: ${agencyCount}`);
    console.log(`   - Users: ${userCount}`);

    await Seat.deleteMany({});
    console.log("✅ Deleted all seats");

    await Booking.deleteMany({});
    console.log("✅ Deleted all bookings");

    await Bus.deleteMany({});
    console.log("✅ Deleted all buses");

    await Agency.deleteMany({});
    console.log("✅ Deleted all agencies");

    // Keep admin user, delete others
    await User.deleteMany({ email: { $ne: 'admin@busbooking.com' } });
    console.log("✅ Deleted all users (kept admin)");

    console.log("\n🎉 Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
};

cleanup();
