const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinematica';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB at ${process.env.MONGO_URI || 'mongodb://localhost:27017/cinematica'}. Error: ${error.message}`);
    console.warn('[MongoDB Notice]: Running in fallback mode or waiting for MongoDB service to start.');
  }
};

module.exports = connectDB;
