const mongoose = require('mongoose');

// Prevent query buffering indefinitely when offline
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinematica';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Notice]: Could not connect to local MongoDB (${error.message}). Serving in-memory resilient catalog.`);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = connectDB;
module.exports.getStatus = getStatus;
