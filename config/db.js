const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI= "mongodb+srv://admin:admin@cluster0.rwx7w.mongodb.net/inventory?retryWrites=true&w=majority&appName=Cluster0"


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
