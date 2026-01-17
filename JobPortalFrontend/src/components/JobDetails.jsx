import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Clock,
    Building2,
    Bookmark,
    ArrowLeft,
    IndianRupee,
    Calendar,
    Users,
    Briefcase,
    CheckCircle,
    AlertCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return {
                    ...userData,
                    token: storedToken // Ensure token is always set from localStorage
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
        fetchJobDetails();
        if (user?.token) {
            checkIfSaved();
        }
    }, [id, user?.token]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${baseURL}/jobs/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Job not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setJob(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch job details');
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            setError(err.message || 'Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = async () => {
        try {
            const response = await fetch(`${baseURL}/users/saved-jobs`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const savedJobIds = data.data.map(job => typeof job === 'object' ? job._id : job);
                setIsSaved(savedJobIds.includes(id));
            }
        } catch (error) {
            console.error('Error checking saved status:', error);
        }
    };

    const toggleSaveJob = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        console.log('Saving job with user:', user);
        console.log('Token being sent:', user.token);

        const wasSaved = isSaved;
        setIsSaved(!isSaved);

        try {
            const url = `${baseURL}/users/saved-jobs${wasSaved ? `/${id}` : ''}`;
            const method = wasSaved ? 'DELETE' : 'POST';
            const body = wasSaved ? undefined : JSON.stringify({ jobId: id });

            console.log('Request URL:', url);
            console.log('Request Method:', method);
            console.log('Authorization Header:', `Bearer ${user.token}`);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body
            });

            const data = await response.json();
            console.log('Response:', data);

            if (data.success) {
                toast.success(wasSaved ? 'Job removed from saved jobs' : 'Job saved successfully', {
                    position: 'top-right',
                    autoClose: 2000,
                });
            } else {
                throw new Error(data.message || 'Failed to update saved job');
            }
        } catch (error) {
            console.error('Error toggling saved job:', error);
            toast.error(error.message || 'Failed to save job', {
                position: 'top-right',
                autoClose: 3000,
            });
            setIsSaved(wasSaved);
        }
    };

    const handleApply = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        toast.success('Application submitted successfully!', {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (company) => {
        return company
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
                    <p className="text-slate-600 text-lg">Loading job details...</p>
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
                        <h3 className="text-2xl font-bold text-red-800 mb-2">Error Loading Job</h3>
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

    if (!job) return null;

    return (
        <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => setShowAuthModal(true)}
                onHomeClick={() => navigate('/')}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Jobs</span>
                </button>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-6 flex-1">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl w-20 h-20 flex items-center justify-center text-2xl font-bold">
                                    {getInitials(job.company)}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                                    <div className="flex items-center space-x-2 text-blue-100 text-lg mb-4">
                                        <Building2 className="h-5 w-5" />
                                        <span className="font-medium">{job.company}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{job.jobType || 'Full-time'}</span>
                                        </div>
                                        {job.experience && (
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="h-4 w-4" />
                                                <span>{job.experience}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleSaveJob}
                                className="ml-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-lg transition-all"
                            >
                                <Bookmark
                                    className={`h-6 w-6 ${isSaved ? 'fill-white text-white' : 'text-white'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Job Details Section */}
                    <div className="p-8">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {job.salary && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <IndianRupee className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600 font-medium">Salary</p>
                                            <p className="text-lg font-bold text-green-800">{job.salary}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-medium">Posted</p>
                                        <p className="text-sm font-bold text-blue-800">{formatDate(job.dateFetched || job.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {job.applicants !== undefined && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Users className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-purple-600 font-medium">Applicants</p>
                                            <p className="text-lg font-bold text-purple-800">{job.applicants || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Job Description</h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-3">
                                    {job.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Requirements</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-600">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Responsibilities */}
                        {job.responsibilities && job.responsibilities.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Responsibilities</h2>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((resp, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-600">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Apply Section */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 mt-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">Ready to Apply?</h3>
                                    <p className="text-slate-600 text-sm">Join our team and make an impact</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={toggleSaveJob}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all border-2 ${isSaved
                                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        {isSaved ? 'Saved' : 'Save Job'}
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                    >
                                        <span>Apply Now</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Jobs Section (Optional - can be implemented later) */}
                {/* <div className="mt-8 text-center text-slate-500 text-sm">
                    <p>Job ID: {job._id}</p>
                </div> */}
            </div>
        </div>
    );
};

export default JobDetails;
