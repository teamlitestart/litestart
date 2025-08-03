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
  Bell,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Initialize startup projects data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userType === 'startup') {
      setStartupProjects(startupProjectsData);
    }
  }, [isAuthenticated, user?.userType]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Startup dashboard functions
  const [startupProjects, setStartupProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [applicationSort, setApplicationSort] = useState<'date' | 'name' | 'university'>('date');

  const handleViewApplications = (project: any) => {
    setSelectedProject(project);
    setShowApplicationsModal(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject({ ...project });
    setShowProjectModal(true);
  };

  const handleUpdateApplicationStatus = (projectId: number, applicationId: number, newStatus: string) => {
    setStartupProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            applicationsList: project.applicationsList.map((app: any) => 
              app.id === applicationId ? { ...app, status: newStatus } : app
            ),
            applications: project.applicationsList.length
          };
        }
        return project;
      })
    );
    
    // Update selected project if it's currently being viewed
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => ({
        ...prev,
        applicationsList: prev.applicationsList.map((app: any) => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      }));
    }
    
    alert(`Application status updated to ${newStatus}`);
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setStartupProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      alert('Project deleted successfully');
    }
  };

  const handlePublishProject = (projectId: number) => {
    setStartupProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId ? { ...project, status: 'active' } : project
      )
    );
    alert('Project published successfully');
  };

  const handleSaveProject = (updatedProject: any) => {
    setStartupProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setShowProjectModal(false);
    setEditingProject(null);
    alert('Project updated successfully');
  };

  const handleCreateNewProject = (newProject: any) => {
    const projectWithId = {
      ...newProject,
      id: Math.max(...startupProjects.map(p => p.id)) + 1,
      applications: 0,
      applicationsList: [],
      postedDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    setStartupProjects(prevProjects => [...prevProjects, projectWithId]);
    setShowNewProjectModal(false);
    alert('Project created successfully');
  };

  const handleMessageStudent = (studentEmail: string, studentName: string) => {
    alert(`Opening message interface for ${studentName} (${studentEmail})`);
    // In a real app, this would open a messaging interface
  };

  const handleViewStudentProfile = (studentEmail: string, studentName: string) => {
    alert(`Opening profile for ${studentName} (${studentEmail})`);
    // In a real app, this would open a student profile modal
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
  const startupProjectsData = [
    {
      id: 1,
      title: "Marketing Strategy for FinTech Startup",
      applications: 12,
      status: "active",
      duration: "2 weeks",
      compensation: "£500",
      postedDate: "2024-01-15",
      description: "Help develop a comprehensive marketing strategy for our new fintech product launch.",
      skills: ["Marketing", "Strategy", "Analytics"],
      applicationsList: [
        { id: 1, studentName: "Sarah Chen", email: "sarah.chen@bristol.ac.uk", status: "pending", appliedDate: "2024-01-20", university: "University of Bristol" },
        { id: 2, studentName: "Emma Thompson", email: "emma.thompson@bristol.ac.uk", status: "accepted", appliedDate: "2024-01-18", university: "University of Bristol" },
        { id: 3, studentName: "James Wilson", email: "james.wilson@bristol.ac.uk", status: "rejected", appliedDate: "2024-01-17", university: "University of Bristol" }
      ]
    },
    {
      id: 2,
      title: "Social Media Content Creation",
      applications: 8,
      status: "active",
      duration: "1 week",
      compensation: "£300",
      postedDate: "2024-01-10",
      description: "Create engaging social media content for our brand across multiple platforms.",
      skills: ["Content Creation", "Social Media", "Design"],
      applicationsList: [
        { id: 4, studentName: "Alex Johnson", email: "alex.johnson@bristol.ac.uk", status: "pending", appliedDate: "2024-01-19", university: "University of Bristol" },
        { id: 5, studentName: "Maria Garcia", email: "maria.garcia@bristol.ac.uk", status: "pending", appliedDate: "2024-01-16", university: "University of Bristol" }
      ]
    },
    {
      id: 3,
      title: "Frontend Development for E-commerce Platform",
      applications: 5,
      status: "draft",
      duration: "3 weeks",
      compensation: "£800",
      postedDate: "2024-01-25",
      description: "Build responsive frontend components for our e-commerce platform.",
      skills: ["React", "JavaScript", "CSS"],
      applicationsList: []
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
                {user.userType === 'student' ? 'My Applications' : 'Applications'}
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
                    <button 
                      onClick={() => setShowNewProjectModal(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Post Project</span>
                    </button>
                  )}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.userType === 'student' ? (
                    // Student view - available projects
                    studentProjects.map((project) => (
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
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    ))
                  ) : (
                    // Startup view - their own projects
                    startupProjects.map((project) => (
                      <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{project.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            {project.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {project.compensation}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-2" />
                            {project.applications} applications
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Posted: {new Date(project.postedDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button 
                            onClick={() => handleViewApplications(project)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Applications ({project.applications})
                          </button>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProject(project)}
                              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            {project.status === 'draft' && (
                              <button 
                                onClick={() => handlePublishProject(project.id)}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Publish
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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

      {/* Applications Modal for Startups */}
      {showApplicationsModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Screening Applications: {selectedProject.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProject.applications} total applications • 
                  {selectedProject.applicationsList.filter((app: any) => app.status === 'pending').length} pending review
                </p>
              </div>
              <button 
                onClick={() => setShowApplicationsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{selectedProject.applications}</div>
                  <div className="text-xs text-blue-700">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedProject.applicationsList.filter((app: any) => app.status === 'pending').length}
                  </div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedProject.applicationsList.filter((app: any) => app.status === 'accepted').length}
                  </div>
                  <div className="text-xs text-green-700">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedProject.applicationsList.filter((app: any) => app.status === 'rejected').length}
                  </div>
                  <div className="text-xs text-red-700">Rejected</div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select 
                  value={applicationFilter} 
                  onChange={(e) => setApplicationFilter(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select 
                  value={applicationSort} 
                  onChange={(e) => setApplicationSort(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Application Date</option>
                  <option value="name">Student Name</option>
                  <option value="university">University</option>
                </select>
              </div>

              <div className="ml-auto">
                <button
                  onClick={() => {
                    // Bulk accept all pending
                    const pendingApps = selectedProject.applicationsList.filter((app: any) => app.status === 'pending');
                    pendingApps.forEach((app: any) => {
                      handleUpdateApplicationStatus(selectedProject.id, app.id, 'accepted');
                    });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 font-medium"
                >
                  Accept All Pending
                </button>
              </div>
            </div>

            {/* Applications Grid */}
            {selectedProject.applicationsList.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No applications yet for this project.</p>
                <p className="text-gray-500 text-sm mt-2">Applications will appear here once students apply.</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject.applicationsList
                    .filter((app: any) => applicationFilter === 'all' || app.status === applicationFilter)
                    .sort((a: any, b: any) => {
                      switch (applicationSort) {
                        case 'date':
                          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
                        case 'name':
                          return a.studentName.localeCompare(b.studentName);
                        case 'university':
                          return a.university.localeCompare(b.university);
                        default:
                          return 0;
                      }
                    })
                    .map((application: any) => (
                    <div key={application.id} className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                      application.status === 'accepted' ? 'border-green-200 bg-green-50' :
                      application.status === 'rejected' ? 'border-red-200 bg-red-50' :
                      'border-gray-200 bg-white hover:border-blue-300'
                    }`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{application.studentName}</h4>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-sm font-medium text-gray-700">{application.university}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="mb-4 space-y-1">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Course:</span>
                          <span className="text-gray-600">{application.course || 'Computer Science'}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Year:</span>
                          <span className="text-gray-600">{application.year || '2nd Year'}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700 w-20">Skills:</span>
                          <span className="text-gray-600">{application.skills || 'React, Node.js, Python'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateApplicationStatus(selectedProject.id, application.id, 'accepted')}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-medium transition-colors"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(selectedProject.id, application.id, 'rejected')}
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 font-medium transition-colors"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        
                        <button 
                          onClick={() => handleViewStudentProfile(application.email, application.studentName)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium transition-colors"
                        >
                          👤 Profile
                        </button>
                        <button 
                          onClick={() => handleMessageStudent(application.email, application.studentName)}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 font-medium transition-colors"
                        >
                          💬 Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Edit Modal for Startups */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Project: {editingProject.title}
              </h3>
                              <button 
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editingProject.duration}
                    onChange={(e) => setEditingProject({...editingProject, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compensation</label>
                  <input
                    type="text"
                    value={editingProject.compensation}
                    onChange={(e) => setEditingProject({...editingProject, compensation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <input
                  type="text"
                  value={editingProject.skills.join(', ')}
                  onChange={(e) => setEditingProject({...editingProject, skills: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="e.g., Marketing, Strategy, Analytics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveProject(editingProject)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal for Startups */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Project
              </h3>
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <NewProjectForm onSubmit={handleCreateNewProject} onCancel={() => setShowNewProjectModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// New Project Form Component
const NewProjectForm: React.FC<{ onSubmit: (project: any) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    compensation: '',
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    onSubmit(newProject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="e.g., 2 weeks"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Compensation</label>
          <input
            type="text"
            value={formData.compensation}
            onChange={(e) => setFormData({...formData, compensation: e.target.value})}
            placeholder="e.g., £500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
        <input
          type="text"
          value={formData.skills}
          onChange={(e) => setFormData({...formData, skills: e.target.value})}
          placeholder="e.g., Marketing, Strategy, Analytics"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>
    </form>
  );
};

export default Dashboard; 