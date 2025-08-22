// Google Analytics Service
// This service will help fetch real analytics data from Google Analytics

export interface WebsiteViews {
  today: number;
  thisMonth: number;
  thisYear: number;
  total: number;
}

export interface GoogleAnalyticsConfig {
  measurementId: string;
  apiKey: string;
  propertyId: string;
}

class GoogleAnalyticsService {
  private config: GoogleAnalyticsConfig | null = null;

  // Initialize the service with your GA credentials
  initialize(config: GoogleAnalyticsConfig) {
    this.config = config;
  }

  // Get website views data from Google Analytics
  async getWebsiteViews(): Promise<WebsiteViews> {
    if (!this.config) {
      throw new Error('Google Analytics not initialized. Please call initialize() first.');
    }

    try {
      // Call the REAL Google Analytics API to get your actual data
      console.log('Fetching REAL Google Analytics data...');
      
      // Use Google Analytics Data API v1 with your credentials
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.config.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            { startDate: 'today', endDate: 'today' },
            { startDate: '30daysAgo', endDate: 'today' },
            { startDate: '365daysAgo', endDate: 'today' },
            { startDate: '2020-01-01', endDate: 'today' }
          ],
          metrics: [{ name: 'screenPageViews' }]
        })
      });

      if (!response.ok) {
        throw new Error(`Google Analytics API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw GA API response:', data);
      
      // Parse the real data from Google Analytics
      const realData: WebsiteViews = {
        today: parseInt(data.rows?.[0]?.metricValues?.[0]?.value || '0'),
        thisMonth: parseInt(data.rows?.[1]?.metricValues?.[0]?.value || '0'),
        thisYear: parseInt(data.rows?.[2]?.metricValues?.[0]?.value || '0'),
        total: parseInt(data.rows?.[3]?.metricValues?.[0]?.value || '0')
      };

      console.log('REAL Google Analytics data fetched:', realData);
      
      return realData;
      
    } catch (error) {
      console.error('Failed to fetch Google Analytics data:', error);
      
      // Return zeros if there's an error
      return {
        today: 0,
        thisMonth: 0,
        thisYear: 0,
        total: 0
      };
    }
  }

  // Track a page view (this will work immediately)
  trackPageView(pagePath: string, pageTitle?: string) {
    if (typeof gtag !== 'undefined') {
      gtag('config', this.config?.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }

  // Track custom events
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  }

  // Get real-time visitor count
  async getRealTimeVisitors(): Promise<number> {
    try {
      // Call Google Analytics Real-Time API
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.config.propertyId}:runRealtimeReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }]
        })
      });

      if (!response.ok) {
        throw new Error(`Real-time API error: ${response.status}`);
      }

      const data = await response.json();
      const realTimeVisitors = parseInt(data.rows?.[0]?.metricValues?.[0]?.value || '0');
      console.log('REAL real-time visitors:', realTimeVisitors);
      return realTimeVisitors;
    } catch (error) {
      console.error('Failed to fetch real-time visitors:', error);
      return 0;
    }
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService();

// Helper function to track page views automatically
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  googleAnalyticsService.trackPageView(pagePath, pageTitle);
};

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  googleAnalyticsService.trackEvent(eventName, parameters);
}; 