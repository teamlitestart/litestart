import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Briefcase, 
  Users, 
  Clock, 
  Star, 
  Filter,
  LogOut,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sample data for students
  const studentProjects = [
    {
      id: 1,
      title: "Marketing Strategy for FinTech Startup",
      company: "TechFlow Solutions",
      duration: "2 weeks",
      compensation: "£500",
      skills: ["Marketing", "Strategy", "Analytics"],
      description: "Help develop a comprehensive marketing strategy for our new fintech product launch.",
      status: "open"
    },
    {
      id: 2,
      title: "Frontend Development for E-commerce Platform",
      company: "ShopSmart",
      duration: "3 weeks",
      compensation: "£800",
      skills: ["React", "JavaScript", "CSS"],
      description: "Build responsive frontend components for our e-commerce platform.",
      status: "open"
    },
    {
      id: 3,
      title: "Data Analysis for Healthcare Startup",
      company: "HealthTech Innovations",
      duration: "1 week",
      compensation: "£300",
      skills: ["Python", "Data Analysis", "Excel"],
      description: "Analyze patient data to identify trends and insights.",
      status: "open"
    }
  ];

  // Sample data for startups
  const startupProjects = [
    {
      id: 1,
      title: "Marketing Strategy for FinTech Startup",
      applications: 12,
      status: "active",
      duration: "2 weeks",
      compensation: "£500",
      postedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Social Media Content Creation",
      applications: 8,
      status: "active",
      duration: "1 week",
      compensation: "£300",
      postedDate: "2024-01-10"
    }
  ];

  const studentApplications = [
    {
      id: 1,
      projectTitle: "Marketing Strategy for FinTech Startup",
      company: "TechFlow Solutions",
      status: "pending",
      appliedDate: "2024-01-20"
    },
    {
      id: 2,
      projectTitle: "Frontend Development for E-commerce Platform",
      company: "ShopSmart",
      status: "accepted",
      appliedDate: "2024-01-18"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/litestart-logo.png" alt="LiteStart logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Dashboard</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.userType === 'student' ? 'Student' : 'Startup'}!
          </h1>
          <p className="text-gray-600">
            {user.userType === 'student' 
              ? 'Discover exciting opportunities and build your career'
              : 'Find talented students to help grow your startup'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user.userType === 'student' ? 'Available Projects' : 'Active Projects'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user.userType === 'student' ? studentProjects.length : startupProjects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user.userType === 'student' ? 'Applications' : 'Total Applications'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user.userType === 'student' ? studentApplications.length : '24'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
                              <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {user.userType === 'student' ? 'Available Projects' : 'My Projects'}
                </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {userType === 'student' ? 'My Applications' : 'Applications'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' && (
              <div>
                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                  </button>
                  {user.userType === 'startup' && (
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      <Plus className="h-5 w-5" />
                      <span>Post Project</span>
                    </button>
                  )}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(user.userType === 'student' ? studentProjects : startupProjects).map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{project.company}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {project.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {project.compensation}
                        </div>
                                                 {user.userType === 'startup' && (
                           <div className="flex items-center text-sm text-gray-500">
                             <Users className="h-4 w-4 mr-2" />
                             {project.applications} applications
                           </div>
                         )}
                      </div>

                                             {user.userType === 'student' && (
                         <div className="mb-4">
                           <div className="flex flex-wrap gap-1">
                             {project.skills.map((skill, index) => (
                               <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                 {skill}
                               </span>
                             ))}
                           </div>
                         </div>
                       )}

                                             <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                         {user.userType === 'student' ? 'Apply Now' : 'View Applications'}
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="space-y-4">
                  {studentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{application.projectTitle}</h4>
                        <p className="text-sm text-gray-600">{application.company}</p>
                        <p className="text-xs text-gray-500">Applied: {application.appliedDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 