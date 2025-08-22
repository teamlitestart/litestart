// Google Analytics Configuration
// Replace these placeholder values with your actual Google Analytics credentials

export const GOOGLE_ANALYTICS_CONFIG = {
  // Your Google Analytics Measurement ID (starts with "G-")
  // Get this from: https://analytics.google.com/ → Admin → Data Streams → Web Stream
  measurementId: 'G-58H4ZEV8NP', // Your actual Google Analytics ID
  
  // Your Google Analytics Property ID (starts with "properties/")
  // Get this from: https://analytics.google.com/ → Admin → Property Settings
  propertyId: 'properties/XXXXXXXXXX', // Replace with your actual property ID
  
  // Your Google Analytics API Key
  // Get this from: https://console.developers.google.com/ → APIs & Services → Credentials
  apiKey: 'YOUR_API_KEY', // Replace with your actual API key
};

// Initialize Google Analytics service with your config
export const initializeGoogleAnalytics = () => {
  import { googleAnalyticsService } from '../services/googleAnalytics';
  
  googleAnalyticsService.initialize({
    measurementId: GOOGLE_ANALYTICS_CONFIG.measurementId,
    apiKey: GOOGLE_ANALYTICS_CONFIG.apiKey,
    propertyId: GOOGLE_ANALYTICS_CONFIG.propertyId,
  });
}; 