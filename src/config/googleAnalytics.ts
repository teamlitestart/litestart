// Google Analytics Configuration
// Replace these placeholder values with your actual Google Analytics credentials
import { googleAnalyticsService } from '../services/googleAnalytics';

export const GOOGLE_ANALYTICS_CONFIG = {
  // Your Google Analytics Measurement ID (starts with "G-")
  measurementId: 'G-58H4ZEV8NP', // Your actual Google Analytics ID
  
  // Your Google Analytics Property ID (starts with "properties/")
  propertyId: 'properties/502275674', // Your actual Property ID
  
  // Your Google Analytics API Key
  apiKey: 'AIzaSyDzEikj7zGIBYUQknOWDkt59-2A0xulbmY', // Your actual API Key
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