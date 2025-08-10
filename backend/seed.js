// seed.js (without faker)
const mongoose = require('mongoose');
require('dotenv').config();

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  type: String, // 'technician' or 'job_creator'
});

const User = mongoose.model('User', userSchema);

// Manually defined users
const users = [
  // Technicians
  {
    username: "Alice Technician",
    email: "alice.tech@example.com",
    password: "techpass1",
    type: "technician",
  },
  {
    username: "Bob Technician",
    email: "bob.tech@example.com",
    password: "techpass2",
    type: "technician",
  },
  {
    username: "Charlie Technician",
    email: "charlie.tech@example.com",
    password: "techpass3",
    type: "technician",
  },
  {
    username: "Diana Technician",
    email: "diana.tech@example.com",
    password: "techpass4",
    type: "technician",
  },
  {
    username: "Ethan Technician",
    email: "ethan.tech@example.com",
    password: "techpass5",
    type: "technician",
  },

  // Job Creators
  {
    username: "Nishan Dhananjaya Morathota",
    email: "nishandm97@gmail.com",
    password: "abc123@#",
    type: "job_creator",
  },
  {
    username: "Fiona Creator",
    email: "fiona.creator@example.com",
    password: "creatorpass1",
    type: "job_creator",
  },
  {
    username: "George Creator",
    email: "george.creator@example.com",
    password: "creatorpass2",
    type: "job_creator",
  },
  {
    username: "Hannah Creator",
    email: "hannah.creator@example.com",
    password: "creatorpass3",
    type: "job_creator",
  },
  {
    username: "Ivan Creator",
    email: "ivan.creator@example.com",
    password: "creatorpass4",
    type: "job_creator",
  },
];

// Seeding function
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    console.log('🗑️  Existing users cleared');

    const insertedUsers = await User.insertMany(users);
    console.log('✅ Users seeded:');
    insertedUsers.forEach(user => {
      console.log(`🧑 ${user.username} (${user.type}) - ${user.email}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
}

seed();
