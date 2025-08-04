const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const User = require('./models/User');
const { sendThankYouEmail } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB connection with retry logic
let mongoConnected = false;

const connectToMongo = async (retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to connect to MongoDB (attempt ${i + 1}/${retries})...`);
      
      // Close any existing connections first
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000, // 15 second timeout
        socketTimeoutMS: 60000, // 60 second timeout
        connectTimeoutMS: 15000, // 15 second connection timeout
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // Disable mongoose buffering
        maxPoolSize: 10, // Connection pool size
        minPoolSize: 1, // Minimum pool size
        maxIdleTimeMS: 30000, // Max idle time
        retryWrites: true,
        w: 'majority'
      });
      
      mongoConnected = true;
      console.log('✅ Successfully connected to MongoDB');
      return true;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error.message);
      console.error('Full error:', error);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.2, 5000); // Cap delay at 5 seconds
      }
    }
  }
  console.error('❌ Failed to connect to MongoDB after all retries');
  return false;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: mongoConnected,
    mongoReadyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
    connectionAttempts: connectionAttempts || 0
  });
});

// Periodic reconnection attempt
let connectionAttempts = 0;
const attemptReconnection = async () => {
  if (!mongoConnected) {
    connectionAttempts++;
    console.log(`🔄 Periodic reconnection attempt #${connectionAttempts}`);
    const success = await connectToMongo(3, 2000);
    if (success) {
      console.log('✅ Periodic reconnection successful');
    }
  }
};

// Try to reconnect every 30 seconds if not connected
setInterval(attemptReconnection, 30000);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, userType } = req.body;
    
    // Ensure MongoDB connection before proceeding
    if (!mongoConnected) {
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable. Please try again.',
          retry: true
        });
      }
    }
    
    // Create user in database
    const user = new User({
      name,
      email,
      userType,
      isEmailVerified: true
    });
    await user.save().catch(() => {}); // Ignore duplicate errors
    
    // Send thank you email
    const emailResult = await sendThankYouEmail({ name, email, userType });
    
    res.status(201).json({ 
      message: 'Thank you for signing up! You have been added to the waitlist.',
      user: {
        name,
        email,
        userType,
        isEmailVerified: true
      },
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(201).json({ message: 'Thank you for signing up! You have been added to the waitlist.' });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', async (req, res) => {
  try {
    // Ensure MongoDB connection before proceeding
    if (!mongoConnected) {
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable. Please try again.',
          retry: true
        });
      }
    }
    
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure MongoDB connection before proceeding
    if (!mongoConnected) {
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable. Please try again.',
          retry: true
        });
      }
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all users (for testing/reset purposes)
app.delete('/api/users', async (req, res) => {
  try {
    // Ensure MongoDB connection before proceeding
    if (!mongoConnected) {
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable. Please try again.',
          retry: true
        });
      }
    }
    
    const result = await User.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} users successfully` });
  } catch (error) {
    console.error('Delete all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize MongoDB connection
connectToMongo()
.then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } else {
    console.log('⚠️ Server starting without MongoDB connection - will retry on first request');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (MongoDB connection pending)`);
    });
  }
})
.catch((err) => {
  console.error('❌ Server startup error:', err);
}); 