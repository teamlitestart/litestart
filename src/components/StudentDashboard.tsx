import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Briefcase, 
  FileText, 
  User, 
  LogOut, 
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import JobApplicationForm from './JobApplicationForm';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  benefits: string[];
  pay: string;
  workStyle: string;
  timeCommitment: string;
  timeline: string;
  location: string;
  postedDate: string;
  applications: number;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cv: string;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  universityEmail: string;
  university: string;
  graduationYear: string;
  skills: string[];
  portfolio?: string;
  bio: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: 'John',
    lastName: 'Doe',
    universityEmail: 'john.doe@university.edu',
    university: 'University of Technology',
    graduationYear: '2025',
    skills: ['JavaScript', 'React', 'Python', 'Data Analysis'],
    portfolio: 'https://portfolio.com',
    bio: 'Passionate student looking for internship opportunities in tech and business.'
  });

  // Mock data
  useEffect(() => {
    setJobs([
      {
        id: '1',
        title: 'Frontend Developer Intern',
        company: 'TechStart Inc.',
        description: 'Join our team to build amazing web applications using React and modern JavaScript.',
        benefits: ['Remote work', 'Mentorship', 'Career growth'],
        pay: '$25/hour',
        workStyle: 'Hybrid',
        timeCommitment: '20 hours/week',
        timeline: '3 months',
        location: 'San Francisco, CA',
        postedDate: '2024-01-15',
        applications: 45
      },
      {
        id: '2',
        title: 'Data Science Intern',
        company: 'Analytics Corp',
        description: 'Work with big data and machine learning models to solve real-world problems.',
        benefits: ['Flexible hours', 'Learning budget', 'Team events'],
        pay: '$30/hour',
        workStyle: 'Remote',
        timeCommitment: '15 hours/week',
        timeline: '6 months',
        location: 'Remote',
        postedDate: '2024-01-10',
        applications: 32
      }
    ]);

    setApplications([
      {
        id: '1',
        jobTitle: 'Marketing Intern',
        company: 'Growth Co.',
        appliedDate: '2024-01-12',
        status: 'pending',
        cv: 'john_doe_cv.pdf'
      },
      {
        id: '2',
        jobTitle: 'Software Engineer Intern',
        company: 'Tech Solutions',
        appliedDate: '2024-01-08',
        status: 'reviewed',
        cv: 'john_doe_cv.pdf'
      }
    ]);
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (applicationData: any) => {
    if (selectedJob) {
      const newApplication: Application = {
        id: Date.now().toString(),
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        cv: applicationData.cv?.name || 'cv.pdf',
        coverLetter: applicationData.coverLetter
      };
      setApplications(prev => [newApplication, ...prev]);
      alert('Application submitted successfully!');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Ready to find your next internship?</h2>
        <p className="text-blue-100 mb-6">
          Browse through exciting opportunities from innovative startups. Apply with your CV and stand out from the crowd.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Browse Jobs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Applications Sent</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-green-600 text-sm">+2 this week</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Jobs Viewed</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-green-600 text-sm">+8 this week</p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-green-600 text-sm">+1 this week</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
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
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-blue-600 font-medium">{job.company}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{job.pay}</p>
                <p className="text-sm text-gray-500">{job.applications} applications</p>
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

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
              <button 
                onClick={() => handleApplyToJob(job)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h3>
        
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{app.jobTitle}</h4>
                  <p className="text-blue-600">{app.company}</p>
                  <p className="text-sm text-gray-500">Applied: {app.appliedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(app.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>CV: {app.cv}</span>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University Email</label>
            <input
              type="email"
              value={profile.universityEmail}
              onChange={(e) => setProfile({...profile, universityEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
            <input
              type="text"
              value={profile.university}
              onChange={(e) => setProfile({...profile, university: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <input
              type="text"
              value={profile.graduationYear}
              onChange={(e) => setProfile({...profile, graduationYear: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL (Optional)</label>
            <input
              type="url"
              value={profile.portfolio || ''}
              onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
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
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Eye className="w-5 h-5" />
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
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
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>

      {/* Job Application Form Modal */}
      {selectedJob && (
        <JobApplicationForm
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleSubmitApplication}
          job={selectedJob}
        />
      )}
    </div>
  );
};

export default StudentDashboard; 