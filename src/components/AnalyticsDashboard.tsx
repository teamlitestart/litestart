import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  BarChart3,
  ExternalLink,
  Calendar,
  Activity,
  Globe,
  FileText
} from 'lucide-react';
import { googleAnalyticsService, WebsiteViews } from '../services/googleAnalytics';

// Tooltip component for analytics terms
const Tooltip: React.FC<{ children: React.ReactNode; definition: string; position?: 'top' | 'bottom' }> = ({ children, definition, position = 'bottom' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className={`absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 transform -translate-x-1/2`}>
          <div className="text-gray-100 text-sm leading-6">{definition}</div>
          <div className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent ${position === 'top' ? 'border-t-gray-900' : 'border-b-gray-900'}`}></div>
        </div>
      )}
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<WebsiteViews | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await googleAnalyticsService.getWebsiteViews();
      console.log('Frontend received analytics data:', data);
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // No automatic refresh - only refresh when page is visited
    // Users can manually refresh using the "Refresh Data" button
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
          <p className="text-gray-600">
            No analytics data available. Please check your Google Analytics configuration.
          </p>
        </div>
      </div>
    );
  }

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
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Page Views */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    <Tooltip definition="Total number of page views on your website">
                      Page Views Today
                    </Tooltip>
                  </dt>
                  <dd>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.today)}</p>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">{formatNumber(analyticsData.thisMonth)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Year</span>
                <span className="font-medium">{formatNumber(analyticsData.thisYear)}</span>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    <Tooltip definition="A session is a group of user interactions with your website that take place within a given time frame">
                      Sessions Today
                    </Tooltip>
                  </dt>
                  <dd>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.todaySessions)}</p>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">{formatNumber(analyticsData.monthSessions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Year</span>
                <span className="font-medium">{formatNumber(analyticsData.monthSessions)}</span>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    <Tooltip definition="Unique users who visited your website">
                      Users Today
                    </Tooltip>
                  </dt>
                  <dd>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.todayUsers)}</p>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">{formatNumber(analyticsData.monthUsers)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Year</span>
                <span className="font-medium">{formatNumber(analyticsData.monthUsers)}</span>
              </div>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    <Tooltip definition="Percentage of visitors who leave your website after viewing only one page">
                      Bounce Rate Today
                    </Tooltip>
                  </dt>
                  <dd>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.todayBounceRate)}</p>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">{formatPercentage(analyticsData.monthBounceRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Year</span>
                <span className="font-medium">{formatPercentage(analyticsData.monthBounceRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Session Duration */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Session Duration</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Today</span>
                <div className="font-semibold text-gray-900">{formatDuration(analyticsData.todayDuration)}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">This Month</span>
                <div className="font-semibold text-gray-900">{formatDuration(analyticsData.monthDuration)}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">This Year</span>
                <div className="font-semibold text-gray-900">{formatDuration(analyticsData.monthDuration)}</div>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.total)}</p>
              <p className="text-sm text-gray-500 mt-1">All Time</p>
            </div>
          </div>

          {/* Year Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Year Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Views</span>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.thisYear)}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Users</span>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.monthUsers)}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Avg. Bounce Rate</span>
                <p className="text-2xl font-bold">{formatPercentage(analyticsData.monthBounceRate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
              </div>
            </div>
            <div className="p-6">
              {analyticsData.trafficSources && analyticsData.trafficSources.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
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
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No traffic source data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Top Pages</h3>
              </div>
            </div>
            <div className="p-6">
              {analyticsData.topPages && analyticsData.topPages.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{page.page}</span>
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
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No page data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 