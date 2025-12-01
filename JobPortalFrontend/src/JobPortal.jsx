import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Bookmark, 
  MapPin, 
  Clock, 
  Building2, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  Loader2,
  User,
  LogIn
} from 'lucide-react';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [user, setUser] = useState(null); // Add user state
  const [showAuthModal, setShowAuthModal] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';
  
  const fetchJobs = async (page = 1, search = '', location = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pages);
        setTotalJobs(data.total);
        setCurrentPage(data.page);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.message.includes('HTTP error')) {
        setError(`Server error: ${err.message}. Please try again later.`);
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to reach the server. Please check if the backend is running.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, searchTerm, locationFilter);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, searchTerm, locationFilter);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSaveJob = (jobId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleRetry = () => {
    fetchJobs(currentPage, searchTerm, locationFilter);
  };

  const handleLogin = (name, email) => {
    // In a real app, this would be an API call
    setUser({
      name: name,
      email: email,
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredJobs = jobs;

  const getInitials = (company) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Login or Register
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleLogin('John Doe', 'john@example.com')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Login as Demo User
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                setCurrentPage(1);
                setSearchTerm('');
                setLocationFilter('');
                fetchJobs(1);
              }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile/Login Button */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.initials}
                    </div>
                    <span className="font-medium text-slate-700 hidden md:inline">
                      {user.name}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => alert('Saved Jobs: Coming Soon!')}
                      className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Saved Jobs</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <User className="h-5 w-5" />
                  <span>Login/Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100">
              Discover opportunities from top companies around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl md:w-64">
                <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalJobs}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium">Companies</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{new Set(jobs.map(j => j.company)).size}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium">Saved Jobs</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{savedJobs.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Bookmark className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Latest Opportunities</h2>
            <p className="text-slate-600 mt-2">
              Showing {filteredJobs.length} of {totalJobs} jobs
              {searchTerm && ` for "${searchTerm}"`}
              {locationFilter && ` in "${locationFilter}"`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors border border-slate-300 px-4 py-2 rounded-lg hover:border-blue-600">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
            </button>
            
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 text-lg">Loading amazing opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 overflow-hidden group cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-sm font-bold bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg group-hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center text-blue-700">
                          {getInitials(job.company)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-slate-600 font-medium text-sm">{job.company}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                        className="ml-2"
                      >
                        <Bookmark
                          className={`h-5 w-5 transition-all ${
                            savedJobs.includes(job._id)
                              ? 'fill-blue-600 text-blue-600'
                              : 'text-slate-400 hover:text-blue-600'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-slate-600 mb-4 text-sm line-clamp-3">
                      {job.description?.substring(0, 120)}...
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.jobType || 'Full-time'}</span>
                      </div>
                      {job.experience && (
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>{job.experience}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-500">{formatDate(job.dateFetched)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            setShowAuthModal(true);
                            return;
                          }
                          alert(`Applying for: ${job.title} at ${job.company}`);
                        }}
                        className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm group-hover:shadow-lg"
                      >
                        <span>Apply</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 space-y-4 sm:space-y-0">
                <div className="text-sm text-slate-600">
                  Showing page {currentPage} of {totalPages} • {totalJobs} total jobs
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {getPaginationNumbers().map((pageNum, idx) => (
                      pageNum === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 text-slate-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="text-sm text-slate-600">
                  <select 
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1 bg-white"
                  >
                    {[...Array(totalPages)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Page {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {filteredJobs.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No jobs found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || locationFilter 
                    ? `No results for "${searchTerm}"${locationFilter ? ` in "${locationFilter}"` : ''}`
                    : 'No jobs available at the moment.'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                    fetchJobs(1);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobPortal;