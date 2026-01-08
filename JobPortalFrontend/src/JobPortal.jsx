import React, { useState, useEffect } from "react";
import { Filter, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AuthModal from "./components/AuthModal";
import LogoutConfirmModal from "./components/LogoutConfirmModal";
import JobCard from "./components/JobCard";
import StatsSection from "./components/StatsSection";

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          name: userData.name,
          email: userData.email,
          userType: userData.role || userData.userType,
          initials: userData.name
            ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'U',
          token: storedToken,
          _id: userData._id,
          ...userData
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const fetchJobs = async (page = 1, search = "", location = "") => {
    try {
      setLoading(true);
      setError(null);

      // If showing saved jobs only, we hit a different endpoint and ignore search/pagination for now (or implementing client side/server side filtering for saved jobs would be better, but assuming simple list return for saved jobs from backend as implemented)
      if (showSavedOnly) {
        if (!user || !user.token) {
          console.warn('User not logged in or missing token');
          setJobs([]);
          setTotalJobs(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }

        console.log('Fetching saved jobs with token:', user.token);

        const response = await fetch(`${baseURL}/users/saved-jobs`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          // The backend returns populated savedJobs array
          let filteredJobs = data.data;
          // We can manually filter by search term here if needed since backend endpoint for saved-jobs might not support it yet
          if (search) {
            filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()));
          }
          if (location) {
            filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
          }

          setJobs(filteredJobs);
          // Pagination for saved jobs is not implemented in backend yet, so we just show all or slice them.
          // For now, let's treat it as one page.
          setTotalJobs(filteredJobs.length);
          setTotalPages(1);
        }
      } else {
        // Regular fetch
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (search) params.append("search", search);
        if (location) params.append("location", location);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${baseURL}/jobs?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
          throw new Error("Failed to fetch jobs");
        }
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);

      if (err.name === "AbortError") {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else if (err.message.includes("HTTP error")) {
        setError(`Server error: ${err.message}. Please try again later.`);
      } else if (err.message === "Failed to fetch") {
        setError(
          "Unable to reach the server. Please check if the backend is running."
        );
      } else {
        setError(
          err.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, searchTerm, locationFilter);
  }, [currentPage, showSavedOnly]); // Trigger re-feth when filter mode changes

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, searchTerm, locationFilter);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.token) return;

      console.log('Fetching initial saved jobs list with token:', user.token);

      try {
        const response = await fetch(`${baseURL}/users/saved-jobs`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          // Store only IDs for easier checking
          setSavedJobs(data.data.map(job => typeof job === 'object' ? job._id : job));
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [user?.token, baseURL]);

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const isSaved = savedJobs.includes(jobId);

    // Optimistic update
    setSavedJobs((prev) =>
      isSaved
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );

    try {
      const url = `${baseURL}/users/saved-jobs${isSaved ? `/${jobId}` : ''}`;
      const method = isSaved ? 'DELETE' : 'POST';
      const body = isSaved ? undefined : JSON.stringify({ jobId });

      console.log(`Toggling saved job. Method: ${method}, URL: ${url}, Token: ${user.token}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isSaved ? "Job removed from saved jobs" : "Job saved successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error(data.message || "Failed to update saved job");
      }
    } catch (error) {
      console.error("Error toggling saved job:", error);
      toast.error(error.message || "Failed to save job");
      // Revert optimistic update
      setSavedJobs((prev) =>
        isSaved
          ? [...prev, jobId]
          : prev.filter((id) => id !== jobId)
      );
    }
  };

  const handleRetry = () => {
    fetchJobs(currentPage, searchTerm, locationFilter);
  };


  const handleLogin = (userData) => {
    setUser({
      name: userData.name,
      email: userData.email,
      userType: userData.userType || userData.role,
      initials: userData.initials || userData.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U',
      token: userData.token,
      _id: userData._id,
      ...userData
    });
    setShowAuthModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');



    setUser(null);
    setSavedJobs([]);
    setShowLogoutConfirm(false);
    window.location.href = '/';
    toast.success('Logged out successfully', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleApplyJob = (job) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    alert(`Applying for: ${job.title} at ${job.company}`);
  };

  const handleHomeClick = () => {
    setCurrentPage(1);
    setSearchTerm("");
    setLocationFilter("");
    setShowSavedOnly(false);
    fetchJobs(1);
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
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />

      <Navbar
        user={user}
        onLogout={handleLogoutClick}
        onLoginClick={() => setShowAuthModal(true)}
        onHomeClick={handleHomeClick}
      />


      <HeroSection
        searchTerm={searchTerm}
        locationFilter={locationFilter}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onLocationChange={(e) => setLocationFilter(e.target.value)}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />


      <StatsSection
        totalJobs={totalJobs}
        uniqueCompanies={new Set(jobs.map((j) => j.company)).size}
        savedJobs={savedJobs.length}
      />


      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Latest Opportunities
            </h2>
            <p className="text-slate-600 mt-2">
              Showing {jobs.length} of {totalJobs} jobs
              {searchTerm && ` for "${searchTerm}"`}
              {locationFilter && ` in "${locationFilter}"`}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors border border-slate-300 px-4 py-2 rounded-lg hover:border-blue-600">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
            </button> */}

            {user && (
              <button
                onClick={() => {
                  // This is a simple toggle filter, strict logic would need more state management
                  // For now, let's just toggle a local 'showSavedOnly' state if I had added it.
                  // Since I didn't add it in the previous step, I will add the state in the next step or just notify user.
                  // Actually, I'll add the state variable in the next tool call.
                  setShowSavedOnly(!showSavedOnly);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-2 transition-colors border px-4 py-2 rounded-lg ${showSavedOnly ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-slate-700 border-slate-300 hover:border-blue-600 hover:text-blue-600'}`}
              >
                <span className="font-medium">Saved Jobs</span>
              </button>
            )
            }

            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>


        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 text-lg">
              Loading amazing opportunities...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg">
              Try Again
            </button>
          </div>
        )}


        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedJobs.includes(job._id)}
                  onSaveClick={toggleSaveJob}
                  onApplyClick={handleApplyJob}
                  showAuthModal={() => setShowAuthModal(true)}
                  user={user}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 space-y-4 sm:space-y-0">
                <div className="text-sm text-slate-600">
                  Showing page {currentPage} of {totalPages} • {totalJobs} total
                  jobs
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center">
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPaginationNumbers().map((pageNum, idx) =>
                      pageNum === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-2 text-slate-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-lg font-medium transition-all ${currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}>
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="text-sm text-slate-600">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1 bg-white">
                    {[...Array(totalPages)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Page {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {jobs.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || locationFilter
                    ? `No results for "${searchTerm}"${locationFilter ? ` in "${locationFilter}"` : ""
                    }`
                    : "No jobs available at the moment."}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    fetchJobs(1);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
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