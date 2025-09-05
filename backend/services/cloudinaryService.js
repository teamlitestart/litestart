const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'litestart-cvs', // Folder in Cloudinary
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
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
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

// Function to upload file to Cloudinary
const uploadFile = async (file) => {
  try {
    // When using multer-storage-cloudinary, the file is already uploaded
    // and the result is available in file.path (which is the Cloudinary URL)
    if (file.path && file.path.includes('cloudinary.com')) {
      return {
        success: true,
        url: file.path,
        publicId: file.filename, // This is the public_id
        filename: file.originalname,
        size: file.size,
        format: file.mimetype.split('/')[1] || 'unknown'
      };
    } else {
      // Fallback: upload manually if multer-storage-cloudinary didn't work
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'litestart-cvs',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.original_filename,
        size: result.bytes,
        format: result.format
      };
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to delete file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get file info
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      info: result
    };
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  getFileInfo,
  cloudinary
};
