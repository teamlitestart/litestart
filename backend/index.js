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

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connected');
  mongoConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB connection error:', err);
  mongoConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB disconnected');
  mongoConnected = false;
});

const connectToMongo = async (retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to connect to MongoDB (attempt ${i + 1}/${retries})...`);
      console.log('MongoDB URI:', process.env.MONGO_URI ? 'Present' : 'Missing');
      
      // Close any existing connections first
      if (mongoose.connection.readyState !== 0) {
        console.log('Disconnecting existing connection...');
        await mongoose.disconnect();
      }
      
      // Use the same connection options that work in the test endpoint
      const connectionOptions = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
      
      console.log('Attempting connection with working options...');
      
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      
      // Verify connection is actually established
      if (mongoose.connection.readyState === 1) {
        mongoConnected = true;
        console.log('✅ Successfully connected to MongoDB');
        console.log('Connection state:', mongoose.connection.readyState);
        return true;
      } else {
        throw new Error(`Connection failed - readyState: ${mongoose.connection.readyState}`);
      }
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error.message);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      
      // Log specific error details
      if (error.code === 'ENOTFOUND') {
        console.error('DNS resolution failed - check MongoDB URI');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused - check MongoDB Atlas IP whitelist');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('Connection timeout - check network/firewall');
      } else if (error.name === 'MongoServerSelectionError') {
        console.error('Server selection failed - check MongoDB cluster status');
      }
      
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

// Manual test endpoint to simulate a bounce (for testing)
app.post('/api/simulate-bounce/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log(`Simulating bounce for email: ${email}`);
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for bounce simulation');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ message: 'Database temporarily unavailable' });
      }
    }
    
    // Find and update the user's email verification status
    const user = await User.findOne({ email: email });
    if (user) {
      user.isEmailVerified = false;
      await user.save();
      console.log(`Updated user ${user.name} (${email}) to unverified due to simulated bounce`);
      res.json({ 
        success: true, 
        message: `User ${user.name} marked as unverified due to simulated bounce`,
        user: user
      });
    } else {
      console.log(`No user found with email ${email} for bounce simulation`);
      res.status(404).json({ 
        success: false, 
        message: `No user found with email ${email}` 
      });
    }
  } catch (error) {
    console.error('Bounce simulation error:', error);
    res.status(500).json({ message: 'Error simulating bounce' });
  }
});

// Test webhook endpoint to verify Mailgun configuration
app.post('/api/test-webhook', async (req, res) => {
  try {
    console.log('Test webhook received:', JSON.stringify(req.body, null, 2));
    res.status(200).json({ 
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString(),
      body: req.body
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ message: 'Test webhook error' });
  }
});

// Email bounce webhook endpoint
app.post('/api/email-bounce', async (req, res) => {
  try {
    const { recipient, event, reason } = req.body;
    
    console.log(`Email bounce detected for ${recipient}: ${event} - ${reason}`);
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for email bounce');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ message: 'Database temporarily unavailable' });
      }
    }
    
    // Find and update the user's email verification status
    const user = await User.findOne({ email: recipient });
    if (user) {
      user.isEmailVerified = false;
      await user.save();
      console.log(`Updated user ${user.name} (${recipient}) to unverified due to email bounce`);
    } else {
      console.log(`No user found with email ${recipient} for bounce update`);
    }
    
    res.status(200).json({ message: 'Bounce processed successfully' });
  } catch (error) {
    console.error('Email bounce processing error:', error);
    res.status(500).json({ message: 'Error processing bounce' });
  }
});

// Email complaint webhook endpoint (for spam reports)
app.post('/api/email-complaint', async (req, res) => {
  try {
    const { recipient, event, reason } = req.body;
    
    console.log(`Email complaint detected for ${recipient}: ${event} - ${reason}`);
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for email complaint');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ message: 'Database temporarily unavailable' });
      }
    }
    
    // Find and update the user's email verification status
    const user = await User.findOne({ email: recipient });
    if (user) {
      user.isEmailVerified = false;
      await user.save();
      console.log(`Updated user ${user.name} (${recipient}) to unverified due to email complaint`);
    } else {
      console.log(`No user found with email ${recipient} for complaint update`);
    }
    
    res.status(200).json({ message: 'Complaint processed successfully' });
  } catch (error) {
    console.error('Email complaint processing error:', error);
    res.status(500).json({ message: 'Error processing complaint' });
  }
});

// Test MongoDB connection endpoint
app.get('/test-mongo', async (req, res) => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
    
    // Try a direct connection without retry logic
    const testConnection = await mongoose.createConnection(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Test connection successful!');
    await testConnection.close();
    res.json({ success: true, message: 'MongoDB connection test successful' });
  } catch (error) {
    console.error('MongoDB test connection failed:', error);
    res.json({ 
      success: false, 
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      fullError: error.toString()
    });
  }
});

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
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for signup');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable. Please try again.',
          retry: true
        });
      }
    }
    
    // Send thank you email first to validate email existence
    const emailResult = await sendThankYouEmail({ name, email, userType });
    
    // Create user in database with email verification status based on email success
    const user = new User({
      name,
      email,
      userType,
      isEmailVerified: emailResult.success // true if email sent successfully, false if failed
    });
    await user.save().catch(() => {}); // Ignore duplicate errors
    
    // Provide appropriate response based on email result
    if (emailResult.success) {
      res.status(201).json({ 
        message: 'Thank you for signing up! You have been added to the waitlist.',
        user: {
          name,
          email,
          userType,
          isEmailVerified: true
        },
        emailSent: true
      });
    } else {
      res.status(201).json({ 
        message: 'Thank you for signing up! However, we could not send a confirmation email. Please check your email address and try again.',
        user: {
          name,
          email,
          userType,
          isEmailVerified: false
        },
        emailSent: false,
        emailError: emailResult.error
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(201).json({ message: 'Thank you for signing up! You have been added to the waitlist.' });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', async (req, res) => {
  try {
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for /api/users');
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
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for delete user');
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
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for delete all users');
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