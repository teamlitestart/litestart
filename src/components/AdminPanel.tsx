import React, { useState, useEffect } from 'react';



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
  // Student-specific fields
  cvUrl?: string;
  cvFilename?: string;
  cvSize?: number;
  cvUploadDate?: string;
  // Startup-specific fields
  companyDescription?: string;
  companyWebsite?: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'startup' | 'student'>('all');
  const [nameFilter, setNameFilter] = useState('');
  const [emailStatusFilter, setEmailStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'bounced' | 'failed'>('all');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Admin password - in production, this should be more secure
  const ADMIN_PASSWORD = 'BES25';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      // Store authentication in session storage
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetails(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Filtered users with enhanced filtering
  const filteredUsers = users.filter(user => {
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesName = user.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    // Enhanced email status filtering
    let matchesEmailStatus = true;
    if (emailStatusFilter === 'verified') {
      matchesEmailStatus = user.isEmailVerified;
    } else if (emailStatusFilter === 'unverified') {
      matchesEmailStatus = !user.isEmailVerified;
    } else if (emailStatusFilter === 'bounced') {
      matchesEmailStatus = user.emailDeliveryStatus === 'bounced';
    } else if (emailStatusFilter === 'failed') {
      matchesEmailStatus = user.emailDeliveryStatus === 'failed';
    }
    
    return matchesType && matchesName && matchesEmailStatus;
  });

  const checkBackendStatus = async () => {
    try {
      console.log('Checking backend status... (Production v3 - FORCE DEPLOY)');
      const response = await fetch('https://litestart-backend.onrender.com/health');
      console.log('Health check response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Health check data:', data);
        setBackendStatus(data.mongoConnected ? 'online' : 'offline');
      } else {
        console.log('Health check failed with status:', response.status);
        setBackendStatus('offline');
      }
    } catch (err) {
      console.error('Backend status check failed:', err);
      setBackendStatus('offline');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users from backend... (Production v3 - FORCE DEPLOY)');
      const response = await fetch('https://litestart-backend.onrender.com/api/users');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched users data:', data);
      console.log('Number of users:', data.length);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`https://litestart-backend.onrender.com/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Refresh the data to ensure consistency
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const verifyEmail = async (email: string) => {
    try {
      const response = await fetch(`https://litestart-backend.onrender.com/api/verify-email/${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify email');
      }
      
              await response.json();
      
      // Refresh the data to show updated status
      await fetchUsers();
      alert('Email verification completed!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to verify email');
    }
  };

  const deleteAllUsers = async () => {
    if (!confirm('Are you sure you want to delete ALL users? This cannot be undone!')) {
      return;
    }

    try {
      if (backendStatus === 'online') {
        // Call the backend API to delete all users
        const response = await fetch('https://litestart-backend.onrender.com/api/users', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete all users');
        }
      } else {
        // Clear local storage if backend is offline
        localStorage.removeItem('litestart_users');
      }
      
      // Refresh the data to ensure consistency
      await fetchUsers();
      alert('All users deleted successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete all users');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  // Helper function to get email status display
  const getEmailStatusDisplay = (user: User) => {
    if (user.isEmailVerified) {
      return {
        text: '✅ Valid Email',
        className: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    }
    
    if (user.emailDeliveryStatus === 'bounced') {
      return {
        text: '❌ Bounced',
        className: 'bg-red-100 text-red-800',
        icon: '❌'
      };
    }
    
    if (user.emailDeliveryStatus === 'complained') {
      return {
        text: '🚫 Spam Report',
        className: 'bg-orange-100 text-orange-800',
        icon: '🚫'
      };
    }
    
    if (user.emailDeliveryStatus === 'failed') {
      return {
        text: '⚠️ Failed',
        className: 'bg-yellow-100 text-yellow-800',
        icon: '⚠️'
      };
    }
    
    return {
      text: '❓ Unknown',
      className: 'bg-gray-100 text-gray-800',
      icon: '❓'
    };
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkBackendStatus();
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LiteStart Admin</h1>
            <p className="text-gray-600">Enter password to access admin panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">LiteStart Admin Panel</h1>
            <div className="space-x-4">
              <button
                onClick={fetchUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Refresh
              </button>
              <button
                onClick={deleteAllUsers}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete All Users
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Backend Status Indicator */}
          <div className={`mb-4 p-3 rounded-lg ${
            backendStatus === 'online' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : backendStatus === 'offline'
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              : 'bg-gray-100 border border-gray-400 text-gray-700'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'offline' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <span className="font-medium">
                {backendStatus === 'online' ? '🟢 Render Backend Active - Connected to MongoDB' :
                 backendStatus === 'offline' ? '🟡 Render Backend Sleeping - Using Local Storage' :
                 '⚪ Checking Render connection...'}
              </span>
            </div>
            {backendStatus === 'offline' && (
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <strong>⚠️ Render Backend Status:</strong> The backend on Render may be sleeping (free tier behavior). New signups are stored locally and will sync when the backend wakes up.
                </p>
                <p className="text-sm">
                  <strong>What happens:</strong> When users sign up while backend is sleeping, data goes to their local storage first, then syncs to MongoDB when Render wakes up (~30 seconds).
                </p>
                <p className="text-sm">
                  <strong>Current data source:</strong> Local browser storage (showing cached data while backend wakes up)
                </p>
                <p className="text-sm text-blue-600">
                  💡 This is normal for Render's free tier. Data will appear here once the backend is fully awake.
                </p>
              </div>
            )}
            {backendStatus === 'online' && (
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <strong>🟢 Render Backend Active:</strong> Connected to MongoDB - viewing all global signups from users worldwide.
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> Backend is awake and processing requests in real-time.
                </p>
                <p className="text-sm text-green-600">
                  ✅ All new signups are immediately saved to MongoDB and visible here.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-2 md:space-y-0">
            <p className="text-gray-600">
              Total Users: <span className="font-semibold">{users.length}</span>
            </p>
            <p className="text-blue-700">
              Startups: <span className="font-semibold">{users.filter(u => u.userType === 'startup').length}</span>
            </p>
            <p className="text-green-700">
              Students: <span className="font-semibold">{users.filter(u => u.userType === 'student').length}</span>
            </p>
            <p className="text-green-600">
              Valid Emails: <span className="font-semibold">{users.filter(u => u.isEmailVerified).length}</span>
            </p>
            <p className="text-red-600">
              Invalid Emails: <span className="font-semibold">{users.filter(u => !u.isEmailVerified).length}</span>
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
              <select
                value={userTypeFilter}
                onChange={e => setUserTypeFilter(e.target.value as 'all' | 'startup' | 'student')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="startup">Startups</option>
                <option value="student">Students</option>
              </select>
              <select
                value={emailStatusFilter}
                onChange={e => setEmailStatusFilter(e.target.value as 'all' | 'verified' | 'unverified' | 'bounced' | 'failed')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Email Status</option>
                <option value="verified">Valid Emails</option>
                <option value="unverified">Invalid Emails</option>
                <option value="bounced">Bounced</option>
                <option value="failed">Failed</option>
              </select>
              <input
                type="text"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {users.length === 0 ? 'No signup users found' : 'No users match the current filters'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Signup Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CV/Company Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const emailStatus = getEmailStatusDisplay(user);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.userType === 'startup' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.signupDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${emailStatus.className}`}>
                            {emailStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div className="text-xs">
                              Status: {user.emailDeliveryStatus || 'pending'}
                            </div>
                            {user.emailBounceReason && (
                              <div className="text-xs text-red-600">
                                Reason: {user.emailBounceReason}
                              </div>
                            )}
                            {user.emailBounceDate && (
                              <div className="text-xs text-gray-400">
                                Bounced: {new Date(user.emailBounceDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.userType === 'student' ? (
                            user.cvUrl ? (
                              <div className="space-y-1">
                                <div className="text-xs text-green-600 font-medium">
                                  ✓ CV Uploaded
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.cvFilename}
                                </div>
                                {user.cvSize && (
                                  <div className="text-xs text-gray-400">
                                    {formatFileSize(user.cvSize)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-red-600">
                                ✗ No CV
                              </div>
                            )
                          ) : (
                            <div className="space-y-1">
                              {user.companyDescription && (
                                <div className="text-xs text-green-600">
                                  ✓ Description
                                </div>
                              )}
                              {user.companyWebsite && (
                                <div className="text-xs text-blue-600">
                                  ✓ Website
                                </div>
                              )}
                              {!user.companyDescription && !user.companyWebsite && (
                                <div className="text-xs text-gray-500">
                                  No info
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewUserDetails(user)}
                            className="text-green-600 hover:text-green-900"
                            title="View details"
                          >
                            📋 Details
                          </button>
                          <button
                            onClick={() => verifyEmail(user.email)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Re-verify email"
                          >
                            🔍 Verify
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Details - {selectedUser.name}
                </h2>
                <button
                  onClick={handleCloseUserDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.userType === 'startup' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedUser.userType}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Signup Date:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedUser.signupDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email Status</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Verified:</span>
                      <span className={`ml-2 ${selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Delivery Status:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.emailDeliveryStatus || 'pending'}</span>
                    </div>
                    {selectedUser.emailBounceReason && (
                      <div>
                        <span className="font-medium text-gray-700">Bounce Reason:</span>
                        <span className="ml-2 text-red-600">{selectedUser.emailBounceReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Student CV Information */}
                {selectedUser.userType === 'student' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">CV Information</h3>
                    {selectedUser.cvUrl ? (
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className="ml-2 text-green-600">✓ Uploaded</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Filename:</span>
                          <span className="ml-2 text-gray-900">{selectedUser.cvFilename}</span>
                        </div>
                        {selectedUser.cvSize && (
                          <div>
                            <span className="font-medium text-gray-700">File Size:</span>
                            <span className="ml-2 text-gray-900">{formatFileSize(selectedUser.cvSize)}</span>
                          </div>
                        )}
                        {selectedUser.cvUploadDate && (
                          <div>
                            <span className="font-medium text-gray-700">Upload Date:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(selectedUser.cvUploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="pt-2">
                          <a
                            href={selectedUser.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            📄 View CV
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600">No CV uploaded</div>
                    )}
                  </div>
                )}

                {/* Startup Company Information */}
                {selectedUser.userType === 'startup' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    <div className="space-y-2">
                      {selectedUser.companyDescription ? (
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                            {selectedUser.companyDescription}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No company description provided</div>
                      )}
                      
                      {selectedUser.companyWebsite && (
                        <div>
                          <span className="font-medium text-gray-700">Website:</span>
                          <div className="mt-1">
                            <a
                              href={selectedUser.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {selectedUser.companyWebsite}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 