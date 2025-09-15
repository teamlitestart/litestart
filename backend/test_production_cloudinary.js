const cloudinary = require('cloudinary').v2;

// Test with the exact same configuration that should be on Render
cloudinary.config({
  cloud_name: 'dqmhknrgf',
  api_key: '747439425932213',
  api_secret: 'LNjSe10kA-MmchcYzQa5nxbIzwY'
});

async function testProductionCloudinary() {
  try {
    console.log('\n🧪 Testing production Cloudinary configuration...');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key);
    console.log('API Secret:', cloudinary.config().api_secret ? 'Present' : 'Missing');
    
    console.log('\n1. Testing basic API connection...');
    const resources = await cloudinary.api.resources({ max_results: 1 });
    console.log('✅ API connection successful');
    
    console.log('\n2. Testing file upload to litestart-cvs folder...');
    const testContent = 'Test CV for production - ' + new Date().toISOString();
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:text/plain;base64,${Buffer.from(testContent).toString('base64')}`,
      {
        folder: 'litestart-cvs',
        resource_type: 'raw',
        public_id: 'test_production_cv_' + Date.now(),
        format: 'txt',
        use_filename: true
      }
    );
    
    console.log('✅ File uploaded successfully!');
    console.log('URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    console.log('Folder:', uploadResult.folder);

    console.log('\n3. Testing folder access...');
    const folderResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'litestart-cvs/',
      max_results: 5
    });
    console.log('✅ Folder accessible!');
    console.log(`Found ${folderResources.resources.length} files in litestart-cvs folder`);

    console.log('\n4. Cleaning up test file...');
    await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: 'raw' });
    console.log('✅ Test file deleted successfully');
    
    console.log('\n🎉 All production Cloudinary tests passed!');
    console.log('✅ The CV upload should work in production now.');
    
  } catch (error) {
    console.error('\n❌ Production Cloudinary test failed:');
    console.error('Error message:', error.message || 'No message');
    console.error('Error code:', error.http_code || 'No HTTP code');
    console.error('Error name:', error.name || 'No name');
    
    if (error.message && error.message.includes('Invalid API key or secret')) {
      console.log('\n💡 The API secret might not be updated correctly in Render');
    } else if (error.http_code === 401) {
      console.log('\n💡 Authentication failed - API credentials issue');
    } else if (error.http_code === 403) {
      console.log('\n💡 Access forbidden - check API permissions');
    }
    
    console.error('\nFull error:', error);
  }
}

testProductionCloudinary();
