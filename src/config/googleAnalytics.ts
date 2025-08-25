// Google Analytics Configuration
// Replace these placeholder values with your actual Google Analytics credentials
import { googleAnalyticsService } from '../services/googleAnalytics';

export const GOOGLE_ANALYTICS_CONFIG = {
  // Your Google Analytics Measurement ID (starts with "G-")
  measurementId: 'G-58H4ZEV8NP', // Your actual Google Analytics ID
  
  // Your Google Analytics Property ID (just the number, not "properties/")
  propertyId: '502275674', // Your actual Property ID (remove "properties/" prefix)
  
  // API Key is not needed when using service account authentication
  apiKey: '', // Leave empty when using service account
};

// Initialize Google Analytics service with your config
export const initializeGoogleAnalytics = () => {
  googleAnalyticsService.initialize({
    measurementId: GOOGLE_ANALYTICS_CONFIG.measurementId,
    apiKey: GOOGLE_ANALYTICS_CONFIG.apiKey,
    propertyId: GOOGLE_ANALYTICS_CONFIG.propertyId,
  });
  
  console.log('Google Analytics service initialized with real credentials!');
}; 