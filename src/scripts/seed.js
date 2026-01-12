const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Agency = require("../models/Agency.model");
const Bus = require("../models/Bus.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const Booking = require("../models/Booking.model");
// Booking and Seat models not needed - user will create bookings themselves

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://blessednur67:HOODQUAN67@cluster0.wftw5hq.mongodb.net/bus_booking_app?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Helper function to convert amenities array to our format
const convertAmenities = (amenities) => {
  const mapping = {
    ac: "ac",
    wifi: "wifi",
    charging_ports: "charging",
    charging: "charging",
    reclining_seats: "reclining",
    luggage: "luggage",
    entertainment: "entertainment",
    toilet: "toilet",
    snacks: "snacks",
  };

  return amenities.map((a) => mapping[a] || a).filter(Boolean);
};

// Helper function to determine bus type
const getBusType = (busClass) => {
  const mapping = {
    economy: "Economy",
    standard: "Standard",
    vip: "Luxury",
  };
  return mapping[busClass] || "Standard";
};

// Helper function to determine if VIP
const isVIP = (busClass) => busClass === "vip";

// Helper function to get price based on route and class
const getPrice = (distanceKm, busClass, sampleRouteFares, route) => {
  // First check if we have a specific fare for this route
  const specificFare = sampleRouteFares.find(
    (f) => f.route === route || f.route === route.split("-").reverse().join("-")
  );

  if (specificFare) {
    return specificFare[busClass] || specificFare.standard;
  }

  // Otherwise use distance-based pricing
  if (distanceKm < 200) {
    const fareBands = { economy: 3500, standard: 4000, vip: 5000 };
    return fareBands[busClass] || fareBands.standard;
  } else if (distanceKm < 500) {
    const fareBands = { economy: 6000, standard: 7000, vip: 9000 };
    return fareBands[busClass] || fareBands.standard;
  } else {
    const fareBands = { economy: 11000, standard: 13000, vip: 16000 };
    return fareBands[busClass] || fareBands.standard;
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Agency.deleteMany({});
    await Bus.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Agencies data from Perplexity
    const agenciesData = [
      {
        name: "Amour Mezam",
        description:
          "Reliable bus service connecting major cities in Cameroon, especially North-West region routes",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities([
          "ac",
          "reclining_seats",
          "luggage",
          "charging_ports",
        ]),
        contact: {
          phone: "+237 233 36 37 55",
          email: "contact@amourmezam.cm",
          address: "Mile 2 / Sonac Street Parks, Bamenda",
        },
      },
      {
        name: "Finexs Voyages",
        description:
          "Premium express bus service with modern amenities including WiFi",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities([
          "ac",
          "wifi",
          "reclining_seats",
          "charging_ports",
          "luggage",
        ]),
        contact: {
          phone: "+237 691 81 92 90",
          email: "info@finexs.cm",
          address: "Mvan Interurban Park, Yaoundé",
        },
      },
      {
        name: "Touristique Express",
        description:
          "Long-distance bus service connecting northern regions of Cameroon",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities(["ac", "luggage", "entertainment"]),
        contact: {
          email: "info@touristiqueexpress.cm",
          address: "Mvan Interurban Park, Yaoundé",
        },
      },
      {
        name: "General Express Voyages",
        description: "Reliable transportation service for western regions",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities(["ac", "luggage"]),
        contact: {
          email: "contact@generalexpress.cm",
          address: "Bonabéri Agencies Zone, Douala",
        },
      },
      {
        name: "Musango Bus Service",
        description:
          "Quality bus service specializing in South-West region routes",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities([
          "ac",
          "wifi",
          "reclining_seats",
          "charging_ports",
          "luggage",
        ]),
        contact: {
          email: "info@musangobus.com",
          address: "Mile 17 Motor Park, Buea",
        },
      },
      {
        name: "United Express",
        description:
          "Modern bus service with premium amenities and online booking",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities([
          "ac",
          "wifi",
          "charging_ports",
          "luggage",
        ]),
        contact: {
          email: "support@unitedexpress.cm",
          website: "https://www.unitedexpress.cm",
          address: "Village / Mboppi Area, Douala",
        },
      },
      {
        name: "Binam Voyages",
        description:
          "Affordable bus service connecting Yaoundé to western highlands",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities(["ac", "luggage"]),
        contact: {
          email: "info@binamvoyages.cm",
          address: "Nsam / Post Central Area, Yaoundé",
        },
      },
      {
        name: "Moghamo Express",
        description:
          "Reliable transportation from Bamenda to major destinations",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities(["ac", "luggage"]),
        contact: {
          email: "contact@moghamoexpress.cm",
          address: "Mile 2 / Sonac Street Parks, Bamenda",
        },
      },
      {
        name: "Garanti Express",
        description:
          "Comfortable bus service on Yaoundé-Douala and Yaoundé-Bafoussam routes",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities(["ac", "luggage"]),
        contact: {
          email: "info@garantiexpress.cm",
          address: "Mvan Interurban Park, Yaoundé",
        },
      },
      {
        name: "Oasis Travel",
        description: "Premium travel experience with VIP and standard options",
        rating: 0, // Will be calculated from reviews
        amenities: convertAmenities([
          "ac",
          "reclining_seats",
          "charging_ports",
        ]),
        contact: {
          email: "support@oasistravel.cm",
          address: "Village / Mboppi Area, Douala",
        },
      },
    ];

    const createdAgencies = await Agency.insertMany(agenciesData);
    console.log(`✅ Seeded ${createdAgencies.length} agencies`);

    // Create agency map for easy lookup
    const agencyMap = {};
    createdAgencies.forEach((agency) => {
      agencyMap[agency.name.toLowerCase()] = agency._id;
    });

    // Routes data - Only popular routes for demo (7 routes = 14 directions)
    const routesData = [
      { from: "Yaoundé", to: "Douala", distanceKm: 245, durationMin: 210 },
      { from: "Douala", to: "Yaoundé", distanceKm: 245, durationMin: 210 },
      { from: "Yaoundé", to: "Bamenda", distanceKm: 380, durationMin: 420 },
      { from: "Bamenda", to: "Yaoundé", distanceKm: 380, durationMin: 420 },
      { from: "Douala", to: "Bamenda", distanceKm: 360, durationMin: 420 },
      { from: "Bamenda", to: "Douala", distanceKm: 360, durationMin: 420 },
      { from: "Douala", to: "Bafoussam", distanceKm: 210, durationMin: 240 },
      { from: "Bafoussam", to: "Douala", distanceKm: 210, durationMin: 240 },
      { from: "Douala", to: "Buea", distanceKm: 70, durationMin: 90 },
      { from: "Buea", to: "Douala", distanceKm: 70, durationMin: 90 },
      { from: "Buea", to: "Yaoundé", distanceKm: 320, durationMin: 360 },
      { from: "Yaoundé", to: "Buea", distanceKm: 320, durationMin: 360 },
      { from: "Yaoundé", to: "Bafoussam", distanceKm: 300, durationMin: 330 },
      { from: "Bafoussam", to: "Yaoundé", distanceKm: 300, durationMin: 330 },
    ];

    // Sample route fares
    const sampleRouteFares = [
      {
        route: "Yaoundé-Douala",
        distanceKm: 245,
        economy: 6000,
        standard: 7000,
        vip: 9000,
      },
      {
        route: "Yaoundé-Bamenda",
        distanceKm: 380,
        economy: 6500,
        standard: 7500,
        vip: 9000,
      },
      {
        route: "Douala-Bamenda",
        distanceKm: 360,
        economy: 6500,
        standard: 7500,
        vip: 9000,
      },
      {
        route: "Douala-Bafoussam",
        distanceKm: 210,
        economy: 5000,
        standard: 6000,
        vip: 7500,
      },
      {
        route: "Douala-Buea",
        distanceKm: 70,
        economy: 2500,
        standard: 3000,
        vip: 4000,
      },
    ];

    // Agency route mappings (which agencies operate which routes)
    const agencyRoutes = {
      "amour mezam": [
        { from: "Bamenda", to: "Yaoundé" },
        { from: "Bamenda", to: "Douala" },
        { from: "Bamenda", to: "Bafoussam" },
      ],
      "finexs voyages": [
        { from: "Douala", to: "Yaoundé" },
        { from: "Douala", to: "Bafoussam" },
        { from: "Douala", to: "Bamenda" },
      ],
      "touristique express": [
        { from: "Yaoundé", to: "Douala" },
        { from: "Yaoundé", to: "Ngaoundéré" },
        { from: "Ngaoundéré", to: "Garoua" },
        { from: "Garoua", to: "Maroua" },
      ],
      "general express voyages": [
        { from: "Douala", to: "Bafoussam" },
        { from: "Douala", to: "Dschang" },
      ],
      "musango bus service": [
        { from: "Buea", to: "Yaoundé" },
        { from: "Buea", to: "Douala" },
        { from: "Douala", to: "Yaoundé" },
      ],
      "united express": [
        { from: "Douala", to: "Yaoundé" },
        { from: "Yaoundé", to: "Douala" },
      ],
      "binam voyages": [
        { from: "Yaoundé", to: "Bafoussam" },
        { from: "Yaoundé", to: "Bamenda" },
      ],
      "moghamo express": [
        { from: "Bamenda", to: "Yaoundé" },
        { from: "Bamenda", to: "Douala" },
        { from: "Bamenda", to: "Buea" },
      ],
      "garanti express": [
        { from: "Yaoundé", to: "Douala" },
        { from: "Yaoundé", to: "Bafoussam" },
      ],
      "oasis travel": [
        { from: "Douala", to: "Yaoundé" },
        { from: "Douala", to: "Bafoussam" },
      ],
    };

    // Generate buses for the next 7 days only
    const buses = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Schedule patterns (departure times in hours:minutes)
    const schedulePatterns = {
      "Yaoundé-Douala": [
        "06:00",
        "07:30",
        "09:00",
        "11:00",
        "13:00",
        "15:00",
        "17:00",
        "19:00",
      ],
      "Douala-Yaoundé": [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      "Buea-Yaoundé": ["07:00", "08:30", "10:30", "13:00", "15:30"],
      default: ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"],
    };

    // Bus class distribution (some routes have economy/standard, some have standard/vip)
    const getBusClassesForRoute = (agencyName, route) => {
      const agencyLower = agencyName.toLowerCase();

      if (agencyLower.includes("express") || agencyLower.includes("finexs")) {
        return ["standard", "vip"];
      }
      if (agencyLower.includes("amour") || agencyLower.includes("musango")) {
        return ["standard", "vip"];
      }
      if (agencyLower.includes("oasis")) {
        return ["standard", "vip"];
      }
      return ["economy", "standard"];
    };

    let busCounter = 0; // Global counter to ensure unique bus numbers

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      // Iterate through each agency and their routes
      Object.entries(agencyRoutes).forEach(([agencyName, routes]) => {
        const agencyId = agencyMap[agencyName.toLowerCase()];
        if (!agencyId) return;

        routes.forEach((route) => {
          const routeKey = `${route.from}-${route.to}`;
          const routeData = routesData.find(
            (r) => r.from === route.from && r.to === route.to
          );

          if (!routeData) return;

          // Get schedule pattern for this route
          const schedule =
            schedulePatterns[routeKey] || schedulePatterns.default;
          const busClasses = getBusClassesForRoute(agencyName, routeKey);

          // Create buses for each departure time and each bus class
          schedule.forEach((departureTime, index) => {
            busClasses.forEach((busClass) => {
              const [hours, minutes] = departureTime.split(":").map(Number);
              const departure = new Date(date);
              departure.setHours(hours, minutes, 0, 0);

              const arrival = new Date(departure);
              arrival.setMinutes(arrival.getMinutes() + routeData.durationMin);

              const price = getPrice(
                routeData.distanceKm,
                busClass,
                sampleRouteFares,
                routeKey
              );
              const vipPrice = isVIP(busClass) ? price * 1.5 : price;

              // Determine capacity based on bus class
              const capacity = isVIP(busClass)
                ? 30
                : busClass === "economy"
                  ? 50
                  : 45;
              const availableSeats = Math.floor(Math.random() * 15) + 10; // Random 10-25 seats available

              // Generate unique bus number including route info and unique counter
              busCounter++;
              const routeCode =
                `${route.from.substring(0, 2)}${route.to.substring(0, 2)}`
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "");
              const uniqueId = `${String(day + 1).padStart(2, "0")}${String(index + 1).padStart(2, "0")}${busClass.charAt(0).toUpperCase()}${String(busCounter).padStart(6, "0")}`;
              buses.push({
                agency: agencyId,
                busNumber: `${agencyName
                  .substring(0, 3)
                  .toUpperCase()}-${routeCode}-${uniqueId}`,
                type: getBusType(busClass),
                route: {
                  from: route.from,
                  to: route.to,
                },
                departureTime: departure,
                arrivalTime: arrival,
                duration: routeData.durationMin,
                totalSeats: capacity,
                availableSeats: Math.min(availableSeats, capacity),
                price: price,
                vipPrice: vipPrice,
                isVIP: isVIP(busClass),
                amenities: convertAmenities(
                  agencyRoutes[agencyName.toLowerCase()]
                    ? agenciesData.find(
                        (a) => a.name.toLowerCase() === agencyName.toLowerCase()
                      )?.amenities || []
                    : []
                ),
              });
            });
          });
        });
      });
    }

    await Bus.insertMany(buses);
    console.log(`✅ Seeded ${buses.length} buses for the next 7 days`);

    // Create test users for reviews
    const bcrypt = require("bcryptjs");
    const testUsers = [
      {
        name: "Admin User",
        email: "admin@busbooking.com",
        phone: "123456789",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        isVerified: true,
        countryCode: "+237",
      },
      {
        name: "Marie Nkeng",
        email: "marie@example.com",
        phone: "677123456",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        isVerified: true,
        countryCode: "+237",
      },
      {
        name: "Jean Paul",
        email: "jean@example.com",
        phone: "677123457",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        isVerified: true,
        countryCode: "+237",
      },
      {
        name: "Sarah Tchoupa",
        email: "sarah@example.com",
        phone: "677123458",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        isVerified: true,
        countryCode: "+237",
      },
      {
        name: "Paul Kameni",
        email: "paul@example.com",
        phone: "677123459",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        isVerified: true,
        countryCode: "+237",
      },
      {
        name: "Amina Doudou",
        email: "amina@example.com",
        phone: "677123460",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        isVerified: true,
        countryCode: "+237",
      },
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
      } else {
        createdUsers.push(existingUser);
      }
    }
    console.log(`✅ Seeded ${createdUsers.length} test users`);

    // Create some bookings so users can review agencies
    const bookings = [];
    const userIndex = 1; // Start from index 1 (skip admin)

    // Get some buses for each agency to create bookings
    for (let i = 0; i < createdAgencies.length; i++) {
      const agency = createdAgencies[i];
      const agencyBuses = await Bus.find({ agency: agency._id }).limit(3);

      if (agencyBuses.length > 0) {
        // Create bookings for different users
        for (let j = 0; j < Math.min(3, agencyBuses.length); j++) {
          const bus = agencyBuses[j];
          const user =
            createdUsers[((userIndex + i + j) % (createdUsers.length - 1)) + 1]; // Skip admin

          const booking = await Booking.create({
            user: user._id,
            bus: bus._id,
            seats: [],
            passengers: [
              {
                name: user.name,
                age: 25,
                seatNumber: "A1",
                gender: "Male",
              },
            ],
            route: {
              from: bus.route.from,
              to: bus.route.to,
              date: bus.departureTime,
              departureTime: bus.departureTime.toISOString(),
              arrivalTime: bus.arrivalTime.toISOString(),
            },
            totalPrice: bus.price,
            status: "Completed",
            paymentStatus: "Paid",
            bookingId: `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          });
          bookings.push(booking);
        }
      }
    }
    console.log(`✅ Created ${bookings.length} bookings for review purposes`);

    // Seed reviews for each agency
    const reviewComments = [
      "Excellent service! Very comfortable buses and punctual. Highly recommend.",
      "Good experience overall. Buses are clean and staff is friendly.",
      "Best bus service in Cameroon! Wi-Fi works well and seats are very comfortable.",
      "Reliable and affordable. Would book again.",
      "Decent service but could improve on punctuality.",
      "Great value for money. Comfortable journey.",
      "Professional service with modern amenities.",
      "Very satisfied with the booking process and journey.",
      "Clean buses and helpful staff. Will use again.",
      "Good service, though could use more frequent departures.",
    ];

    const routes = [
      "Yaoundé → Douala",
      "Douala → Yaoundé",
      "Yaoundé → Bamenda",
      "Bamenda → Douala",
      "Douala → Bafoussam",
      "Buea → Yaoundé",
      "Yaoundé → Buea",
      "Bamenda → Yaoundé",
    ];

    const reviews = [];
    for (let i = 0; i < createdAgencies.length; i++) {
      const agency = createdAgencies[i];

      // Get buses for this agency
      const agencyBuses = await Bus.find({ agency: agency._id }).limit(5);
      const agencyBookingsFiltered = bookings.filter((b) =>
        agencyBuses.some((ab) => ab._id.toString() === b.bus?.toString())
      );

      // Create 5-8 reviews per agency with different ratings
      const numReviews = Math.floor(Math.random() * 4) + 5; // 5-8 reviews
      const ratings = [5, 5, 4, 4, 4, 3, 3, 5]; // Mix of ratings

      for (let j = 0; j < numReviews && j < createdUsers.length - 1; j++) {
        const user =
          createdUsers[((userIndex + i + j) % (createdUsers.length - 1)) + 1];
        const rating = ratings[j % ratings.length];
        const comment = reviewComments[(i + j) % reviewComments.length];
        const route = routes[(i + j) % routes.length];

        // Create review with a slight delay to ensure unique timestamps
        const review = await Review.create({
          user: user._id,
          agency: agency._id,
          rating: rating,
          comment: comment,
          route: route,
          createdAt: new Date(Date.now() - j * 24 * 60 * 60 * 1000), // Stagger dates
        });
        reviews.push(review);
      }
    }

    console.log(
      `✅ Seeded ${reviews.length} reviews across ${createdAgencies.length} agencies`
    );

    // Update agency ratings based on reviews
    for (const agency of createdAgencies) {
      await Review.updateAgencyRating(agency._id);
    }
    console.log("✅ Updated agency ratings from reviews");

    // Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   - Agencies: ${createdAgencies.length}`);
    console.log(`   - Routes: ${routesData.length} unique routes`);
    console.log(`   - Buses: ${buses.length} buses scheduled`);
    console.log(`   - Users: ${createdUsers.length} test users`);
    console.log(`   - Bookings: ${bookings.length} completed bookings`);
    console.log(`   - Reviews: ${reviews.length} reviews`);
    console.log(`   - Test Admin: admin@busbooking.com / admin123`);
    console.log(
      `   - Test Users: marie@example.com, jean@example.com, etc. (password: password123)`
    );
    console.log(
      "\n💡 You can now start using the application with real Cameroonian bus data!"
    );
    console.log("\n📌 Popular routes seeded:");
    console.log("   - Yaoundé ↔ Douala");
    console.log("   - Yaoundé ↔ Bamenda");
    console.log("   - Douala ↔ Bamenda");
    console.log("   - Douala ↔ Bafoussam");
    console.log("   - Buea ↔ Yaoundé");
    console.log("   - And many more...");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
seedData();
