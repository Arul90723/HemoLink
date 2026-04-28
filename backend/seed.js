require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Hospital = require('./models/Hospital');
const Donor = require('./models/Donor');

// Seeding logic module

// Coordinates around Palakkad, Kerala (approx 10.7867, 76.6548)
const hospitalsData = [
  { name: 'Palakkad District Hospital', lat: 10.7867, lng: 76.6548, email: 'districthospital@palakkad.gov' },
  { name: 'Ahalia Foundation Eye Hospital', lat: 10.8225, lng: 76.7111, email: 'ahalia@hospital.com' },
  { name: 'Lakshmi Nursing Home', lat: 10.7711, lng: 76.6500, email: 'lakshmi@hospital.com' },
  { name: 'Welcare Hospital', lat: 10.7800, lng: 76.6600, email: 'welcare@hospital.com' },
  { name: 'Trinity Eye Hospital', lat: 10.7900, lng: 76.6450, email: 'trinity@hospital.com' }
];

const donorsData = [
  { phone: '9876543210', bloodGroup: 'O+', email: 'donor1@gmail.com' },
  { phone: '9876543211', bloodGroup: 'A-', email: 'donor2@gmail.com' },
  { phone: '9876543212', bloodGroup: 'B+', email: 'donor3@gmail.com' },
  { phone: '9876543213', bloodGroup: 'AB+', email: 'donor4@gmail.com' },
  { phone: '9876543214', bloodGroup: 'O-', email: 'donor5@gmail.com' }
];

const generateRandomInventory = () => ({
  'A+': Math.floor(Math.random() * 20),
  'A-': Math.floor(Math.random() * 5),
  'B+': Math.floor(Math.random() * 15),
  'B-': Math.floor(Math.random() * 5),
  'O+': Math.floor(Math.random() * 25),
  'O-': Math.floor(Math.random() * 10),
  'AB+': Math.floor(Math.random() * 5),
  'AB-': Math.floor(Math.random() * 2)
});

const seedDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Donor.deleteMany({});

    console.log('Seeding Hospitals...');
    for (const data of hospitalsData) {
      const user = new User({ email: data.email, passwordHash: 'password123', role: 'HOSPITAL' });
      await user.save(); // Password will be hashed by pre-save hook

      const hospital = new Hospital({
        userId: user._id,
        name: data.name,
        license: `LIC-${Math.floor(Math.random() * 100000)}`,
        location: { lat: data.lat, lng: data.lng },
        inventory: generateRandomInventory()
      });
      await hospital.save();
    }

    console.log('Seeding Donors...');
    for (const data of donorsData) {
      const user = new User({ email: data.email, passwordHash: 'password123', role: 'DONOR' });
      await user.save();

      const donor = new Donor({
        userId: user._id,
        phone: data.phone,
        bloodGroup: data.bloodGroup
      });
      await donor.save();
    }

    console.log('✅ Database seeded successfully with mock data for Palakkad region!');
    return { success: true };
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  // If run directly via node seed.js
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hemolink')
    .then(() => seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1)));
}
