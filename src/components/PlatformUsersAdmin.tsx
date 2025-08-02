import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Calendar, 
  Mail, 
  Shield, 
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'startup' | 'student';
  accountStatus: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  signupDate: string;
  projectsPosted?: number;
  projectsApplied?: number;
  totalEarnings?: number;
  rating?: number;
  university?: string;
  company?: string;
  isEmailVerified: boolean;
}

const PlatformUsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'startup' | 'student'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin password - in production, this should be more secure
  const ADMIN_PASSWORD = 'BES25';

  // Sample data for demonstration
  const sampleUsers: PlatformUser[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@bristol.ac.uk',
      userType: 'student',
      accountStatus: 'active',
      lastLogin: '2024-01-25T10:30:00Z',
      signupDate: '2024-01-15T14:20:00Z',
      projectsApplied: 5,
      totalEarnings: 1200,
      rating: 4.8,
      university: 'University of Bristol',
      isEmailVerified: true
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Rodriguez',
      email: 'marcus@techflow.com',
      userType: 'startup',
      accountStatus: 'active',
      lastLogin: '2024-01-24T16:45:00Z',
      signupDate: '2024-01-10T09:15:00Z',
      projectsPosted: 3,
      company: 'TechFlow Solutions',
      isEmailVerified: true
    },
    {
      id: '3',
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'emma.thompson@bristol.ac.uk',
      userType: 'student',
      accountStatus: 'active',
      lastLogin: '2024-01-23T11:20:00Z',
      signupDate: '2024-01-12T13:30:00Z',
      projectsApplied: 2,
      totalEarnings: 600,
      rating: 4.9,
      university: 'University of Bristol',
      isEmailVerified: true
    },
    {
      id: '4',
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@healthtech.com',
      userType: 'startup',
      accountStatus: 'inactive',
      lastLogin: '2024-01-20T08:15:00Z',
      signupDate: '2024-01-08T10:45:00Z',
      projectsPosted: 1,
      company: 'HealthTech Innovations',
      isEmailVerified: false
    },
    {
      id: '5',
      firstName: 'Tyler',
      lastName: 'Bains',
      email: 'tyler.bains@bristol.ac.uk',
      userType: 'student',
      accountStatus: 'suspended',
      lastLogin: '2024-01-18T14:30:00Z',
      signupDate: '2024-01-05T16:20:00Z',
      projectsApplied: 0,
      totalEarnings: 0,
      rating: 0,
      university: 'University of Bristol',
      isEmailVerified: true
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('platform_admin_authenticated', 'true');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('platform_admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    const matchesSearch = user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call - in production, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(sampleUsers);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch platform users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this platform user? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(users.filter(user => user.id !== id));
      alert('Platform user deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const suspendUser = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) {
      return;
    }

    try {
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, accountStatus: 'suspended' as const }
          : user
      ));
      alert('User suspended successfully!');
    } catch (err) {
      alert('Failed to suspend user');
    }
  };

  const activateUser = async (id: string) => {
    try {
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, accountStatus: 'active' as const }
          : user
      ));
      alert('User activated successfully!');
    } catch (err) {
      alert('Failed to activate user');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('platform_admin_authenticated');
    setPassword('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Users Admin</h1>
            <p className="text-gray-600">Enter password to access platform users admin panel</p>
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
        <div className="text-xl">Loading platform users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Users Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage users who created accounts on the main platform</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={fetchUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Activity className="h-4 w-4" />
                <span>Refresh</span>
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">
                    {users.filter(u => u.accountStatus === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Startups</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {users.filter(u => u.userType === 'startup').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Students</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {users.filter(u => u.userType === 'student').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
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
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No platform users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">
                              {user.userType === 'student' ? user.university : user.company}
                            </div>
                          </div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.accountStatus === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : user.accountStatus === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.userType === 'student' ? (
                          <div>
                            <div>Applied: {user.projectsApplied}</div>
                            <div>Earnings: £{user.totalEarnings}</div>
                            <div>Rating: {user.rating}/5</div>
                          </div>
                        ) : (
                          <div>
                            <div>Posted: {user.projectsPosted}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {/* View user details */}}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {user.accountStatus === 'active' ? (
                            <button
                              onClick={() => suspendUser(user.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Suspend User"
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => activateUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Activate User"
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformUsersAdmin; 