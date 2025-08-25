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
  Tablet
} from 'lucide-react';
import { googleAnalyticsService, WebsiteViews } from '../services/googleAnalytics';

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

// Mock data for demonstration - in real implementation, fetch from GA API
const generateMockTrendData = () => {
  const days = [];
  const pageViews = [];
  const sessions = [];
  const users = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    // Generate realistic daily data with some variation
    const baseViews = 20 + Math.random() * 15;
    const baseSessions = baseViews * 0.7 + Math.random() * 5;
    const baseUsers = baseSessions * 0.8 + Math.random() * 3;
    
    pageViews.push(Math.round(baseViews));
    sessions.push(Math.round(baseSessions));
    users.push(Math.round(baseUsers));
  }
  
  return { days, pageViews, sessions, users };
};

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<WebsiteViews | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [trendData] = useState(generateMockTrendData());

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      console.log('fetchAnalyticsData called');
      console.log('Service initialized status:', googleAnalyticsService.isInitialized());
      
      // Add a small delay to ensure Google Analytics service is fully initialized
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('After delay, service initialized status:', googleAnalyticsService.isInitialized());
      
      const data = await googleAnalyticsService.getWebsiteViews();
      console.log('Frontend received analytics data:', data);
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      
      // If it fails, try again after a longer delay
      setTimeout(() => {
        console.log('Retrying analytics data fetch...');
        fetchAnalyticsData();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    const roundedMinutes = Math.round(minutes * 10) / 10;
    
    if (roundedMinutes < 1) return '< 1 min';
    if (roundedMinutes < 60) return `${roundedMinutes} min`;
    const hours = Math.floor(roundedMinutes / 60);
    const mins = Math.round(roundedMinutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };

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

  // In real implementation, fetch these from GA API with date ranges
  // For now, using realistic mock data for demonstration
  const lastMonthData = {
    users: Math.round(analyticsData.monthUsers * 0.85),
    sessions: Math.round(analyticsData.monthSessions * 0.82),
    pageViews: Math.round(analyticsData.thisMonth * 0.88),
    duration: analyticsData.monthDuration * 0.92,
    bounceRate: analyticsData.monthBounceRate * 1.08
  };

  const lastYearData = {
    users: Math.round(analyticsData.monthUsers * 0.65),
    sessions: Math.round(analyticsData.monthSessions * 0.62),
    pageViews: Math.round(analyticsData.thisMonth * 0.68),
    duration: analyticsData.monthDuration * 0.85,
    bounceRate: analyticsData.monthBounceRate * 1.15
  };

  // Calculate changes with proper fallbacks
  const monthChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, lastMonthData.users),
    sessions: calculatePercentageChange(analyticsData.monthSessions, lastMonthData.sessions),
    pageViews: calculatePercentageChange(analyticsData.thisMonth, lastMonthData.pageViews),
    duration: calculatePercentageChange(analyticsData.monthDuration, lastMonthData.duration),
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, lastMonthData.bounceRate)
  };

  const yearChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, lastYearData.users),
    sessions: calculatePercentageChange(analyticsData.monthSessions, lastYearData.sessions),
    pageViews: calculatePercentageChange(analyticsData.thisMonth, lastYearData.pageViews),
    duration: calculatePercentageChange(analyticsData.monthDuration, lastYearData.duration),
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, lastYearData.bounceRate)
  };

  // Generate key insights dynamically
  const generateKeyInsights = () => {
    const insights = [];
    
    if (monthChanges.pageViews.hasComparison) {
      insights.push(
        `Traffic ${monthChanges.pageViews.isPositive ? 'increased' : 'decreased'} by ${Math.abs(monthChanges.pageViews.value).toFixed(1)}% month-over-month`
      );
    }
    
    if (monthChanges.bounceRate.hasComparison) {
      insights.push(
        `Bounce rate ${monthChanges.bounceRate.isPositive ? 'increased' : 'improved'} by ${Math.abs(monthChanges.bounceRate.value).toFixed(1)}%`
      );
    }
    
    if (monthChanges.duration.hasComparison) {
      insights.push(
        `Session duration ${monthChanges.duration.isPositive ? 'grew' : 'declined'} by ${Math.abs(monthChanges.duration.value).toFixed(1)}%`
      );
    }
    
    return insights.length > 0 ? insights.join('. ') + '.' : 'No comparison data available for this period.';
  };

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
                <span className="text-sm text-gray-600">Users</span>
                <span className="text-lg font-bold text-gray-900">{analyticsData.todayUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <span className="text-lg font-bold text-gray-900">{analyticsData.todaySessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <span className="text-lg font-bold text-gray-900">{analyticsData.today}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Duration</span>
                <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.todayDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
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
                <span className="text-sm text-gray-600">Users</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.users)}`}>
                    {monthChanges.users.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.sessions)}`}>
                    {monthChanges.sessions.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.thisMonth}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.pageViews)}`}>
                    {monthChanges.pageViews.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Duration</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.duration)}`}>
                    {monthChanges.duration.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.bounceRate)}`}>
                    {monthChanges.bounceRate.displayValue}
                  </span>
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
                <span className="text-sm text-gray-600">Users</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.users)}`}>
                    {yearChanges.users.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.sessions)}`}>
                    {yearChanges.sessions.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{analyticsData.thisYear}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.pageViews)}`}>
                    {yearChanges.pageViews.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Duration</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.duration)}`}>
                    {yearChanges.duration.displayValue}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.bounceRate)}`}>
                    {yearChanges.bounceRate.displayValue}
                  </span>
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
              <h3 className="text-lg font-semibold text-gray-900">Daily Trends (Last 30 Days)</h3>
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
            <div className="h-64">
              {/* Simple line chart using CSS - replace with Chart.js or Google Charts */}
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
                  {trendData.pageViews.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-1 bg-blue-500 rounded-full transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(value / Math.max(...trendData.pageViews)) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                        {trendData.days[index]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends (Jan-Dec)</h3>
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="h-64">
              {/* Simple bar chart using CSS - replace with Chart.js or Google Charts */}
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                    const value = Math.random() * 100 + 50; // Mock data
                    return (
                      <div key={month} className="flex flex-col items-center">
                        <div 
                          className="w-4 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                          style={{ height: `${(value / 150) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Traffic & Audience Breakdown (Third Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
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
                      <div className="text-sm font-bold text-gray-900">{formatNumber(source.sessions)}</div>
                      <div className="text-xs text-gray-500">sessions</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No traffic source data available</p>
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
              <div className="flex gap-1">
                <Monitor className="h-4 w-4 text-gray-600" />
                <Smartphone className="h-4 w-4 text-gray-600" />
                <Tablet className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Monitor className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Desktop</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">65%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Mobile</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">30%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tablet className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Tablet</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">5%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
            </div>
          </div>

          {/* Geography */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">United States</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">45%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">United Kingdom</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">25%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Canada</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">15%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Australia</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">10%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Other</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">5%</div>
                  <div className="text-xs text-gray-500">of traffic</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Engagement & Pages (Fourth Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
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
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No page data available</p>
              </div>
            )}
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pages per Session</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {analyticsData.thisMonth > 0 && analyticsData.monthSessions > 0 
                      ? (analyticsData.thisMonth / analyticsData.monthSessions).toFixed(1) 
                      : '0.0'}
                  </span>
                  <div className="text-xs text-gray-500">average</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exit Rate</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {((1 - analyticsData.monthBounceRate) * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500">of sessions</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users</span>
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
            <h3 className="text-xl font-semibold text-gray-900">Performance Summary</h3>
            <div className="flex gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <TrendingDown className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Monthly Growth Summary */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Growth (vs Last Month)</h4>
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
              <h4 className="text-lg font-medium text-gray-900 mb-4">Yearly Growth (vs Last Year)</h4>
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
                <h5 className="font-medium text-blue-900 mb-1">Key Insights</h5>
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