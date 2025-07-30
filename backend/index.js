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
    // Always create a new user entry, even if the email exists, or just return success
    const user = new User({
      name,
      email,
      userType,
      isEmailVerified: true
    });
    await user.save().catch(() => {}); // Ignore duplicate errors
    res.status(201).json({ 
      message: 'Thank you for signing up! You have been added to the waitlist.',
      user: {
        name,
        email,
        userType,
        isEmailVerified: true
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(201).json({ message: 'Thank you for signing up! You have been added to the waitlist.' });
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

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 