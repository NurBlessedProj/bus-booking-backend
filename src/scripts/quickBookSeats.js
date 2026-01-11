const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus.model');
const Seat = require('../models/Seat.model');
const { getStartOfDay } = require('../utils/helpers');

dotenv.config();

const quickBookSeats = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://blessednur67:HOODQUAN67@cluster0.wftw5hq.mongodb.net/bus_booking_app?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB Connected");

    // Get all buses
    const allBuses = await Bus.find();
    console.log(`📦 Found ${allBuses.length} buses`);

    let seatsBooked = 0;

    // For each bus, mark some random seats as booked for the next 7 days
    for (const bus of allBuses) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const bookingDate = new Date();
        bookingDate.setDate(bookingDate.getDate() + dayOffset);
        const routeDate = getStartOfDay(bookingDate);

        // Mark 30% of seats as booked for variety
        const numSeatsToBook = Math.floor(bus.totalSeats * 0.3);
        const bookedSeatNumbers = [];
        
        // Generate random seat numbers
        for (let i = 0; i < numSeatsToBook; i++) {
          let seatNum;
          do {
            seatNum = (Math.floor(Math.random() * bus.totalSeats) + 1)
              .toString()
              .padStart(2, '0');
          } while (bookedSeatNumbers.includes(seatNum));
          bookedSeatNumbers.push(seatNum);
        }

        // Create or update seats to mark them as booked
        for (const seatNum of bookedSeatNumbers) {
          let seat = await Seat.findOne({
            bus: bus._id,
            seatNumber: seatNum,
            bookingDate: routeDate,
          });

          if (!seat) {
            const seatNumInt = parseInt(seatNum);
            let seatType = "Window";
            const lastDigit = seatNumInt % 10;
            if (lastDigit === 1 || lastDigit === 4) {
              seatType = "Window";
            } else if (lastDigit === 2 || lastDigit === 3) {
              seatType = "Aisle";
            }

            seat = await Seat.create({
              bus: bus._id,
              seatNumber: seatNum,
              type: seatType,
              bookingDate: routeDate,
              isAvailable: false,
              isBooked: true,
            });
            seatsBooked++;
          } else {
            if (!seat.isBooked) {
              seat.isBooked = true;
              seat.isAvailable = false;
              await seat.save();
              seatsBooked++;
            }
          }
        }

        // Update bus available seats count
        const bookedCount = await Seat.countDocuments({
          bus: bus._id,
          bookingDate: routeDate,
          isBooked: true,
        });
        bus.availableSeats = Math.max(0, bus.totalSeats - bookedCount);
        await bus.save();
      }
    }

    console.log(`\n✅ Quick booking completed!`);
    console.log(`📊 Marked ${seatsBooked} seats as booked across all buses for the next 7 days`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

quickBookSeats();
