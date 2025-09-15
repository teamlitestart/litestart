const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'Missing');

// Test Cloudinary connection
async function testCloudinary() {
  try {
    // Create a simple test file
    const fs = require('fs');
    const testContent = 'Test CV Content for LiteStart - ' + new Date().toISOString();
    fs.writeFileSync('test_cv.txt', testContent);
    
    console.log('Uploading test file to Cloudinary...');
    
    // Upload test file
    const result = await cloudinary.uploader.upload('test_cv.txt', {
      folder: 'litestart-cvs',
      resource_type: 'auto',
      public_id: 'test_cv_' + Date.now()
    });
    
    console.log('✅ Cloudinary upload successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    console.log('Size:', result.bytes, 'bytes');
    
    // Clean up test file
    fs.unlinkSync('test_cv.txt');
    
    // Optionally delete from Cloudinary
    console.log('Cleaning up Cloudinary...');
    const deleteResult = await cloudinary.uploader.destroy(result.public_id);
    console.log('Delete result:', deleteResult);
    
    console.log('🎉 Cloudinary test completed successfully!');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    console.error('Full error:', error);
  }
}

testCloudinary();
