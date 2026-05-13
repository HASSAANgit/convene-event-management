const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check user
    let user = await User.findOne({ email: 'user@demo.com' });
    const salt = await bcrypt.genSalt(10);
    const userPass = await bcrypt.hash('Convene-Demo-2026!', salt);
    if (!user) {
      await User.create({ name: 'Demo User', email: 'user@demo.com', password: userPass, role: 'organizer' });
    } else {
      user.password = userPass;
      user.role = 'organizer';
      await user.save();
    }
    
    // Check admin
    let admin = await User.findOne({ email: 'admin@demo.com' });
    const adminPass = await bcrypt.hash('Admin-Demo-2026!', salt);
    if (!admin) {
      await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: adminPass, role: 'admin' });
    } else {
      admin.password = adminPass;
      admin.role = 'admin';
      await admin.save();
    }
    
    console.log('Seed success');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
