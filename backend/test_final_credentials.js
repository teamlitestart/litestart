const cloudinary = require('cloudinary').v2;

// Test with the CORRECT credentials
cloudinary.config({
  cloud_name: 'drt7yjnic',
  api_key: '435546236625715',
  api_secret: 'LNjSe10kA-MmchcYzQa5nxbIzwY'
});

async function testFinalCredentials() {
  try {
    console.log('\n🎯 Testing with CORRECT credentials...');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key);
    console.log('API Secret:', cloudinary.config().api_secret ? 'Present' : 'Missing');
    
    console.log('\n1. Testing basic API connection...');
    const resources = await cloudinary.api.resources({ max_results: 1 });
    console.log('✅ API connection successful');
    
    console.log('\n2. Testing file upload to litestart-cvs folder...');
    const testContent = 'Test CV with CORRECT credentials - ' + new Date().toISOString();
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:text/plain;base64,${Buffer.from(testContent).toString('base64')}`,
      {
        folder: 'litestart-cvs',
        resource_type: 'raw',
        public_id: 'test_final_' + Date.now(),
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
    
    console.log('\n🎉 ALL TESTS PASSED! CV upload will work perfectly now!');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error message:', error.message || 'No message');
    console.error('Error code:', error.http_code || 'No HTTP code');
    console.error('Full error:', error);
  }
}

testFinalCredentials();
