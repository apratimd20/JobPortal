import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Briefcase,
    MapPin,
    Phone,
    Calendar,
    Edit2,
    Upload,
    FileText,
    Award,
    X,
    Save,
    Loader2,
    ArrowLeft,
    Github,
    Linkedin,
    Globe,
    Plus,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const Profile = () => {
    const navigate = useNavigate();
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

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState(false);
    const [editForm, setEditForm] = useState({});

    const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseURL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setProfileData(data.data);
                setEditForm(data.data);
            } else {
                throw new Error(data.message || 'Failed to load profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/');
    };

    const openEditModal = () => {
        setEditForm(profileData);
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        try {
            const response = await fetch(`${baseURL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();
            if (data.success) {
                setProfileData(data.data);

                // Update localStorage user data
                const updatedUser = {
                    ...user,
                    name: data.data.name,
                    email: data.data.email
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                setShowEditModal(false);
                toast.success('Profile updated successfully!');
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const addSkill = (skill) => {
        if (skill && !editForm.skills?.includes(skill)) {
            setEditForm({
                ...editForm,
                skills: [...(editForm.skills || []), skill]
            });
        }
    };

    const removeSkill = (skillToRemove) => {
        setEditForm({
            ...editForm,
            skills: editForm.skills?.filter(skill => skill !== skillToRemove) || []
        });
    };

    const addExperience = () => {
        setEditForm({
            ...editForm,
            experience: [...(editForm.experience || []), {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        });
    };

    const removeExperience = (index) => {
        const newExperience = editForm.experience?.filter((_, i) => i !== index) || [];
        setEditForm({ ...editForm, experience: newExperience });
    };

    const updateExperience = (index, field, value) => {
        const newExperience = [...(editForm.experience || [])];
        newExperience[index][field] = value;
        setEditForm({ ...editForm, experience: newExperience });
    };

    const addEducation = () => {
        setEditForm({
            ...editForm,
            education: [...(editForm.education || []), {
                institution: '',
                degree: '',
                field: '',
                startYear: '',
                endYear: '',
                current: false
            }]
        });
    };

    const removeEducation = (index) => {
        const newEducation = editForm.education?.filter((_, i) => i !== index) || [];
        setEditForm({ ...editForm, education: newEducation });
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...(editForm.education || [])];
        newEducation[index][field] = value;
        setEditForm({ ...editForm, education: newEducation });
    };

    const handleDeleteAvatarClick = () => {
        setShowDeleteAvatarConfirm(true);
    };

    const confirmDeleteAvatar = async () => {
        try {
            const response = await fetch(`${baseURL}/users/avatar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setProfileData({ ...profileData, avatarUrl: '' });

                // Update localStorage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...storedUser, avatarUrl: '' };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update user state to reflect changes in Navbar immediately
                setUser(prev => ({ ...prev, avatarUrl: '' }));

                toast.success('Avatar deleted successfully!');
                setShowDeleteAvatarConfirm(false);
            } else {
                toast.error(data.message || 'Delete failed');
            }
        } catch (error) {
            toast.error('Failed to delete avatar');
        }
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!profileData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => { }}
                onHomeClick={() => navigate('/')}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => {
                        const role = localStorage.getItem('role');
                        if (role === 'jobseeker') {
                            navigate('/dashboard/seeker');
                        } else if (role === 'jobprovider') {
                            navigate('/dashboard/provider');
                        } else {
                            navigate('/');
                        }
                    }}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-4xl font-bold text-blue-600 mb-4 sm:mb-0">
                                    {profileData.avatarUrl ? (
                                        <img
                                            src={profileData.avatarUrl.startsWith('http') ? profileData.avatarUrl : `http://localhost:5000${profileData.avatarUrl}`}
                                            alt={profileData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        profileData.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
                                    )}
                                </div>
                                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                    <Upload className="h-4 w-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('avatar', file);
                                                try {
                                                    const response = await fetch(`${baseURL}/users/upload-avatar`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${user.token}`,
                                                        },
                                                        body: formData
                                                    });
                                                    const data = await response.json();
                                                    if (data.success) {
                                                        setProfileData({ ...profileData, avatarUrl: data.data.avatarUrl });

                                                        // Update localStorage
                                                        const storedUser = JSON.parse(localStorage.getItem('user'));
                                                        const updatedUser = { ...storedUser, avatarUrl: data.data.avatarUrl };
                                                        localStorage.setItem('user', JSON.stringify(updatedUser));

                                                        // Update user state
                                                        setUser(prev => ({ ...prev, avatarUrl: data.data.avatarUrl }));

                                                        toast.success('Avatar uploaded successfully!');
                                                    } else {
                                                        toast.error(data.message || 'Upload failed');
                                                    }
                                                } catch (error) {
                                                    toast.error('Failed to upload avatar');
                                                }
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>
                                {profileData.avatarUrl && (
                                    <button
                                        onClick={handleDeleteAvatarClick}
                                        className="absolute bottom-2 left-2 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors shadow-lg z-10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="sm:ml-6 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800">{profileData.name}</h1>
                                        <p className="text-slate-600 mt-1">{profileData.email}</p>
                                        <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                            {profileData.role === 'jobseeker' ? 'Job Seeker' : 'Job Provider'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={openEditModal}
                                        className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {profileData.phone && (
                                <div className="flex items-center space-x-3 text-slate-600">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <span>{profileData.phone}</span>
                                </div>
                            )}
                            {profileData.location && (
                                <div className="flex items-center space-x-3 text-slate-600">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <span>{profileData.location}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-3 text-slate-600">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        {profileData.bio && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">About</h2>
                                <p className="text-slate-600 leading-relaxed">{profileData.bio}</p>
                            </div>
                        )}

                        {/* Experience Section */}
                        {profileData.experience && profileData.experience.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Experience</h2>
                                <div className="space-y-4">
                                    {profileData.experience.map((exp, idx) => (
                                        <div key={idx} className="border-l-4 border-blue-600 pl-4">
                                            <h3 className="font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-blue-600 font-medium">{exp.company}</p>
                                            <p className="text-sm text-slate-500">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </p>
                                            {exp.description && <p className="text-slate-600 mt-2">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Section */}
                        {profileData.education && profileData.education.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Education</h2>
                                <div className="space-y-4">
                                    {profileData.education.map((edu, idx) => (
                                        <div key={idx} className="border-l-4 border-indigo-600 pl-4">
                                            <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                            <p className="text-indigo-600 font-medium">{edu.institution}</p>
                                            <p className="text-sm text-slate-500">
                                                {edu.field} • {edu.startYear} - {edu.endYear}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Skills Section */}
                        {profileData.skills && profileData.skills.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links Section */}
                        {(profileData.resume || profileData.linkedin || profileData.github || profileData.portfolio) && (
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Links</h2>
                                <div className="space-y-3">
                                    {profileData.resume && (
                                        <a
                                            href={profileData.resume.startsWith('http') ? profileData.resume : `http://localhost:5000${profileData.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <FileText className="h-5 w-5 text-slate-600" />
                                            <span className="text-sm text-slate-700 font-medium">Resume/CV</span>
                                        </a>
                                    )}
                                    {profileData.linkedin && (
                                        <a
                                            href={profileData.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Linkedin className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm text-blue-700 font-medium">LinkedIn</span>
                                        </a>
                                    )}
                                    {profileData.github && (
                                        <a
                                            href={profileData.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <Github className="h-5 w-5 text-white" />
                                            <span className="text-sm text-white font-medium">GitHub</span>
                                        </a>
                                    )}
                                    {profileData.portfolio && (
                                        <a
                                            href={profileData.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                        >
                                            <Globe className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm text-purple-700 font-medium">Portfolio</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal - Simplified version */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name || ''}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone || ''}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                    <textarea
                                        value={editForm.bio || ''}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                        maxLength={500}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={editForm.skills?.join(', ') || ''}
                                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="JavaScript, React, Node.js"
                                />
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Resume Upload</label>
                                    <div className="flex items-center space-x-3">
                                        <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                            <Upload className="h-4 w-4" />
                                            <span>Choose File</span>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('resume', file);
                                                        try {
                                                            const response = await fetch(`${baseURL}/users/upload-resume`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Authorization': `Bearer ${user.token}`,
                                                                },
                                                                body: formData
                                                            });
                                                            const data = await response.json();
                                                            if (data.success) {
                                                                setEditForm({ ...editForm, resume: data.data.resume });
                                                                toast.success('Resume uploaded successfully!');
                                                            } else {
                                                                toast.error(data.message || 'Upload failed');
                                                            }
                                                        } catch (error) {
                                                            toast.error('Failed to upload resume');
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        {editForm.resume && (
                                            <span className="text-sm text-green-600 flex items-center space-x-1">
                                                <FileText className="h-4 w-4" />
                                                <span>Resume uploaded</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={editForm.linkedin || ''}
                                        onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GitHub</label>
                                    <input
                                        type="url"
                                        value={editForm.github || ''}
                                        onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio</label>
                                    <input
                                        type="url"
                                        value={editForm.portfolio || ''}
                                        onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                                💡 For full profile editing with experience and education, please use the Job Seeker Dashboard.
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-6 pt-6 border-t border-slate-200">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Avatar Confirmation Modal */}
            {showDeleteAvatarConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowDeleteAvatarConfirm(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-100 rounded-full p-3 mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Delete Photo?
                            </h2>

                            <p className="text-slate-600 mb-6">
                                Are you sure you want to delete your profile photo? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteAvatarConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAvatar}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
