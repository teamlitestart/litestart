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
  Minus
} from 'lucide-react';
import { googleAnalyticsService, WebsiteViews } from '../services/googleAnalytics';

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
  if (previous === 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(change), isPositive: change >= 0 };
};

// Helper function to format percentage change
const formatPercentageChange = (change: { value: number; isPositive: boolean }): string => {
  if (change.value === 0) return '0%';
  const arrow = change.isPositive ? '↑' : '↓';
  return `${arrow} ${change.value.toFixed(1)}%`;
};

// Helper function to get change color
const getChangeColor = (change: { value: number; isPositive: boolean }): string => {
  if (change.value === 0) return 'text-gray-500';
  return change.isPositive ? 'text-green-600' : 'text-red-600';
};

// Helper function to get change icon
const getChangeIcon = (change: { value: number; isPositive: boolean }) => {
  if (change.value === 0) return <Minus className="h-4 w-4" />;
  return change.isPositive ? 
    <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
    <ArrowDownRight className="h-4 w-4 text-red-600" />;
};

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<WebsiteViews | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
    // Round to 1 decimal place for cleaner display
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

  // Mock data for previous periods (in real implementation, you'd fetch this from GA)
  const previousMonthData = {
    users: Math.round(analyticsData.monthUsers * 0.9), // 10% less for demo
    sessions: Math.round(analyticsData.monthSessions * 0.85),
    pageViews: Math.round(analyticsData.thisMonth * 0.88),
    duration: analyticsData.monthDuration * 0.95,
    bounceRate: analyticsData.monthBounceRate * 1.1
  };

  const previousYearData = {
    users: Math.round(analyticsData.monthUsers * 0.7), // 30% less for demo
    sessions: Math.round(analyticsData.monthSessions * 0.65),
    pageViews: Math.round(analyticsData.thisMonth * 0.68),
    duration: analyticsData.monthDuration * 0.9,
    bounceRate: analyticsData.monthBounceRate * 1.2
  };

  // Calculate changes
  const monthChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, previousMonthData.users),
    sessions: calculatePercentageChange(analyticsData.monthSessions, previousMonthData.sessions),
    pageViews: calculatePercentageChange(analyticsData.thisMonth, previousMonthData.pageViews),
    duration: calculatePercentageChange(analyticsData.monthDuration, previousMonthData.duration),
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, previousMonthData.bounceRate)
  };

  const yearChanges = {
    users: calculatePercentageChange(analyticsData.monthUsers, previousYearData.users),
    sessions: calculatePercentageChange(analyticsData.monthSessions, previousYearData.sessions),
    pageViews: calculatePercentageChange(analyticsData.thisMonth, previousYearData.pageViews),
    duration: calculatePercentageChange(analyticsData.monthDuration, previousYearData.duration),
    bounceRate: calculatePercentageChange(analyticsData.monthBounceRate, previousYearData.bounceRate)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. Performance Snapshot (Top Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Today Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today</h3>
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Users</span>
                <span className="font-semibold text-gray-900">{analyticsData.todayUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <span className="font-semibold text-gray-900">{analyticsData.todaySessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <span className="font-semibold text-gray-900">{analyticsData.today}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Session Duration</span>
                <span className="font-semibold text-gray-900">{formatDuration(analyticsData.todayDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="font-semibold text-gray-900">{formatPercentage(analyticsData.todayBounceRate)}</span>
              </div>
            </div>
          </div>

          {/* This Month Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.users)}`}>
                    {formatPercentageChange(monthChanges.users)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.sessions)}`}>
                    {formatPercentageChange(monthChanges.sessions)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.thisMonth}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.pageViews)}`}>
                    {formatPercentageChange(monthChanges.pageViews)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Session Duration</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.duration)}`}>
                    {formatPercentageChange(monthChanges.duration)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className={`text-xs ${getChangeColor(monthChanges.bounceRate)}`}>
                    {formatPercentageChange(monthChanges.bounceRate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* This Year Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">This Year</h3>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.monthUsers}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.users)}`}>
                    {formatPercentageChange(yearChanges.users)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.monthSessions}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.sessions)}`}>
                    {formatPercentageChange(yearChanges.sessions)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Views</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{analyticsData.thisYear}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.pageViews)}`}>
                    {formatPercentageChange(yearChanges.pageViews)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Session Duration</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatDuration(analyticsData.monthDuration)}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.duration)}`}>
                    {formatPercentageChange(yearChanges.duration)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatPercentage(analyticsData.monthBounceRate)}</span>
                  <span className={`text-xs ${getChangeColor(yearChanges.bounceRate)}`}>
                    {formatPercentageChange(yearChanges.bounceRate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Trend Visualizations (Second Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Daily Trends Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Trends (Last 30 Days)</h3>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Chart visualization coming soon</p>
                <p className="text-sm">Daily Page Views, Users, Sessions</p>
              </div>
            </div>
          </div>

          {/* Monthly Trends Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends (Jan-Dec)</h3>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Chart visualization coming soon</p>
                <p className="text-sm">Monthly Views & Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Traffic & Audience Breakdown (Third Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            {analyticsData.trafficSources && analyticsData.trafficSources.length > 0 ? (
              <div className="space-y-3">
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
                      <div className="text-sm font-medium text-gray-900">{formatNumber(source.sessions)}</div>
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

          {/* Device Breakdown Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
              <div className="flex gap-1">
                <Monitor className="h-4 w-4 text-blue-600" />
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="flex gap-2 mb-2">
                  <Monitor className="h-8 w-8 text-blue-400" />
                  <Smartphone className="h-8 w-8 text-green-400" />
                </div>
                <p>Device data coming soon</p>
                <p className="text-sm">Desktop vs Mobile vs Tablet</p>
              </div>
            </div>
          </div>

          {/* Geography Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Geography</h3>
              <MapPin className="h-5 w-5 text-red-600" />
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p>Geography data coming soon</p>
                <p className="text-sm">Top 5 Countries/Cities</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Engagement & Pages (Fourth Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            {analyticsData.topPages && analyticsData.topPages.length > 0 ? (
              <div className="space-y-3">
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
                      <div className="text-sm font-medium text-gray-900">{formatNumber(page.views)}</div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pages per Session</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {analyticsData.thisMonth > 0 && analyticsData.monthSessions > 0 
                      ? (analyticsData.thisMonth / analyticsData.monthSessions).toFixed(1) 
                      : '0.0'}
                  </span>
                  <div className="text-xs text-gray-500">avg</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exit Rate</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {((1 - analyticsData.monthBounceRate) * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500">of sessions</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New vs Returning</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {analyticsData.monthUsers > 0 
                      ? Math.round((analyticsData.monthUsers / analyticsData.monthUsers) * 100) 
                      : 0}%
                  </span>
                  <div className="text-xs text-gray-500">new users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Summative Performance Card (Bottom Row) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Performance Summary</h3>
            <div className="flex gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <TrendingDown className="h-5 w-5 text-red-600" />
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
                      {formatPercentageChange(monthChanges.users)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.sessions)}
                    <span className={`font-medium ${getChangeColor(monthChanges.sessions)}`}>
                      {formatPercentageChange(monthChanges.sessions)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.pageViews)}
                    <span className={`font-medium ${getChangeColor(monthChanges.pageViews)}`}>
                      {formatPercentageChange(monthChanges.pageViews)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(monthChanges.bounceRate)}
                    <span className={`font-medium ${getChangeColor(monthChanges.bounceRate)}`}>
                      {formatPercentageChange(monthChanges.bounceRate)}
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
                      {formatPercentageChange(yearChanges.users)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.sessions)}
                    <span className={`font-medium ${getChangeColor(yearChanges.sessions)}`}>
                      {formatPercentageChange(yearChanges.sessions)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.pageViews)}
                    <span className={`font-medium ${getChangeColor(yearChanges.pageViews)}`}>
                      {formatPercentageChange(yearChanges.pageViews)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(yearChanges.bounceRate)}
                    <span className={`font-medium ${getChangeColor(yearChanges.bounceRate)}`}>
                      {formatPercentageChange(yearChanges.bounceRate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaway Statement */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Key Insights</h5>
                <p className="text-sm text-blue-800">
                  {monthChanges.pageViews.isPositive ? 'Traffic growth is strong' : 'Traffic needs attention'} 
                  with {formatPercentageChange(monthChanges.pageViews)} month-over-month. 
                  Bounce rate is {monthChanges.bounceRate.isPositive ? 'increasing' : 'improving'} 
                  by {formatPercentageChange(monthChanges.bounceRate)}. 
                  {monthChanges.duration.isPositive ? 'Session duration is growing' : 'Session duration is declining'} 
                  by {formatPercentageChange(monthChanges.duration)}.
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