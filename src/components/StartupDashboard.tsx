import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Briefcase, 
  FileText, 
  User, 
  LogOut, 
  Plus,
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Users,
  Building
} from 'lucide-react';
import JobPostingForm from './JobPostingForm';
import { useAuth } from '../contexts/AuthContext';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  pay: string;
  workStyle: string;
  timeCommitment: string;
  timeline: string;
  location: string;
  postedDate: string;
  applications: number;
  status: 'active' | 'paused' | 'closed';
}

interface Application {
  id: string;
  jobTitle: string;
  studentName: string;
  studentEmail: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cv: string;
  coverLetter: string;
}

interface StartupProfile {
  companyName: string;
  contactName: string;
  professionalEmail: string;
  industry: string;
  customIndustry?: string;
  foundedYear: string;
  linkedIn?: string;
  logo?: File | null;
  description: string;
}

const StartupDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);

  const handleCreateJob = (jobData: any) => {
    const newJob: JobPosting = {
      id: Date.now().toString(),
      title: jobData.title,
      description: jobData.description,
      benefits: jobData.benefits,
      pay: jobData.pay,
      workStyle: jobData.workStyle,
      timeCommitment: jobData.timeCommitment,
      timeline: jobData.timeline,
      location: jobData.location,
      postedDate: new Date().toISOString().split('T')[0],
      applications: 0,
      status: 'active'
    };
    setJobPostings(prev => [newJob, ...prev]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [profile, setProfile] = useState<StartupProfile>({
    companyName: 'TechStart Inc.',
    contactName: 'John Smith',
    professionalEmail: 'john@techstart.com',
    industry: 'Technology',
    foundedYear: '2020',
    linkedIn: 'https://linkedin.com/company/techstart',
    description: 'Innovative startup focused on building cutting-edge technology solutions.'
  });

  // Mock data
  useEffect(() => {
    setJobPostings([
      {
        id: '1',
        title: 'Frontend Developer Intern',
        description: 'Join our team to build amazing web applications using React and modern JavaScript.',
        benefits: ['Remote work', 'Mentorship', 'Career growth'],
        pay: '$25/hour',
        workStyle: 'Hybrid',
        timeCommitment: '20 hours/week',
        timeline: '3 months',
        location: 'San Francisco, CA',
        postedDate: '2024-01-15',
        applications: 45,
        status: 'active'
      },
      {
        id: '2',
        title: 'Data Science Intern',
        description: 'Work with big data and machine learning models to solve real-world problems.',
        benefits: ['Flexible hours', 'Learning budget', 'Team events'],
        pay: '$30/hour',
        workStyle: 'Remote',
        timeCommitment: '15 hours/week',
        timeline: '6 months',
        location: 'Remote',
        postedDate: '2024-01-10',
        applications: 32,
        status: 'active'
      }
    ]);

    setApplications([
      {
        id: '1',
        jobTitle: 'Frontend Developer Intern',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah.johnson@university.edu',
        appliedDate: '2024-01-16',
        status: 'pending',
        cv: 'sarah_johnson_cv.pdf',
        coverLetter: 'I am excited to apply for the Frontend Developer Intern position...'
      },
      {
        id: '2',
        jobTitle: 'Data Science Intern',
        studentName: 'Mike Chen',
        studentEmail: 'mike.chen@university.edu',
        appliedDate: '2024-01-14',
        status: 'reviewed',
        cv: 'mike_chen_cv.pdf',
        coverLetter: 'With my background in statistics and programming...'
      }
    ]);
  }, []);

  const filteredJobPostings = jobPostings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Ready to post a new job?</h2>
        <p className="text-blue-100 mb-6">
          Find talented interns to help grow your startup. Post detailed job descriptions and attract the best candidates.
        </p>
        <button 
          onClick={() => setShowJobForm(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Post Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Job Postings</p>
              <p className="text-2xl font-bold text-gray-900">{jobPostings.filter(job => job.status === 'active').length}</p>
              <p className="text-green-600 text-sm">+1 this week</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-green-600 text-sm">+12 this week</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hires Made</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-green-600 text-sm">+2 this month</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobPostings = () => (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
        <button 
          onClick={() => setShowJobForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search job titles or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Jobs</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Job Postings List */}
      <div className="space-y-4">
        {filteredJobPostings.map(job => (
          <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">{job.applications} applications</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{job.pay}</p>
                <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{job.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{job.timeCommitment}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{job.timeline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{job.workStyle}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Applications
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Applications Received</h3>
        
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{app.jobTitle}</h4>
                  <p className="text-blue-600">{app.studentName}</p>
                  <p className="text-sm text-gray-500">{app.studentEmail}</p>
                  <p className="text-sm text-gray-500">Applied: {app.appliedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(app.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>CV: {app.cv}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Cover Letter:</p>
                  <p className="mt-1">{app.coverLetter.substring(0, 150)}...</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Accept
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Reject
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Full Application
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Profile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({...profile, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              value={profile.contactName}
              onChange={(e) => setProfile({...profile, contactName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Email</label>
            <input
              type="email"
              value={profile.professionalEmail}
              onChange={(e) => setProfile({...profile, professionalEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              value={profile.industry}
              onChange={(e) => setProfile({...profile, industry: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
            <input
              type="number"
              value={profile.foundedYear}
              onChange={(e) => setProfile({...profile, foundedYear: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL (Optional)</label>
            <input
              type="url"
              value={profile.linkedIn || ''}
              onChange={(e) => setProfile({...profile, linkedIn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
          <textarea
            value={profile.description}
            onChange={(e) => setProfile({...profile, description: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click to upload company logo</p>
            <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, SVG</p>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">LiteStart</h1>
        </div>
        
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('jobPostings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'jobPostings' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Job Postings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Applications
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Building className="w-5 h-5" />
              Company Profile
            </button>
          </div>
        </nav>
        
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'jobPostings' && renderJobPostings()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>

      {/* Job Posting Form Modal */}
      <JobPostingForm
        isOpen={showJobForm}
        onClose={() => setShowJobForm(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

export default StartupDashboard; 