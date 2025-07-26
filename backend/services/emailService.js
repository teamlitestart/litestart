const nodemailer = require('nodemailer');

// Create a test account for development (you can replace with real SMTP later)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
};

// For production, you would use real SMTP settings
const createProductionTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (email, name, userType, verificationToken) => {
  try {
    console.log('Starting email verification process...');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('User Type:', userType);
    console.log('Token:', verificationToken);
    
    // Use Gmail for real emails
    console.log('Setting up Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });
    console.log('Gmail transporter created successfully');
    
    const verificationUrl = `http://localhost:5174/verify-email?token=${verificationToken}`;
    console.log('Verification URL:', verificationUrl);
    
    const mailOptions = {
      from: '"Project 1" <noreply@project1.com>',
      to: email,
      subject: 'Verify Your Email - Project 1',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Project 1</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Project 1!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${name},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up as a <strong>${userType}</strong> on Project 1! 
              To complete your registration, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="color: #667eea; word-break: break-all; margin-bottom: 20px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This link will expire in 24 hours for security reasons.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you didn't create an account with Project 1, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              © 2025 Project 1. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
}; 