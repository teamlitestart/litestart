// Google Analytics Service
// This service will help fetch real analytics data from Google Analytics

// Declare gtag as a global function
declare global {
  function gtag(...args: any[]): void;
}

export interface WebsiteViews {
  today: number;
  thisMonth: number;
  thisYear: number;
  total: number;
  todaySessions: number;
  monthSessions: number;
  todayUsers: number;
  monthUsers: number;
  todayDuration: number;
  monthDuration: number;
  todayBounceRate: number;
  monthBounceRate: number;
  trafficSources: Array<{
    source: string;
    sessions: number;
    originalSource: string;
    medium: string;
    channel: string;
    iconType: string;
  }>;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  deviceBreakdown?: Array<{
    device: string;
    sessions: number;
    percentage: number;
  }>;
  geographicData?: Array<{
    country: string;
    sessions: number;
    percentage: number;
  }>;
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
    console.log('GoogleAnalyticsService.initialize called with config:', config);
    this.config = config;
    console.log('Config set successfully, new config value:', this.config);
  }

  // Check if the service is initialized
  isInitialized(): boolean {
    const initialized = !!this.config;
    console.log('isInitialized check:', initialized, 'config:', this.config);
    return initialized;
  }

  // Get website views data from Google Analytics
  async getWebsiteViews(): Promise<WebsiteViews> {
    console.log('getWebsiteViews called, config status:', !!this.config);
    console.log('Config details:', this.config);
    
    if (!this.config) {
      console.error('Google Analytics service not initialized!');
      console.error('Current config:', this.config);
      throw new Error('Google Analytics not initialized. Please call initialize() first.');
    }

    try {
      console.log('Fetching Google Analytics data...');
      console.log('Using Property ID:', this.config.propertyId);
      
      // Call our Render backend which has the service account credentials
      const proxyUrl = `https://litestart-backend.onrender.com/api/analytics/ga4?propertyId=${this.config.propertyId}`;
      console.log('Using Render backend URL:', proxyUrl);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('Making GA4 API call with service account...');
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Proxy API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Real GA4 data received via proxy:', data);
        
        if (data.today !== undefined) {
          const realData: WebsiteViews = {
            today: data.today || 0,
            thisMonth: data.thisMonth || 0,
            thisYear: data.thisYear || 0,
            total: data.total || 0,
            
            // New metrics
            todaySessions: data.todaySessions || 0,
            monthSessions: data.monthSessions || 0,
            todayUsers: data.todayUsers || 0,
            monthUsers: data.monthUsers || 0,
            todayDuration: data.todayDuration || 0,
            monthDuration: data.monthDuration || 0,
            todayBounceRate: data.todayBounceRate || 0,
            monthBounceRate: data.monthBounceRate || 0,
            trafficSources: data.trafficSources || [],
            topPages: data.topPages || [],
            deviceBreakdown: data.deviceBreakdown || [],
            geographicData: data.geographicData || []
          };
          
          console.log('REAL GA4 data processed:', realData);
          return realData;
        } else {
          console.log('No valid data in proxy response:', data);
          throw new Error('No valid analytics data received from Google Analytics');
        }
      } else {
        console.log('Proxy API response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('Proxy Error response body:', errorText);
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`);
      }
      
    } catch (error: any) {
      console.error('Failed to fetch Google Analytics data:', error);
      
      if (error.name === 'AbortError') {
        console.error('API call timed out after 15 seconds');
        throw new Error('Analytics data fetch timed out. Please try again.');
      }
      
      // Re-throw the error instead of returning mock data
      throw error;
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
    if (!this.config) {
      return 0;
    }
    
    try {
      // For now, return 0 since we don't have real-time data configured
      console.log('Real-time visitors not configured yet');
      return 0;
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