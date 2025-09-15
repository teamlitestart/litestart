const express = require('express');
const cors = require('cors');
const path = require('path');
const { upload, handleUploadedFile } = require('./services/localStorageService');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Local CV upload server is running',
    timestamp: new Date().toISOString()
  });
});

// CV upload endpoint
app.post('/api/signup', upload.single('cv'), async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');

    const { name, email, userType } = req.body;

    if (!name || !email || !userType) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, userType'
      });
    }

    let cvData = null;
    
    // Handle CV upload if present
    if (req.file) {
      console.log('Processing CV upload...');
      const uploadResult = await handleUploadedFile(req.file);
      
      if (uploadResult.success) {
        cvData = {
          cvUrl: `http://localhost:${PORT}${uploadResult.url}`,
          cvFilename: uploadResult.filename,
          cvSize: uploadResult.size,
          cvUploadDate: new Date().toISOString()
        };
        console.log('CV uploaded successfully:', cvData);
      } else {
        console.error('CV upload failed:', uploadResult.error);
        return res.status(500).json({
          error: 'CV upload failed',
          details: uploadResult.error
        });
      }
    }

    // Simulate user creation (since we don't have MongoDB)
    const userData = {
      name,
      email,
      userType,
      isEmailVerified: true,
      emailDeliveryStatus: 'simulated',
      createdAt: new Date().toISOString(),
      ...cvData
    };

    console.log('User data created:', userData);

    // Return success response
    res.json({
      message: 'Thank you for signing up! You have been added to the waitlist.',
      user: userData,
      emailSent: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Test users endpoint (simulate database)
const testUsers = [];

app.get('/api/users', (req, res) => {
  res.json(testUsers);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local CV upload server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads will be stored in: ${path.join(__dirname, 'uploads')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
