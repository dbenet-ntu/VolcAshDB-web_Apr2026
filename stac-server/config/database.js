const mongoose = require('mongoose');

/**
 * MongoDB Connection Configuration
 * Connects to MongoDB Atlas using the connection string from .env
 * Returns the mongoose instance for model registration
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB Atlas connected for STAC server');
    return mongoose;
  } catch (error) {
    console.error('✗ MongoDB Atlas connection error:', error);
    throw error;
  }
};

module.exports = { connectDB, mongoose };
