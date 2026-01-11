# Database Seeding Scripts

## Using Perplexity to Get Real Data

1. Open `PERPLEXITY_SEED_PROMPT.md` in the backend folder
2. Copy the main prompt and paste it into Perplexity
3. Wait for Perplexity to provide comprehensive data about:
   - Cameroonian cities and routes
   - Bus companies and agencies
   - Typical fares and schedules
   - Bus amenities

4. Use the data provided by Perplexity to update the `seed.js` file with real information

## Running the Seed Script

```bash
# Make sure MongoDB is running
# Make sure your .env file has the correct MONGODB_URI

# Run the seed script
node src/scripts/seed.js

# Or using npm script (add to package.json):
# npm run seed
```

## What Gets Seeded

- **Agencies**: Real bus companies operating in Cameroon
- **Buses**: Bus schedules for the next 30 days on popular routes
- **Test Admin User**: Admin account for testing (admin@busbooking.com / admin123)

## Popular Routes Included (Default Seed)

- Yaoundé ↔ Douala (260km, ~3.5 hours)
- Yaoundé → Bafoussam (~300km, ~4 hours)
- Yaoundé → Bamenda (~370km, ~6 hours)

## Customizing Seed Data

Edit `src/scripts/seed.js` to:
- Add more agencies
- Add more routes
- Adjust prices
- Change schedules
- Add more bus types

## Notes

- The seed script will clear existing agencies and buses by default
- It will NOT delete existing users (except creates test admin if doesn't exist)
- Modify the script before running if you want to keep existing data
