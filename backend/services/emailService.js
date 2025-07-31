const nodemailer = require('nodemailer');

// Create transporter for Mailgun SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.eu.mailgun.org',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILGUN_SMTP_USER, // Your Mailgun SMTP username
    pass: process.env.MAILGUN_SMTP_PASS  // Your Mailgun SMTP password
  }
});

// Send thank you email to new signups
const sendThankYouEmail = async (userData) => {
  try {
    const { name, email, userType } = userData;
    
    const mailOptions = {
      from: `"LiteStart" <${process.env.MAILGUN_FROM_EMAIL || 'noreply@litestart.co.uk'}>`,
      replyTo: 'scott@litestart.co.uk', // Replies go to your main email
      to: email,
      subject: 'Welcome to LiteStart! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://www.litestart.co.uk/litestart-logo.png" alt="LiteStart Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to LiteStart!</h1>
            <p style="color: #6b7280; font-size: 18px;">Thank you for joining our waitlist</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${name}! 👋</h2>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
              Thank you for signing up as a <strong>${userType}</strong> on LiteStart! We're excited to have you join our community of students and startups.
            </p>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
              We're currently building the platform and will notify you as soon as we launch. You'll be among the first to know when you can start connecting with ${userType === 'startup' ? 'talented students' : 'innovative startups'}.
            </p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-bottom: 10px;">What's Next?</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>We'll notify you when LiteStart launches</li>
              <li>You'll get early access to our platform</li>
              <li>Connect with ${userType === 'startup' ? 'students from top universities' : 'startups looking for talent'}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Built by student founders at the University of Bristol
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
              If you have any questions, feel free to reply to this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Thank you email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email (keeping for compatibility)
const sendVerificationEmail = async (email, token) => {
  // This function is kept for compatibility but not used
  console.log('Verification email function called but not implemented');
  return { success: false, error: 'Verification emails not implemented' };
};

module.exports = {
  sendThankYouEmail,
  sendVerificationEmail
}; 