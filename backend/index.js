const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const User = require('./models/User');
const { sendThankYouEmail } = require('./services/emailService');

// Google Analytics setup
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3001;

// Google Analytics service account credentials
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 
  JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) : null;

// Initialize Google Analytics Data API client
const analyticsDataClient = new google.analyticsdata({
  version: 'v1beta',
  auth: new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  })
});

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
    const { reason = 'Simulated bounce for testing' } = req.body;
    
    console.log(`Simulating bounce for email: ${email} with reason: ${reason}`);
    
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
      user.emailDeliveryStatus = 'bounced';
      user.emailBounceReason = reason;
      user.emailBounceDate = new Date();
      await user.save();
      console.log(`Updated user ${user.name} (${email}) to unverified due to simulated bounce: ${reason}`);
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

// Endpoint to get email delivery statistics
app.get('/api/email-stats', async (req, res) => {
  try {
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for email stats');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ message: 'Database temporarily unavailable' });
      }
    }
    
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const bouncedUsers = await User.countDocuments({ emailDeliveryStatus: 'bounced' });
    const failedUsers = await User.countDocuments({ emailDeliveryStatus: 'failed' });
    const complainedUsers = await User.countDocuments({ emailDeliveryStatus: 'complained' });
    const sentUsers = await User.countDocuments({ emailDeliveryStatus: 'sent' });
    
    res.json({
      total: totalUsers,
      verified: verifiedUsers,
      bounced: bouncedUsers,
      failed: failedUsers,
      complained: complainedUsers,
      sent: sentUsers,
      unverified: totalUsers - verifiedUsers,
      deliveryRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Email stats error:', error);
    res.status(500).json({ message: 'Error getting email stats' });
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

// Enhanced email bounce webhook endpoint
app.post('/api/email-bounce', async (req, res) => {
  try {
    const { recipient, event, reason, timestamp } = req.body;
    
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
      user.emailDeliveryStatus = 'bounced';
      user.emailBounceReason = reason || 'Email bounced';
      user.emailBounceDate = timestamp ? new Date(timestamp * 1000) : new Date();
      await user.save();
      console.log(`Updated user ${user.name} (${recipient}) to unverified due to email bounce: ${reason}`);
    } else {
      console.log(`No user found with email ${recipient} for bounce update`);
    }
    
    res.status(200).json({ message: 'Bounce processed successfully' });
  } catch (error) {
    console.error('Email bounce processing error:', error);
    res.status(500).json({ message: 'Error processing bounce' });
  }
});

// Enhanced email complaint webhook endpoint (for spam reports)
app.post('/api/email-complaint', async (req, res) => {
  try {
    const { recipient, event, reason, timestamp } = req.body;
    
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
      user.emailDeliveryStatus = 'complained';
      user.emailBounceReason = reason || 'Email marked as spam';
      user.emailBounceDate = timestamp ? new Date(timestamp * 1000) : new Date();
      await user.save();
      console.log(`Updated user ${user.name} (${recipient}) to unverified due to email complaint: ${reason}`);
    } else {
      console.log(`No user found with email ${recipient} for complaint update`);
    }
    
    res.status(200).json({ message: 'Complaint processed successfully' });
  } catch (error) {
    console.error('Email complaint processing error:', error);
    res.status(500).json({ message: 'Error processing complaint' });
  }
});

// New endpoint to manually verify email delivery status
app.post('/api/verify-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Force a fresh connection attempt
    if (!mongoConnected || mongoose.connection.readyState !== 1) {
      console.log('Forcing fresh MongoDB connection for email verification');
      const reconnected = await connectToMongo(3, 1000);
      if (!reconnected) {
        return res.status(503).json({ message: 'Database temporarily unavailable' });
      }
    }
    
    // Find the user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify email delivery
    const { verifyEmailDelivery } = require('./services/emailService');
    const verificationResult = await verifyEmailDelivery(email);
    
    // Update user based on verification result
    user.isEmailVerified = verificationResult.verified;
    user.emailDeliveryStatus = verificationResult.status;
    if (verificationResult.verified) {
      user.emailVerifiedDate = new Date();
    }
    await user.save();
    
    res.json({
      success: true,
      user: user,
      verification: verificationResult
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
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
    
    // Create user in database with enhanced email verification tracking
    const user = new User({
      name,
      email,
      userType,
      isEmailVerified: emailResult.success && emailResult.deliveryStatus === 'sent',
      emailDeliveryStatus: emailResult.deliveryStatus || 'failed',
      emailSentDate: emailResult.sentDate || null,
      emailVerifiedDate: emailResult.success ? new Date() : null
    });
    await user.save().catch(() => {}); // Ignore duplicate errors
    
    // Provide appropriate response based on email result
    if (emailResult.success && emailResult.deliveryStatus === 'sent') {
      res.status(201).json({ 
        message: 'Thank you for signing up! You have been added to the waitlist.',
        user: {
          name,
          email,
          userType,
          isEmailVerified: true,
          emailDeliveryStatus: 'sent'
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
          isEmailVerified: false,
          emailDeliveryStatus: emailResult.deliveryStatus || 'failed'
        },
        emailSent: false,
        emailError: emailResult.error || emailResult.reason
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

// Google Analytics endpoint
app.get('/api/analytics/ga4', async (req, res) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!SERVICE_ACCOUNT_KEY) {
      return res.status(500).json({ error: 'Google Analytics credentials not configured' });
    }

    console.log('Fetching GA4 data for property:', propertyId);

    // Get today's comprehensive data
    const todayResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: 'today',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get this month's comprehensive data
    const monthResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get this year's comprehensive data
    const yearResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '365daysAgo',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get total data (all time)
    const totalResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '2020-01-01',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' }
        ]
      }
    });

    // Get traffic sources data
    const trafficSourcesResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }],
        limit: 10
      }
    });

    // Get top pages data
    const topPagesResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 10
      }
    });

    // Process today's data
    const todayData = todayResponse.data.rows?.[0] || {};
    const today = parseInt(todayData.metricValues?.[0]?.value || '0');
    const todaySessions = parseInt(todayData.metricValues?.[1]?.value || '0');
    const todayUsers = parseInt(todayData.metricValues?.[2]?.value || '0');
    const todayDuration = parseFloat(todayData.metricValues?.[3]?.value || '0') / 60; // Convert to minutes
    const todayBounceRate = parseFloat(todayData.metricValues?.[4]?.value || '0');

    // Process month's data
    const monthData = monthResponse.data.rows?.[0] || {};
    const thisMonth = parseInt(monthData.metricValues?.[0]?.value || '0');
    const monthSessions = parseInt(monthData.metricValues?.[1]?.value || '0');
    const monthUsers = parseInt(monthData.metricValues?.[2]?.value || '0');
    const monthDuration = parseFloat(monthData.metricValues?.[3]?.value || '0') / 60; // Convert to minutes
    const monthBounceRate = parseFloat(monthData.metricValues?.[4]?.value || '0');

    // Process year's data
    const yearData = yearResponse.data.rows?.[0] || {};
    const thisYear = parseInt(yearData.metricValues?.[0]?.value || '0');

    // Process total data
    const totalData = totalResponse.data.rows?.[0] || {};
    const total = parseInt(totalData.metricValues?.[0]?.value || '0');

    // Process traffic sources
    let trafficSources = [];
    try {
      trafficSources = trafficSourcesResponse.data.rows?.map(row => {
        const channel = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value || '0');
        
        console.log('Processing row:', { channel, sessions });
        
        // Create a more descriptive source name based on channel
        let displayName = channel;
        let iconType = 'default';
        
        // Enhance social media detection based on channel
        if (channel.toLowerCase().includes('social')) {
          displayName = 'Social Media';
          iconType = 'social';
        } else if (channel.toLowerCase().includes('organic')) {
          displayName = 'Organic Search';
          iconType = 'search';
        } else if (channel.toLowerCase().includes('direct')) {
          displayName = 'Direct Traffic';
          iconType = 'direct';
        } else if (channel.toLowerCase().includes('referral')) {
          displayName = 'Referral Traffic';
          iconType = 'referral';
        } else if (channel.toLowerCase().includes('email')) {
          displayName = 'Email';
          iconType = 'email';
        } else if (channel.toLowerCase().includes('paid')) {
          displayName = 'Paid Search';
          iconType = 'paid';
        }
        
        return {
          source: displayName,
          sessions: sessions,
          originalSource: channel,
          medium: channel,
          channel: channel,
          iconType: iconType
        };
      }) || [];
      
      console.log('Enhanced traffic sources processed:', trafficSources);
    } catch (error) {
      console.log('Enhanced traffic sources failed, falling back to basic method:', error);
      // Fallback to basic traffic sources
      trafficSources = trafficSourcesResponse.data.rows?.map(row => ({
        source: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value || '0'),
        originalSource: row.dimensionValues[0].value,
        medium: row.dimensionValues[0].value,
        channel: row.dimensionValues[0].value,
        iconType: 'default'
      })) || [];
    }

    // Process top pages
    const topPages = topPagesResponse.data.rows?.map(row => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value || '0')
    })) || [];

    const analyticsData = {
      today,
      thisMonth,
      thisYear,
      total,
      todaySessions,
      monthSessions,
      todayUsers,
      monthUsers,
      todayDuration,
      monthDuration,
      todayBounceRate,
      monthBounceRate,
      trafficSources,
      topPages
    };

    console.log('Analytics data prepared:', analyticsData);
    res.json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      details: error.message 
    });
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