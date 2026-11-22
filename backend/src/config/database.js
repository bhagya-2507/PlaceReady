const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placeready_db', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnection...');
    });

    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    console.error('💡 Ensure local MongoDB is running (`net start MongoDB`) or set MONGODB_URI in backend/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
