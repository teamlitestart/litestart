import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Clock, 
  BarChart3,
  RefreshCw,
  Calendar,
  Activity,
  Globe,
  FileText,
  Smartphone,
  Monitor,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Tablet,
  Info
} from 'lucide-react';
import { googleAnalyticsService, WebsiteViews } from '../services/googleAnalytics';

// Professional Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  definition: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, definition, position = 'bottom' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(position);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowClasses = (pos: string) => {
    switch (pos) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-200';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-200';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-200';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-200';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-200';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help inline-flex items-center gap-1"
      >
        {children}
        <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 transition-colors" />
      </div>
      {showTooltip && (
        <div 
          className={`absolute z-50 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg max-w-[280px] ${getPositionClasses(tooltipPosition)} transition-opacity duration-200`}
          style={{ 
            animation: 'fadeIn 0.2s ease-in-out',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="text-gray-700 text-sm leading-relaxed">{definition}</div>
          <div className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses(tooltipPosition)}`}></div>
        </div>
      )}
    </div>
  );
};

// Helper function to format numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Helper function to format duration
const formatDuration = (minutes: number) => {
  const roundedMinutes = Math.round(minutes * 10) / 10;
  
  if (roundedMinutes < 1) return '< 1 min';
  if (roundedMinutes < 60) return `${roundedMinutes} min`;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = Math.round(roundedMinutes % 60);
  return `${hours}h ${mins}m`;
};

// Helper function to format percentage
const formatPercentage = (num: number) => {
  return (num * 100).toFixed(1) + '%';
};

// Helper function to calculate percentage change with proper fallback
const calculatePercentageChange = (current: number, previous: number): { 
  value: number; 
  isPositive: boolean; 
  hasComparison: boolean;
  displayValue: string;
} => {
  if (previous === 0 || previous === null || previous === undefined) {
    return { 
      value: 0, 
      isPositive: false, 
      hasComparison: false,
      displayValue: 'N/A'
    };
  }
  
  const change = ((current - previous) / previous) * 100;
  return { 
    value: Math.abs(change), 
    isPositive: change >= 0, 
    hasComparison: true,
    displayValue: `${change >= 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%`
  };
};

// Helper function to get change color
const getChangeColor = (change: { hasComparison: boolean; isPositive: boolean }): string => {
  if (!change.hasComparison) return 'text-gray-500';
  return change.isPositive ? 'text-green-600' : 'text-red-600';
};

// Helper function to get change icon
const getChangeIcon = (change: { hasComparison: boolean; isPositive: boolean }) => {
  if (!change.hasComparison) return <Minus className="h-4 w-4 text-gray-400" />;
  return change.isPositive ? 
    <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
    <ArrowDownRight className="h-4 w-4 text-red-600" />;
};

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<WebsiteViews | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching analytics data...');
      console.log('Service initialized status:', googleAnalyticsService.isInitialized());
      
      // Add a small delay to ensure Google Analytics service is fully initialized
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('After delay, service initialized status:', googleAnalyticsService.isInitialized());
      
      const data = await googleAnalyticsService.getWebsiteViews();
      console.log('Frontend received analytics data:', data);
      
      // Validate that we have real data (not mock data)
      if (data.today === 0 && data.thisMonth === 0 && data.thisYear === 0) {
        setError('No analytics data available. Please check your Google Analytics configuration.');
      } else {
        setAnalyticsData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setError('Failed to fetch analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Connecting to Google Analytics...
          </p>
          <p className="text-sm text-gray-500">
            This may take a few moments on first load
          </p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Since we only have 1 month of data, we can't calculate month-over-month or year-over-year changes
  // All comparison metrics will show N/A
  const monthChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, 0), // No previous month data
    sessions: calculatePercentageChange(analyticsData.monthSessions, 0), // No previous month data
    pageViews: calculatePercentageChange(analyticsData.thisMonth, 0), // No previous month data
    duration: calculatePercentageChange(analyticsData.monthDuration, 0), // No previous month data
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, 0) // No previous month data
  };

  const yearChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, 0), // No previous year data
    sessions: calculatePercentageChange(analyticsData.monthSessions, 0), // No previous year data
    pageViews: calculatePercentageChange(analyticsData.thisYear, 0), // No previous year data
    duration: calculatePercentageChange(analyticsData.monthDuration, 0), // No previous year data
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, 0) // No previous year data
  };

  // Generate key insights based on available data only
  const generateKeyInsights = () => {
    const insights = [];
    
    if (analyticsData.thisMonth > 0) {
      insights.push(`Your website has generated ${formatNumber(analyticsData.thisMonth)} page views this month`);
    }
    
    if (analyticsData.monthUsers > 0) {
      insights.push(`You've reached ${formatNumber(analyticsData.monthUsers)} unique users this month`);
    }
    
    if (analyticsData.monthBounceRate > 0) {
      insights.push(`Current bounce rate is ${formatPercentage(analyticsData.monthBounceRate)}`);
    }
    
    return insights.length > 0 ? insights.join('. ') + '.' : 'Analytics data is being collected. Check back soon for insights.';
  };

  // Generate real trend data for the last 30 days (if we had it)
  // For now, we'll show a message that data is being collected
  const generateTrendData = () => {
    // This would ideally come from GA4 API with date ranges
    // For now, show that data is being collected
    return {
      hasData: false,
      message: 'Trend data will be available after collecting 30+ days of analytics'
    };
  };

  const trendData = generateTrendData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Real-time insights from Google Analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={fetchAnalyticsData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 1. Performance Snapshot (Top Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Today Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today</h3>
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tooltip definition="Unique visitors who accessed your website today. Each person is counted only once, regardless of how many times they visit.">
                  <span className="text-sm text-gray-600">Users</span>
                </Tooltip>
                <span className="text-lg font-bold text-gray-900">{analyticsData.todayUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="A session is a group of user interactions with your website that take place within a given time frame. A session ends after 30 minutes of inactivity.">
                  <span className="text-sm text-gray-600">Sessions</span>
                </Tooltip>
                <span className="text-lg font-bold text-gray-900">{analyticsData.todaySessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Total number of pages viewed by all users today. A single user can generate multiple page views during their visit.">
                  <span className="text-sm text-gray-600">Page Views</span>
                </Tooltip>
                <span className="text-lg font-bold text-gray-900">{analyticsData.today}</span>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Average time users spend on your website during a single session. This indicates how engaging your content is.">
                  <span className="text-sm text-gray-600">Avg. Duration</span>
                </Tooltip>
                <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.todayDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Percentage of visitors who leave your website after viewing only one page. Lower bounce rates typically indicate better engagement.">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                </Tooltip>
                <span className="text-lg font-bold text-gray-900">{formatPercentage(analyticsData.todayBounceRate)}</span>
              </div>
            </div>
          </div>

          {/* This Month Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tooltip definition="Total unique visitors to your website this month. This metric helps understand your monthly reach and audience size.">
                  <span className="text-sm text-gray-600">Users</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Total number of user sessions this month. A session represents a period of user activity and ends after 30 minutes of inactivity.">
                  <span className="text-sm text-gray-600">Sessions</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Total pages viewed by all users this month. Higher page views indicate more content consumption and engagement.">
                  <span className="text-sm text-gray-600">Page Views</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.thisMonth}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Average time users spend on your website per session this month. Longer durations suggest better content engagement.">
                  <span className="text-sm text-gray-600">Avg. Duration</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Monthly average of single-page sessions. Lower rates suggest users are exploring multiple pages on your site.">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
            </div>
          </div>

          {/* This Year Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">This Year</h3>
              <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tooltip definition="Total unique visitors to your website this year. This metric shows your annual audience growth and reach.">
                  <span className="text-sm text-gray-600">Users</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Total number of user sessions this year. A session represents a period of user activity and ends after 30 minutes of inactivity.">
                  <span className="text-sm text-gray-600">Sessions</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Total pages viewed by all users this year. This indicates your annual content consumption and user engagement levels.">
                  <span className="text-sm text-gray-600">Page Views</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.thisYear}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Average time users spend on your website per session this year. Longer durations indicate sustained content engagement.">
                  <span className="text-sm text-gray-600">Avg. Duration</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Yearly average of single-page sessions. Lower rates suggest users are consistently exploring multiple pages on your site.">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Trend Visualizations (Second Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Daily Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Visual representation of your website's daily performance over the last 30 days. Shows trends in page views, sessions, and user engagement patterns.">
                <h3 className="text-lg font-semibold text-gray-900">Daily Trends (Last 30 Days)</h3>
              </Tooltip>
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
            <div className="h-64 flex items-center justify-center">
              {trendData.hasData ? (
                <div className="text-center">
                  {/* Chart would go here when we have real trend data */}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{trendData.message}</p>
                  <p className="text-xs mt-1">Check back after collecting more data</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Monthly performance overview showing how your website metrics change throughout the year. Helps identify seasonal patterns and long-term growth trends.">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Trends (Jan-Dec)</h3>
              </Tooltip>
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Monthly trends will be available after collecting 12+ months of data</p>
                <p className="text-xs mt-1">Currently collecting: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Traffic & Audience Breakdown (Third Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Channels through which visitors find your website. Includes organic search, direct traffic, social media, referrals, and other sources. Understanding this helps optimize your marketing strategy.">
                <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              </Tooltip>
              <Globe className="h-5 w-5 text-gray-600" />
            </div>
            {analyticsData.trafficSources && analyticsData.trafficSources.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.trafficSources.slice(0, 5).map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <Tooltip definition="The number of user sessions attributed to this traffic source. A session represents a period of user activity and helps measure source effectiveness.">
                        <div className="text-sm font-bold text-gray-900">{formatNumber(source.sessions)}</div>
                      </Tooltip>
                      <Tooltip definition="A session is a group of user interactions with your website that take place within a given time frame. A session ends after 30 minutes of inactivity.">
                        <div className="text-xs text-gray-500">sessions</div>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No traffic source data available</p>
                <p className="text-xs text-gray-400 mt-1">Data will appear as traffic sources are identified</p>
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Distribution of website visitors by device type (desktop, mobile, tablet). This helps optimize your website design and user experience for different screen sizes.">
                <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
              </Tooltip>
              <div className="flex gap-1">
                <Monitor className="h-4 w-4 text-gray-600" />
                <Smartphone className="h-4 w-4 text-gray-600" />
                <Tablet className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            {analyticsData.deviceBreakdown && analyticsData.deviceBreakdown.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      {device.device.toLowerCase() === 'desktop' && <Monitor className="h-4 w-4 text-gray-600 mr-2" />}
                      {device.device.toLowerCase() === 'mobile' && <Smartphone className="h-4 w-4 text-gray-600 mr-2" />}
                      {device.device.toLowerCase() === 'tablet' && <Tablet className="h-4 w-4 text-gray-600 mr-2" />}
                      {!['desktop', 'mobile', 'tablet'].includes(device.device.toLowerCase()) && <Monitor className="h-4 w-4 text-gray-600 mr-2" />}
                      <span className="text-sm text-gray-600">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{device.percentage}%</div>
                      <div className="text-xs text-gray-500">of traffic</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Device breakdown data not available</p>
                <p className="text-xs text-gray-400 mt-1">This metric requires additional GA4 configuration</p>
              </div>
            )}
          </div>

          {/* Geography */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Geographic distribution of your website visitors. Shows which countries generate the most traffic, helping you understand your global reach and optimize content for different regions.">
                <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
              </Tooltip>
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            {analyticsData.geographicData && analyticsData.geographicData.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.geographicData.slice(0, 5).map((geo, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{geo.country}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{geo.percentage}%</div>
                      <div className="text-xs text-gray-500">of traffic</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Geographic data not available</p>
                <p className="text-xs text-gray-400 mt-1">This metric requires additional GA4 configuration</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Engagement & Pages (Fourth Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Most visited pages on your website ranked by page views. This helps identify your most popular content and understand what resonates with your audience.">
                <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
              </Tooltip>
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            {analyticsData.topPages && analyticsData.topPages.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        index === 1 ? 'bg-gray-100 text-gray-800' : 
                        index === 2 ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-32">{page.page}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatNumber(page.views)}</div>
                      <Tooltip definition="The number of times this specific page was viewed by users. Page views indicate content popularity and user engagement with specific pages.">
                        <div className="text-xs text-gray-500">views</div>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No page data available</p>
                <p className="text-xs text-gray-400 mt-1">Page data will appear as users visit your pages</p>
              </div>
            )}
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <Tooltip definition="Key metrics that measure how users interact with your website content. These indicators help assess user engagement, content quality, and overall website effectiveness.">
                <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
              </Tooltip>
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> All metrics below represent data from the last 30 days
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tooltip definition="Average number of pages viewed during a single user session. Higher numbers indicate users are exploring more of your content, suggesting good site navigation and engaging content.">
                  <span className="text-sm text-gray-600">Pages per Session</span>
                </Tooltip>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {analyticsData.thisMonth > 0 && analyticsData.monthSessions > 0 
                      ? (analyticsData.thisMonth / analyticsData.monthSessions).toFixed(1) 
                      : '0.0'}
                  </span>
                  <Tooltip definition="The mean value calculated by dividing total page views by total sessions. This average helps understand typical user engagement per visit.">
                    <div className="text-xs text-gray-500">average</div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Percentage of sessions that end on a specific page. This helps identify which pages cause users to leave your website, indicating areas for improvement.">
                  <span className="text-sm text-gray-600">Exit Rate</span>
                </Tooltip>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {((1 - analyticsData.monthBounceRate) * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500">of sessions</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Tooltip definition="Percentage of users visiting your website for the first time. Higher percentages indicate successful acquisition of new audiences.">
                  <span className="text-sm text-gray-600">New Users</span>
                </Tooltip>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {analyticsData.monthUsers > 0 
                      ? Math.round((analyticsData.monthUsers / analyticsData.monthUsers) * 100) 
                      : 0}%
                  </span>
                  <div className="text-xs text-gray-500">of total users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Performance Summary (Bottom Row) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Tooltip definition="Comprehensive overview of your website's performance trends. Compares current metrics against previous periods to show growth patterns and identify areas for improvement.">
              <h3 className="text-xl font-semibold text-gray-900">Performance Summary</h3>
            </Tooltip>
            <div className="flex gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <TrendingDown className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Monthly Growth Summary */}
            <div>
              <Tooltip definition="Comparison of current month's performance against the previous month. Shows percentage changes in key metrics to track month-over-month growth trends.">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Growth (vs Last Month)</h4>
              </Tooltip>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Users</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.users)}
                    <span className={`font-medium ${getChangeColor(monthChanges.users)}`}>
                      {monthChanges.users.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.sessions)}
                    <span className={`font-medium ${getChangeColor(monthChanges.sessions)}`}>
                      {monthChanges.sessions.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.pageViews)}
                    <span className={`font-medium ${getChangeColor(monthChanges.pageViews)}`}>
                      {monthChanges.pageViews.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.bounceRate)}
                    <span className={`font-medium ${getChangeColor(monthChanges.bounceRate)}`}>
                      {monthChanges.bounceRate.displayValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Growth Summary */}
            <div>
              <Tooltip definition="Comparison of current year's performance against the same period last year. Shows percentage changes to track long-term growth and identify annual trends.">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Yearly Growth (vs Last Year)</h4>
              </Tooltip>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Users</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.users)}
                    <span className={`font-medium ${getChangeColor(yearChanges.users)}`}>
                      {yearChanges.users.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.sessions)}
                    <span className={`font-medium ${getChangeColor(yearChanges.sessions)}`}>
                      {yearChanges.sessions.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.pageViews)}
                    <span className={`font-medium ${getChangeColor(yearChanges.pageViews)}`}>
                      {yearChanges.pageViews.displayValue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.bounceRate)}
                    <span className={`font-medium ${getChangeColor(yearChanges.bounceRate)}`}>
                      {yearChanges.bounceRate.displayValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <Tooltip definition="Automatically generated insights based on your analytics data. These highlight key trends, improvements, and areas that need attention in your website performance.">
                  <h5 className="font-medium text-blue-900 mb-1">Key Insights</h5>
                </Tooltip>
                <p className="text-sm text-blue-800">
                  {generateKeyInsights()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 