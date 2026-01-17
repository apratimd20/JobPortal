import React, { useState, useEffect } from 'react';
import {
    User,
    Briefcase,
    BookmarkCheck,
    Settings,
    MapPin,
    Mail,
    Phone,
    Link2,
    Github,
    Linkedin,
    Globe,
    Edit,
    Save,
    X,
    Plus,
    Trash2,
    Calendar,
    Building2,
    GraduationCap,
    Award,
    FileText,
    Loader2,
    Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

const JobSeekerDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchSavedJobs();
        }
    }, [user]);

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
                setProfile(data.data);
                setEditForm(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            const response = await fetch(`${baseURL}/users/saved-jobs`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setSavedJobs(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

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
                setProfile(data.data);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const handleRemoveSavedJob = async (jobId) => {
        try {
            const response = await fetch(`${baseURL}/users/saved-jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Job removed from saved list');
                fetchSavedJobs();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error removing saved job:', error);
            toast.error('Failed to remove saved job');
        }
    };

    const addExperience = () => {
        setEditForm({
            ...editForm,
            experience: [...(editForm.experience || []), { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]
        });
    };

    const removeExperience = (index) => {
        const newExperience = editForm.experience.filter((_, i) => i !== index);
        setEditForm({ ...editForm, experience: newExperience });
    };

    const updateExperience = (index, field, value) => {
        const newExperience = [...editForm.experience];
        newExperience[index][field] = value;
        setEditForm({ ...editForm, experience: newExperience });
    };

    const addEducation = () => {
        setEditForm({
            ...editForm,
            education: [...(editForm.education || []), { institution: '', degree: '', field: '', startYear: '', endYear: '', current: false }]
        });
    };

    const removeEducation = (index) => {
        const newEducation = editForm.education.filter((_, i) => i !== index);
        setEditForm({ ...editForm, education: newEducation });
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...editForm.education];
        newEducation[index][field] = value;
        setEditForm({ ...editForm, education: newEducation });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                                <User className="h-4 w-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">{profile?.name}</span>
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
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-slate-200">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'profile', label: 'Profile', icon: User },
                            { id: 'saved', label: 'Saved Jobs', icon: BookmarkCheck },
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
            <main className="w-full  px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {profile?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{profile?.name}</h2>
                                        <p className="text-slate-600">{profile?.email}</p>
                                        {profile?.location && (
                                            <div className="flex items-center space-x-1 text-slate-600 mt-1">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">{profile.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                )}
                            </div>

                            {profile?.bio && !isEditing && (
                                <p className="text-slate-600 mb-6">{profile.bio}</p>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start ">
                                        <div>
                                            <label className="block text-left  text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={editForm.phone || ''}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={editForm.location || ''}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                value={editForm.bio || ''}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                                placeholder="Tell us about yourself..."
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
                                            onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split(',').map(s => s.trim()) })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="JavaScript, React, Node.js, etc."
                                        />
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-700">Experience</label>
                                            <button
                                                type="button"
                                                onClick={addExperience}
                                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Add Experience</span>
                                            </button>
                                        </div>
                                        {editForm.experience?.map((exp, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-4 mb-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-medium text-slate-900">Experience {index + 1}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={exp.company || ''}
                                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        placeholder="Company"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={exp.position || ''}
                                                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        placeholder="Position"
                                                    />
                                                    <input
                                                        type="month"
                                                        value={exp.startDate || ''}
                                                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                    />
                                                    <input
                                                        type="month"
                                                        value={exp.endDate || ''}
                                                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        disabled={exp.current}
                                                    />
                                                    <div className="md:col-span-2">
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={exp.current || false}
                                                                onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                                                className="rounded"
                                                            />
                                                            <span className="text-sm text-slate-700">Currently working here</span>
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        value={exp.description || ''}
                                                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                        className="md:col-span-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm min-h-[80px]"
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Education */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-700">Education</label>
                                            <button
                                                type="button"
                                                onClick={addEducation}
                                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Add Education</span>
                                            </button>
                                        </div>
                                        {editForm.education?.map((edu, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-4 mb-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-medium text-slate-900">Education {index + 1}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={edu.institution || ''}
                                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        placeholder="Institution"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.degree || ''}
                                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        placeholder="Degree"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.field || ''}
                                                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        placeholder="Field of Study"
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={edu.startYear || ''}
                                                            onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            placeholder="Start Year"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={edu.endYear || ''}
                                                            onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            placeholder="End Year"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                            <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                                            <input
                                                type="url"
                                                value={editForm.linkedin || ''}
                                                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
                                            <input
                                                type="url"
                                                value={editForm.github || ''}
                                                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio</label>
                                            <input
                                                type="url"
                                                value={editForm.portfolio || ''}
                                                onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>Save Changes</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditForm(profile);
                                            }}
                                            className="flex items-center space-x-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {/* Contact Info */}
                                    <div className="flex flex-wrap gap-4">
                                        {profile?.phone && (
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-sm">{profile.phone}</span>
                                            </div>
                                        )}
                                        {profile?.email && (
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-sm">{profile.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {profile?.skills && profile.skills.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                                                <Award className="h-5 w-5" />
                                                <span>Skills</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {profile?.experience && profile.experience.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                                                <Briefcase className="h-5 w-5" />
                                                <span>Experience</span>
                                            </h3>
                                            <div className="space-y-4">
                                                {profile.experience.map((exp, index) => (
                                                    <div key={index} className="border-l-2 border-blue-600 pl-4">
                                                        <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                                                        <p className="text-slate-600">{exp.company}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                        </p>
                                                        {exp.description && (
                                                            <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {profile?.education && profile.education.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                                                <GraduationCap className="h-5 w-5" />
                                                <span>Education</span>
                                            </h3>
                                            <div className="space-y-4">
                                                {profile.education.map((edu, index) => (
                                                    <div key={index} className="border-l-2 border-green-600 pl-4">
                                                        <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                                                        <p className="text-slate-600">{edu.institution}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {edu.field} • {edu.startYear} - {edu.endYear}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {profile?.resume && (
                                            <a
                                                href={profile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                            >
                                                <FileText className="h-4 w-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Resume</span>
                                            </a>
                                        )}
                                        {profile?.linkedin && (
                                            <a
                                                href={profile.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                            >
                                                <Linkedin className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm text-blue-700">LinkedIn</span>
                                            </a>
                                        )}
                                        {profile?.github && (
                                            <a
                                                href={profile.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <Github className="h-4 w-4 text-white" />
                                                <span className="text-sm text-white">GitHub</span>
                                            </a>
                                        )}
                                        {profile?.portfolio && (
                                            <a
                                                href={profile.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                                            >
                                                <Globe className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm text-purple-700">Portfolio</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Saved Jobs Tab */}
                {activeTab === 'saved' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Saved Jobs</h2>
                            {savedJobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookmarkCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No saved jobs yet</h3>
                                    <p className="text-slate-600">Browse jobs and save the ones you're interested in</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {savedJobs.map(job => (
                                        <div
                                            key={job._id}
                                            className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                                                    <p className="text-slate-600 mb-3">{job.company}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{job.location}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Briefcase className="h-4 w-4" />
                                                            <span>{job.jobType}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveSavedJob(job._id)}
                                                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                />
                            </div>
                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Account Information</h3>
                                <p className="text-sm text-slate-600">
                                    Account created: {new Date(profile?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobSeekerDashboard;
