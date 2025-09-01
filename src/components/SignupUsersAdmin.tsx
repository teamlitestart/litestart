import React, { useState, useEffect } from 'react';
import { apiCall } from '../config/api';
import API_BASE_URL from '../config/api';

interface SignupUser {
  _id: string;
  name: string;
  email: string;
  userType: 'startup' | 'student';
  isEmailVerified: boolean;
  signupDate: string;
}

const SignupUsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<SignupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'startup' | 'student'>('all');
  const [nameFilter, setNameFilter] = useState('');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'waking' | 'checking'>('checking');
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllSafetyCode, setDeleteAllSafetyCode] = useState('');
  const [deleteAllStep, setDeleteAllStep] = useState<'confirm' | 'safety-code'>('confirm');
  // No password required - already authenticated from main dashboard
  const isAuthenticated = true;

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesName = user.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesEmailVerified = emailVerifiedFilter === 'all' || 
      (emailVerifiedFilter === 'verified' && user.isEmailVerified) ||
      (emailVerifiedFilter === 'unverified' && !user.isEmailVerified);
    return matchesType && matchesName && matchesEmailVerified;
  });

  const checkBackendStatus = async () => {
    try {
      const health = await apiCall.checkHealth();
      const status = health.status as 'online' | 'offline' | 'waking' | 'checking';
      setBackendStatus(status);
      
      // If backend is online but MongoDB is not connected, show a special status
      if (status === 'online' && !health.mongoConnected) {
        setBackendStatus('waking'); // New status for when backend is up but MongoDB is connecting
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiCall.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      // Fallback to local storage
      const localUsers = JSON.parse(localStorage.getItem('signupUsers') || '[]');
      setUsers(localUsers);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiCall.deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const deleteAllUsers = async () => {
    // Start the safety process
    setShowDeleteAllModal(true);
    setDeleteAllStep('confirm');
    setDeleteAllSafetyCode('');
  };

  const confirmDeleteAll = async () => {
    if (deleteAllStep === 'confirm') {
      // Move to safety code step
      setDeleteAllStep('safety-code');
      return;
    }

    if (deleteAllStep === 'safety-code') {
      // Check safety code
      if (deleteAllSafetyCode !== 'DELETE_ALL_USERS') {
        alert('Incorrect safety code. Please enter the exact code: DELETE_ALL_USERS');
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
        alert('All signup users deleted successfully!');
        
        // Close modal and reset
        setShowDeleteAllModal(false);
        setDeleteAllStep('confirm');
        setDeleteAllSafetyCode('');
      } catch (err) {
        console.error('Delete all error:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete all users');
      }
    }
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllModal(false);
    setDeleteAllStep('confirm');
    setDeleteAllSafetyCode('');
  };

  const handleLogout = () => {
    // setIsAuthenticated(false); // This line was removed as per the edit hint
    sessionStorage.removeItem('signup_admin_authenticated');
    // setPassword(''); // This line was removed as per the edit hint
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkBackendStatus();
      fetchUsers();
      
      // Set up periodic health checks every 10 seconds
      const healthCheckInterval = setInterval(() => {
        checkBackendStatus();
      }, 10000);
      
      return () => clearInterval(healthCheckInterval);
    }
  }, [isAuthenticated]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading signup users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Signup Users Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage users who signed up on the landing page</p>
            </div>
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
                Delete All
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Back to Dashboard
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
              : backendStatus === 'waking'
              ? 'bg-blue-100 border border-blue-400 text-blue-700'
              : backendStatus === 'offline'
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              : 'bg-gray-100 border border-gray-400 text-gray-700'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'waking' ? 'bg-blue-500' :
                backendStatus === 'offline' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <span className="font-medium">
                {backendStatus === 'online' ? '🟢 Render Backend Active - Connected to MongoDB' :
                 backendStatus === 'waking' ? '🔵 Render Backend Active - Connecting to MongoDB...' :
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
            {backendStatus === 'waking' && (
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <strong>🔵 Render Backend Status:</strong> Backend is awake but MongoDB is still connecting. This is normal after the backend wakes up from sleep.
                </p>
                <p className="text-sm">
                  <strong>What's happening:</strong> The backend server is running, but it's still establishing the connection to MongoDB. This usually takes 5-15 seconds.
                </p>
                <p className="text-sm">
                  <strong>Current data source:</strong> Local browser storage (showing cached data while MongoDB connects)
                </p>
                <p className="text-sm text-blue-600">
                  🔄 MongoDB connection in progress... Data will sync automatically once connected.
                </p>
                <button
                  onClick={() => {
                    checkBackendStatus();
                    fetchUsers();
                  }}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  🔄 Retry Connection
                </button>
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
              Total Signup Users: <span className="font-semibold">{users.length}</span>
            </p>
            <p className="text-blue-700">
              Startups: <span className="font-semibold">{users.filter(u => u.userType === 'startup').length}</span>
            </p>
            <p className="text-green-700">
              Students: <span className="font-semibold">{users.filter(u => u.userType === 'student').length}</span>
            </p>
            <p className="text-green-600">
              Verified Emails: <span className="font-semibold">{users.filter(u => u.isEmailVerified).length}</span>
            </p>
            <p className="text-red-600">
              Unverified Emails: <span className="font-semibold">{users.filter(u => !u.isEmailVerified).length}</span>
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
                value={emailVerifiedFilter}
                onChange={e => setEmailVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Emails</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
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
              No signup users found
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
                      Email Valid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isEmailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isEmailVerified ? '✅ Valid Email' : '❌ Invalid Email'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete All Safety Modal */}
          {showDeleteAllModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  
                  {deleteAllStep === 'confirm' ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ⚠️ Delete All Users
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        This will permanently delete <strong>ALL {users.length} signup users</strong> from the database. 
                        This action cannot be undone.
                      </p>
                      <p className="text-sm text-red-600 mb-6 font-medium">
                        Are you absolutely sure you want to continue?
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        🔒 Safety Code Required
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        To confirm deletion of all {users.length} users, please enter the safety code:
                      </p>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-4">
                        DELETE_ALL_USERS
                      </p>
                      <input
                        type="text"
                        value={deleteAllSafetyCode}
                        onChange={(e) => setDeleteAllSafetyCode(e.target.value)}
                        placeholder="Enter safety code..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        autoFocus
                      />
                    </>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={cancelDeleteAll}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteAll}
                      className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors ${
                        deleteAllStep === 'safety-code' && deleteAllSafetyCode === 'DELETE_ALL_USERS'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {deleteAllStep === 'confirm' ? 'Continue' : 'Delete All Users'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupUsersAdmin; 