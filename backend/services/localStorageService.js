const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `cv_${name}_${uniqueSuffix}${ext}`);
  }
});

// Create multer upload middleware
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/plain';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG, and TXT files are allowed'));
    }
  }
});

// Function to handle uploaded file
const handleUploadedFile = async (file) => {
  try {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    // Create a local URL for the file
    const localUrl = `/uploads/${file.filename}`;
    
    return {
      success: true,
      url: localUrl,
      publicId: file.filename,
      filename: file.originalname,
      size: file.size,
      format: path.extname(file.originalname).slice(1) || 'unknown',
      path: file.path
    };
  } catch (error) {
    console.error('Local storage error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to delete file
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get file info
const getFileInfo = async (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        success: true,
        info: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Get file info error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  upload,
  handleUploadedFile,
  deleteFile,
  getFileInfo
};
