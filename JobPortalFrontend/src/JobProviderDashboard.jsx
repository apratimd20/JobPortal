import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  Search,
  Filter,
  MoreVertical,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  FileText,
  Settings,
  Upload,
  Download,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';

const JobProviderDashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    viewsThisMonth: 0
  });

  const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.name || user?.companyName || '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    experience: '',
    skills: '',
    applicationDeadline: '',
    contactEmail: user?.email || '',
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      fetchProviderJobs();
      fetchProviderStats();
    }
  }, [user]);

  const fetchProviderJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/jobs/provider/my-jobs`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setJobs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderStats = async () => {
    try {
      const response = await fetch(`${baseURL}/jobs/provider/stats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data || stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    try {
      const jobData = {
        ...jobForm,
        company: user?.companyName || user?.name || jobForm.company,
        postedBy: user._id,
        requirements: jobForm.requirements.split('\n').filter(r => r.trim()),
        responsibilities: jobForm.responsibilities.split('\n').filter(r => r.trim()),
        benefits: jobForm.benefits.split('\n').filter(b => b.trim()),
        skills: jobForm.skills.split(',').map(s => s.trim()).filter(s => s),
        jobType: jobForm.type, // Map type to jobType for backend
      };
      // Remove type from jobData as backend expects jobType
      delete jobData.type;

      const url = selectedJob
        ? `${baseURL}/jobs/${selectedJob._id}`
        : `${baseURL}/jobs`;

      const method = selectedJob ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(selectedJob ? 'Job updated successfully!' : 'Job posted successfully!');
        setShowJobModal(false);
        resetJobForm();
        fetchProviderJobs();
        fetchProviderStats();
      } else {
        throw new Error(data.message || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.message || 'Failed to save job');
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities,
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits,
      experience: job.experience || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills,
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
      contactEmail: job.contactEmail || user?.email || '',
      status: job.status || 'active'
    });
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      const response = await fetch(`${baseURL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Job deleted successfully');
        fetchProviderJobs();
        fetchProviderStats();
      } else {
        throw new Error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.message || 'Failed to delete job');
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';

    try {
      const response = await fetch(`${baseURL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully`);
        fetchProviderJobs();
        fetchProviderStats();
      } else {
        throw new Error(data.message || 'Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error(error.message || 'Failed to update job status');
    }
  };

  const resetJobForm = () => {
    setSelectedJob(null);
    setJobForm({
      title: '',
      company: user?.name || user?.companyName || '',
      location: '',
      type: 'Full-Time',
      salary: '',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      experience: '',
      skills: '',
      applicationDeadline: '',
      contactEmail: user?.email || '',
      status: 'active'
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
          {change && (
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-4 w-4 ${color}`} />
              <span className={`text-sm font-medium ${color}`}>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'text-green-600' ? 'from-green-50 to-emerald-50' : color === 'text-blue-600' ? 'from-blue-50 to-indigo-50' : color === 'text-purple-600' ? 'from-purple-50 to-pink-50' : 'from-orange-50 to-amber-50'}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
              <div>
                {/* <h1 className="text-xl font-bold text-slate-900">Provider Dashboard</h1> */}
                {/* <p className="text-xs text-slate-600">{user?.companyName || user?.name}</p> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  resetJobForm();
                  setShowJobModal(true);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Post New Job</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                  <Building2 className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{user?.companyName || user?.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'jobs', label: 'My Jobs', icon: Briefcase },
              { id: 'applicants', label: 'Applicants', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Briefcase}
                title="Total Jobs"
                value={stats.totalJobs || jobs.length}
                change="+12% this month"
                color="text-blue-600"
              />
              <StatCard
                icon={CheckCircle}
                title="Active Jobs"
                value={stats.activeJobs || jobs.filter(j => j.status === 'active').length}
                change="+8% this month"
                color="text-green-600"
              />
              <StatCard
                icon={Users}
                title="Total Applicants"
                value={stats.totalApplicants || 0}
                change="+23% this month"
                color="text-purple-600"
              />
              <StatCard
                icon={Eye}
                title="Views This Month"
                value={stats.viewsThisMonth || 0}
                change="+15% vs last month"
                color="text-orange-600"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job, index) => (
                  <div key={job._id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-600">{job.location} • {job.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                        {job.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs by title or location..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>

                  <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">More Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start by posting your first job'}
                </p>
                <button
                  onClick={() => {
                    resetJobForm();
                    setShowJobModal(true);
                  }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post Your First Job</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map(job => (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.type}</span>
                              </span>
                              {job.salary && (
                                <span className="flex items-center space-x-1">
                                  <IndianRupee className="h-4 w-4" />
                                  <span>{job.salary}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'closed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                            }`}>
                            {job.status}
                          </span>
                        </div>

                        <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1 text-slate-600">
                              <Users className="h-4 w-4" />
                              <span>{job.applicants?.length || 0} applicants</span>
                            </div>
                            <div className="flex items-center space-x-1 text-slate-600">
                              <Eye className="h-4 w-4" />
                              <span>{job.views || 0} views</span>
                            </div>
                            <div className="flex items-center space-x-1 text-slate-600">
                              <Calendar className="h-4 w-4" />
                              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleJobStatus(job._id, job.status)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${job.status === 'active'
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                              {job.status === 'active' ? 'Close' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleEditJob(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Applicants Management</h3>
            <p className="text-slate-600 mb-6">
              View and manage all job applicants in one place. This feature will show applicant profiles, resumes, and application status.
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Company Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={user?.companyName || user?.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={user?.contactPerson || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={user?.phone || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Size</label>
                  <input
                    type="text"
                    value={user?.companySize || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={user?.industry || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={user?.website || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Job Creation/Edit Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedJob ? 'Edit Job Posting' : 'Post New Job'}
              </h2>
              <button
                onClick={() => {
                  setShowJobModal(false);
                  resetJobForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. New York, NY (Remote)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Type *</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. ₹80,000 - ₹1,20,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 3-5 years"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    placeholder="Describe the role and what makes it exciting..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Requirements (one per line)</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience with React&#10;Strong problem-solving skills"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Responsibilities (one per line)</label>
                  <textarea
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    placeholder="Lead frontend development team&#10;Design and implement new features&#10;Collaborate with product managers"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Benefits (one per line)</label>
                  <textarea
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                    placeholder="Health insurance&#10;401(k) matching&#10;Flexible work hours&#10;Professional development budget"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="React, Node.js, TypeScript, AWS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={jobForm.applicationDeadline}
                    onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={jobForm.contactEmail}
                      onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jobs@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowJobModal(false);
                    resetJobForm();
                  }}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  {selectedJob ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProviderDashboard;