# Email Setup Guide for LiteStart

## 📧 Automatic Thank You Emails

The LiteStart backend now automatically sends thank you emails to new signups. Here's how to set it up:

## 🔧 Gmail Configuration

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication on your Gmail account

### 2. Generate App Password
- Go to Google Account → Security → 2-Step Verification
- Scroll down to "App passwords"
- Generate a new app password for "Mail"
- Copy the 16-character password

### 3. Environment Variables
Add these to your `.env` file in the backend folder:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 🚀 How It Works

### When Someone Signs Up:
1. **User fills form** → Data saved to MongoDB
2. **Backend triggers** → Automatic email sent
3. **User receives** → Beautiful welcome email

### Email Features:
- ✅ **Personalized** - Uses their name and user type
- ✅ **Professional** - LiteStart branding
- ✅ **Informative** - Explains next steps
- ✅ **Responsive** - Looks great on all devices

## 📧 Email Template

The email includes:
- Welcome message with their name
- User type (startup/student) specific content
- What to expect next
- Contact information
- LiteStart branding

## 🔒 Security Notes

- **App passwords** are more secure than regular passwords
- **Environment variables** keep credentials safe
- **Gmail SMTP** is reliable and trusted
- **Error handling** prevents email failures from breaking signup

## 🛠️ Testing

To test the email system:
1. Set up the environment variables
2. Restart your backend server
3. Sign up with a test email
4. Check the inbox for the welcome email

## 📊 Monitoring

The backend logs email sending status:
- ✅ Success: "Thank you email sent: [messageId]"
- ❌ Error: "Email sending error: [error details]"

## 🎯 Benefits

- **Professional touch** - Users feel valued
- **Brand awareness** - Reinforces LiteStart identity
- **User engagement** - Keeps them informed
- **Launch preparation** - Builds anticipation

## 🔧 Troubleshooting

### Common Issues:
1. **"Invalid credentials"** - Check app password
2. **"Authentication failed"** - Enable 2FA first
3. **"Connection timeout"** - Check internet connection
4. **"Rate limit exceeded"** - Gmail daily limits

### Solutions:
- Verify app password is correct
- Ensure 2FA is enabled
- Check network connectivity
- Monitor Gmail sending limits

---

**The email system will work automatically once configured with valid Gmail credentials!** 🎉 