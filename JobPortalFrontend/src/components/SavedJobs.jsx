import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import JobCard from './JobCard';

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return {
                    ...userData,
                    token: storedToken
                };
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    });
    const [showAuthModal, setShowAuthModal] = useState(false);

    const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/');
            return;
        }
        fetchSavedJobs();
    }, [user]);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            setError(null);

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
                setSavedJobs(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch saved jobs');
            }
        } catch (err) {
            console.error('Error fetching saved jobs:', err);
            setError(err.message || 'Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const toggleSaveJob = async (jobId) => {
        // Optimistic update
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));

        try {
            const response = await fetch(`${baseURL}/users/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Job removed from saved jobs', {
                    position: 'top-right',
                    autoClose: 2000,
                });
            } else {
                throw new Error(data.message || 'Failed to remove saved job');
            }
        } catch (error) {
            console.error('Error removing saved job:', error);
            toast.error(error.message || 'Failed to remove job');
            // Revert on error
            fetchSavedJobs();
        }
    };

    const handleApplyJob = (job) => {
        toast.success(`Applying for: ${job.title} at ${job.company}`, {
            position: 'top-right',
            autoClose: 3000,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Navbar
                    user={user}
                    onLogout={handleLogout}
                    onLoginClick={() => setShowAuthModal(true)}
                    onHomeClick={() => navigate('/')}
                />
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
                    <p className="text-slate-600 text-lg">Loading your saved jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Navbar
                    user={user}
                    onLogout={handleLogout}
                    onLoginClick={() => setShowAuthModal(true)}
                    onHomeClick={() => navigate('/')}
                />
                <div className="max-w-4xl mx-auto px-4 py-20">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-800 mb-2">Error Loading Saved Jobs</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
                onHomeClick={() => navigate('/')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to All Jobs</span>
                    </button>

                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                            <Bookmark className="h-8 w-8 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Saved Jobs</h1>
                            <p className="text-slate-600 mt-1">
                                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {savedJobs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 max-w-2xl mx-auto">
                            <Bookmark className="h-24 w-24 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Saved Jobs Yet</h3>
                            <p className="text-slate-600 mb-6">
                                Start exploring jobs and save the ones you're interested in for easy access later.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    </div>
                )}

                {/* Jobs Grid */}
                {savedJobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isSaved={true}
                                onSaveClick={toggleSaveJob}
                                onApplyClick={handleApplyJob}
                                showAuthModal={() => setShowAuthModal(true)}
                                user={user}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
