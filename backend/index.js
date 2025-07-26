const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const User = require('./models/User');
const { sendVerificationEmail } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create new user
    const user = new User({
      name,
      email,
      userType,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    
    await user.save();
    
    // Send verification email
    try {
      await sendVerificationEmail(email, name, userType, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the signup if email fails, but log it
    }
    
    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification endpoint
app.get('/api/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token' 
      });
    }
    
    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();
    
    res.json({ 
      message: 'Email verified successfully! You can now log in to your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified
      }
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', async (req, res) => {
  try {
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
    const result = await User.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} users successfully` });
  } catch (error) {
    console.error('Delete all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 