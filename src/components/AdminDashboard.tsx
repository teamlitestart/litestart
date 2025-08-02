import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Settings, 
  LogOut,
  ArrowRight,
  Database,
  Activity
} from 'lucide-react';
import SignupUsersAdmin from './SignupUsersAdmin';
import PlatformUsersAdmin from './PlatformUsersAdmin';
import { apiCall } from '../config/api';

type AdminView = 'dashboard' | 'signup-users' | 'platform-users';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupUsers, setSignupUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Admin password - in production, this should be more secure
  const ADMIN_PASSWORD = 'BES25';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('main_admin_authenticated', 'true');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('main_admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://litestart-backend.onrender.com/api/users');
      setBackendStatus(response.ok ? 'online' : 'offline');
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const fetchSignupUsers = async () => {
    try {
      setLoading(true);
      const data = await apiCall.getUsers();
      setSignupUsers(data);
    } catch (err) {
      console.error('Failed to fetch signup users:', err);
      setSignupUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkBackendStatus();
      fetchSignupUsers();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('main_admin_authenticated');
    sessionStorage.removeItem('signup_admin_authenticated');
    sessionStorage.removeItem('platform_admin_authenticated');
    setPassword('');
    setCurrentView('dashboard');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LiteStart Admin</h1>
            <p className="text-gray-600">Enter password to access admin dashboard</p>
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

  // Render specific admin panels
  if (currentView === 'signup-users') {
    return <SignupUsersAdmin />;
  }

  if (currentView === 'platform-users') {
    return <PlatformUsersAdmin />;
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">LiteStart Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">Manage your LiteStart platform and user data</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Signup Users</p>
                <p className="text-2xl font-bold text-blue-900">
                  {loading ? '...' : signupUsers.length}
                </p>
                <p className="text-xs text-gray-500">Landing page signups</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Platform Users</p>
                <p className="text-2xl font-bold text-green-900">0</p>
                <p className="text-xs text-gray-500">Active accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">System Status</p>
                <p className="text-2xl font-bold text-purple-900">
                  {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
                </p>
                <p className="text-xs text-gray-500">
                  {backendStatus === 'online' ? 'All systems operational' : 
                   backendStatus === 'offline' ? 'Backend sleeping' : 'Checking connection...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Signup Users Admin */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Signup Users</h3>
                  <p className="text-sm text-gray-600">Manage landing page signups</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Signups:</span>
                  <span className="font-medium">
                    {loading ? '...' : signupUsers.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Startups:</span>
                  <span className="font-medium text-blue-600">
                    {loading ? '...' : signupUsers.filter(u => u.userType === 'startup').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium text-green-600">
                    {loading ? '...' : signupUsers.filter(u => u.userType === 'student').length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('signup-users')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Manage Signup Users</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Platform Users Admin */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Platform Users</h3>
                  <p className="text-sm text-gray-600">Manage authenticated users</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-medium text-green-600">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Suspended:</span>
                  <span className="font-medium text-red-600">0</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('platform-users')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Manage Platform Users</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Database className="h-5 w-5 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-600">Download user reports</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">System Settings</p>
                <p className="text-sm text-gray-600">Configure platform</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Activity className="h-5 w-5 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">View platform metrics</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 