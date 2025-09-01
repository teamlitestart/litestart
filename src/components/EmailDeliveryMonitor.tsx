import React, { useState, useEffect } from 'react';


interface EmailStats {
  total: number;
  verified: number;
  bounced: number;
  failed: number;
  complained: number;
  sent: number;
  unverified: number;
  deliveryRate: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  userType: 'startup' | 'student';
  isEmailVerified: boolean;
  emailDeliveryStatus?: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained';
  emailBounceReason?: string;
  emailBounceDate?: string;
  emailSentDate?: string;
  emailVerifiedDate?: string;
  signupDate: string;
}

const EmailDeliveryMonitor: React.FC = () => {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [bouncedUsers, setBouncedUsers] = useState<User[]>([]);
  const [failedUsers, setFailedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmailStats = async () => {
    try {
      const response = await fetch('https://litestart-backend.onrender.com/api/email-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch email stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching email stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch email stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://litestart-backend.onrender.com/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users: User[] = await response.json();
      
      // Filter bounced and failed users
      setBouncedUsers(users.filter(user => user.emailDeliveryStatus === 'bounced'));
      setFailedUsers(users.filter(user => user.emailDeliveryStatus === 'failed'));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const simulateBounce = async (email: string, reason: string) => {
    try {
      const response = await fetch(`https://litestart-backend.onrender.com/api/simulate-bounce/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to simulate bounce');
      }
      
      // Refresh data
      await Promise.all([fetchEmailStats(), fetchUsers()]);
      alert('Bounce simulated successfully!');
    } catch (err) {
      console.error('Error simulating bounce:', err);
      alert(err instanceof Error ? err.message : 'Failed to simulate bounce');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmailStats(), fetchUsers()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading email delivery data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Email Delivery Monitor</h1>
            <button
              onClick={() => Promise.all([fetchEmailStats(), fetchUsers()])}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Refresh Data
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Valid Emails</h3>
                <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-sm text-green-700">Delivery Rate: {stats.deliveryRate}%</p>
              </div>
              
              <div className="bg-red-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Bounced Emails</h3>
                <p className="text-3xl font-bold text-red-600">{stats.bounced}</p>
                <p className="text-sm text-red-700">Need attention</p>
              </div>
              
              <div className="bg-yellow-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">Failed Emails</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.failed}</p>
                <p className="text-sm text-yellow-700">Delivery issues</p>
              </div>
              
              <div className="bg-orange-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800">Spam Reports</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.complained}</p>
                <p className="text-sm text-orange-700">User complaints</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bounced Emails Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bounced Emails ({bouncedUsers.length})</h2>
              {bouncedUsers.length === 0 ? (
                <p className="text-gray-500">No bounced emails found.</p>
              ) : (
                <div className="space-y-3">
                  {bouncedUsers.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-red-600 mt-1">
                            Reason: {user.emailBounceReason || 'Unknown'}
                          </p>
                          {user.emailBounceDate && (
                            <p className="text-xs text-gray-500">
                              Bounced: {new Date(user.emailBounceDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => simulateBounce(user.email, 'Manual bounce simulation')}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Simulate Bounce
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Failed Emails Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Failed Emails ({failedUsers.length})</h2>
              {failedUsers.length === 0 ? (
                <p className="text-gray-500">No failed emails found.</p>
              ) : (
                <div className="space-y-3">
                  {failedUsers.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Status: {user.emailDeliveryStatus}
                          </p>
                          {user.emailSentDate && (
                            <p className="text-xs text-gray-500">
                              Sent: {new Date(user.emailSentDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => simulateBounce(user.email, 'Manual failure simulation')}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Simulate Bounce
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Recommendations</h2>
            <div className="space-y-3">
              {stats && stats.bounced > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  </div>
                  <p className="text-blue-800">
                    <strong>{stats.bounced} bounced emails detected.</strong> Consider removing these addresses from your mailing list to maintain good sender reputation.
                  </p>
                </div>
              )}
              
              {stats && stats.complained > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  </div>
                  <p className="text-blue-800">
                    <strong>{stats.complained} spam reports received.</strong> Review your email content and frequency to reduce complaints.
                  </p>
                </div>
              )}
              
              {stats && parseFloat(stats.deliveryRate) < 80 && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-blue-800">
                    <strong>Low delivery rate ({stats.deliveryRate}%).</strong> Consider implementing better email validation and cleaning your list regularly.
                  </p>
                </div>
              )}
              
              {stats && stats.bounced === 0 && stats.complained === 0 && parseFloat(stats.deliveryRate) >= 80 && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <p className="text-blue-800">
                    <strong>Excellent email health!</strong> Your delivery rate is {stats.deliveryRate}% with no bounces or complaints.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDeliveryMonitor; 