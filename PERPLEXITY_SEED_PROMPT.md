# Perplexity Search Prompt for Database Seeding

Copy and paste this prompt into Perplexity to get comprehensive data for seeding your bus booking database:

---

## PROMPT FOR PERPLEXITY:

```
I'm building a bus booking application for Cameroon and need comprehensive real-world data to seed my MongoDB database. Please provide me with:

1. **Major Cities and Towns in Cameroon:**
   - List at least 15-20 major cities/towns with their French and English names
   - Include cities like Yaoundé, Douala, Bafoussam, Bamenda, etc.
   - Format: City name, Region, approximate population

2. **Popular Bus Routes in Cameroon:**
   - List the most common inter-city bus routes
   - Include origin, destination, approximate distance (km), and typical travel duration (hours/minutes)
   - Examples: Yaoundé to Douala, Douala to Bafoussam, Yaoundé to Bamenda, etc.
   - Provide at least 20-30 popular routes

3. **Bus Companies/Agencies Operating in Cameroon:**
   - List real bus companies/agencies with their:
     - Company name (in French and English if applicable)
     - Operating routes
     - Reputation/rating information if available
     - Typical bus types (Luxury, Standard, Economy)
     - Common amenities offered (AC, WiFi, Charging ports, etc.)
   - Include companies like Amour Mezam, CDC Transport, Express VIP, etc.
   - Provide 10-15 real bus companies

4. **Typical Bus Fares in Cameroon:**
   - Price ranges for different routes (in XAF - Central African CFA Franc)
   - Price differences between Luxury, Standard, and Economy buses
   - Examples: Yaoundé-Douala, Yaoundé-Bafoussam, Douala-Bamenda, etc.
   - Include typical fare ranges for short, medium, and long distance routes

5. **Bus Schedule Information:**
   - Typical departure times for major routes
   - Frequency of buses per day
   - Peak times vs off-peak times
   - Examples: "Yaoundé to Douala typically has buses departing every hour from 6 AM to 8 PM"

6. **Bus Amenities Commonly Available:**
   - List of amenities and their frequency:
     - Air Conditioning (AC)
     - WiFi
     - Charging ports
     - Entertainment systems
     - Luggage space
     - Reclining seats
     - Toilets
     - Snacks/beverages

7. **Additional Context:**
   - Bus capacity (typical number of seats: 40-seater, 50-seater, etc.)
   - Common bus types and their characteristics
   - Seasonal variations in travel (if any)
   - Major bus terminals/stations in cities

Please provide this information in a structured format that can be easily converted to JSON for database seeding. Include real data based on actual bus transportation in Cameroon as of 2024.
```

---

## Additional Prompts You Can Use:

### For Specific Route Details:

```
Give me detailed bus schedule information for the route from Yaoundé to Douala in Cameroon, including:
- Typical departure times throughout the day
- Duration of journey
- Approximate distance
- Common bus companies operating this route
- Price ranges
- Bus capacities
```

### For Bus Company Information:

```
List major intercity bus companies in Cameroon with:
- Full company names
- Routes they operate
- Types of buses (luxury, standard, economy)
- Services and amenities they provide
- Operating years or establishment dates if available
- Contact information or websites if available
```

### For Fare Information:

```
What are the typical bus fares in Cameroon (in XAF/CFA Franc) for:
- Short distance routes (under 200km)
- Medium distance routes (200-500km)
- Long distance routes (over 500km)

Include differences between luxury, standard, and economy bus classes.
```

### For Schedule Patterns:

```
What are the typical bus departure schedules for intercity buses in Cameroon?
- First departure times in the morning
- Last departure times in the evening
- Frequency of departures during the day
- Peak travel times
- Weekend vs weekday schedules
```

---

## After Getting Data from Perplexity:

Once you have the data from Perplexity, you can use it to create a seed script. The data should be formatted like this:

```javascript
// Example structure for seeding
{
  agencies: [
    {
      name: "Amour Mezam",
      description: "...",
      amenities: ["wifi", "ac", "charging"],
      // ...
    }
  ],
  routes: [
    {
      from: "Yaoundé",
      to: "Douala",
      distance: 260,
      duration: 180 // minutes
    }
  ],
  buses: [
    {
      agency: "agency_id",
      route: { from: "Yaoundé", to: "Douala" },
      departureTime: "2024-03-15T08:00:00Z",
      price: 5000,
      // ...
    }
  ]
}
```

You can then create a seed script in `backend/src/scripts/seed.js` to populate your database with this real-world data.
