const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const resetPasswords = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected...');

  const User = require('./models/User');

  const adminHash  = await bcrypt.hash('admin123', 12);
  const demoHash   = await bcrypt.hash('demo123', 12);

  await User.updateOne({ email: 'admin@inkwell.com' },   { $set: { password: adminHash } });
  await User.updateOne({ email: 'author@inkwell.com' },  { $set: { password: demoHash } });
  await User.updateOne({ email: 'reader@inkwell.com' },  { $set: { password: demoHash } });

  console.log('✅ Passwords reset successfully!');
  console.log('   admin@inkwell.com  → admin123');
  console.log('   author@inkwell.com → demo123');
  console.log('   reader@inkwell.com → demo123');

  mongoose.disconnect();
};

resetPasswords().catch(err => { console.error(err); process.exit(1); });