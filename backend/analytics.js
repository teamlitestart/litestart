const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Google Analytics service account credentials
// These will be loaded from environment variables in production
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 
  JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) : null;

// Initialize Google Analytics Data API client
const analyticsDataClient = new google.analyticsdata({
  version: 'v1beta',
  auth: new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  })
});

// Analytics endpoint
app.get('/api/analytics/ga4', async (req, res) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!SERVICE_ACCOUNT_KEY) {
      return res.status(500).json({ error: 'Google Analytics credentials not configured' });
    }

    console.log('Fetching GA4 data for property:', propertyId);

    // Get today's comprehensive data
    const todayResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: 'today',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get this month's comprehensive data
    const monthResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get this year's comprehensive data
    const yearResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '365daysAgo',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    // Get total data (all time)
    const totalResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '2020-01-01',
          endDate: 'today'
        }],
        metrics: [
          { name: 'screenPageViews' }
        ]
      }
    });

    // Get traffic sources data (last 30 days)
    const trafficSourcesResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }],
        limit: 10
      }
    });

    // Get top pages data (last 30 days)
    const topPagesResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 10
      }
    });

    // Get device breakdown data (last 30 days)
    const deviceBreakdownResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }],
        limit: 10
      }
    });

    // Get geographic data (last 30 days)
    const geographicResponse = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today'
        }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'sessions' }],
        limit: 10
      }
    });

    // Process today's data
    const todayData = todayResponse.data.rows?.[0] || {};
    const today = parseInt(todayData.metricValues?.[0]?.value || '0');
    const todaySessions = parseInt(todayData.metricValues?.[1]?.value || '0');
    const todayUsers = parseInt(todayData.metricValues?.[2]?.value || '0');
    const todayDuration = parseFloat(todayData.metricValues?.[3]?.value || '0') / 60; // Convert to minutes
    const todayBounceRate = parseFloat(todayData.metricValues?.[4]?.value || '0');

    // Process month's data
    const monthData = monthResponse.data.rows?.[0] || {};
    const thisMonth = parseInt(monthData.metricValues?.[0]?.value || '0');
    const monthSessions = parseInt(monthData.metricValues?.[1]?.value || '0');
    const monthUsers = parseInt(monthData.metricValues?.[2]?.value || '0');
    const monthDuration = parseFloat(monthData.metricValues?.[3]?.value || '0') / 60; // Convert to minutes
    const monthBounceRate = parseFloat(monthData.metricValues?.[4]?.value || '0');

    // Process year's data
    const yearData = yearResponse.data.rows?.[0] || {};
    const thisYear = parseInt(yearData.metricValues?.[0]?.value || '0');

    // Process total data
    const totalData = totalResponse.data.rows?.[0] || {};
    const total = parseInt(totalData.metricValues?.[0]?.value || '0');

    // Process traffic sources (last 30 days)
    let trafficSources = [];
    try {
      trafficSources = trafficSourcesResponse.data.rows?.map(row => {
        const channel = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value || '0');
        
        console.log('Processing traffic source row:', { channel, sessions });
        
        // Create a more descriptive source name based on channel
        let displayName = channel;
        let iconType = 'default';
        
        // Enhance social media detection based on channel
        if (channel.toLowerCase().includes('social')) {
          displayName = 'Social Media';
          iconType = 'social';
        } else if (channel.toLowerCase().includes('organic')) {
          displayName = 'Organic Search';
          iconType = 'search';
        } else if (channel.toLowerCase().includes('direct')) {
          displayName = 'Direct Traffic';
          iconType = 'direct';
        } else if (channel.toLowerCase().includes('referral')) {
          displayName = 'Referral Traffic';
          iconType = 'referral';
        } else if (channel.toLowerCase().includes('email')) {
          displayName = 'Email';
          iconType = 'email';
        } else if (channel.toLowerCase().includes('paid')) {
          displayName = 'Paid Search';
          iconType = 'paid';
        }
        
        return {
          source: displayName,
          sessions: sessions,
          originalSource: channel,
          medium: channel,
          channel: channel,
          iconType: iconType
        };
      }) || [];
      
      console.log('Enhanced traffic sources processed:', trafficSources);
    } catch (error) {
      console.log('Enhanced traffic sources failed, falling back to basic method:', error);
      // Fallback to basic traffic sources
      trafficSources = trafficSourcesResponse.data.rows?.map(row => ({
        source: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value || '0'),
        originalSource: row.dimensionValues[0].value,
        medium: row.dimensionValues[0].value,
        channel: row.dimensionValues[0].value,
        iconType: 'default'
      })) || [];
    }

    // Process top pages (last 30 days)
    const topPages = topPagesResponse.data.rows?.map(row => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value || '0')
    })) || [];

    // Process device breakdown (last 30 days)
    let deviceBreakdown = [];
    try {
      deviceBreakdown = deviceBreakdownResponse.data.rows?.map(row => {
        const device = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value || '0');
        
        return {
          device: device,
          sessions: sessions,
          percentage: 0 // Will be calculated below
        };
      }) || [];
      
      // Calculate percentages
      const totalDeviceSessions = deviceBreakdown.reduce((sum, device) => sum + device.sessions, 0);
      if (totalDeviceSessions > 0) {
        deviceBreakdown = deviceBreakdown.map(device => ({
          ...device,
          percentage: Math.round((device.sessions / totalDeviceSessions) * 100)
        }));
      }
      
      console.log('Device breakdown processed:', deviceBreakdown);
    } catch (error) {
      console.log('Device breakdown processing failed:', error);
      deviceBreakdown = [];
    }

    // Process geographic data (last 30 days)
    let geographicData = [];
    try {
      geographicData = geographicResponse.data.rows?.map(row => {
        const country = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value || '0');
        
        return {
          country: country,
          sessions: sessions,
          percentage: 0 // Will be calculated below
        };
      }) || [];
      
      // Calculate percentages
      const totalGeoSessions = geographicData.reduce((sum, geo) => sum + geo.sessions, 0);
      if (totalGeoSessions > 0) {
        geographicData = geographicData.map(geo => ({
          ...geo,
          percentage: Math.round((geo.sessions / totalGeoSessions) * 100)
        }));
      }
      
      console.log('Geographic data processed:', geographicData);
    } catch (error) {
      console.log('Geographic data processing failed:', error);
      geographicData = [];
    }

    const analyticsData = {
      today,
      thisMonth,
      thisYear,
      total,
      todaySessions,
      monthSessions,
      todayUsers,
      monthUsers,
      todayDuration,
      monthDuration,
      todayBounceRate,
      monthBounceRate,
      trafficSources,
      topPages,
      deviceBreakdown,
      geographicData
    };

    console.log('Analytics data prepared:', analyticsData);
    res.json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
}); 