const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Standard MongoDB connection failed, attempting to start memory server... (${error.message})`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Memory Server Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`❌ MongoDB Memory Server connection error: ${memError.message}`);
      process.exit(1);
    }
  }

  // Seed default demo users
  try {
    const bcrypt = require('bcryptjs');
    const User = require('../models/User');
    
    // Check user
    let user = await User.findOne({ email: 'user@demo.com' });
    if (!user) {
      await User.create({ name: 'Demo User', email: 'user@demo.com', password: 'Convene-Demo-2026!', role: 'organizer' });
      console.log('Seeded demo user');
    }
    
    // Check admin
    let admin = await User.findOne({ email: 'admin@demo.com' });
    if (!admin) {
      await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: 'Admin-Demo-2026!', role: 'admin' });
      console.log('Seeded demo admin');
    }
  } catch (err) {
    console.error('Failed to seed demo users:', err.message);
  }
};

module.exports = connectDB;
