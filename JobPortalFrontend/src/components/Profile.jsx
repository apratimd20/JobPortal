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
    ArrowLeft
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

    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('profileData');
        return saved ? JSON.parse(saved) : {
            bio: 'Passionate professional looking for exciting opportunities.',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
            experience: [
                {
                    title: 'Senior Developer',
                    company: 'Tech Corp',
                    duration: '2020 - Present',
                    description: 'Leading development team and building scalable applications'
                }
            ],
            education: [
                {
                    degree: 'Bachelor of Computer Science',
                    school: 'University Name',
                    year: '2016 - 2020'
                }
            ],
            resume: null
        };
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }, [profileData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const openEditModal = () => {
        setEditForm({
            name: user.name,
            email: user.email,
            phone: profileData.phone,
            location: profileData.location,
            bio: profileData.bio
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = () => {
        // Update user data
        const updatedUser = {
            ...user,
            name: editForm.name,
            email: editForm.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Update profile data
        setProfileData({
            ...profileData,
            phone: editForm.phone,
            location: editForm.location,
            bio: editForm.bio
        });

        setShowEditModal(false);
        toast.success('Profile updated successfully!', {
            position: 'top-right',
            autoClose: 2000,
        });
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setProfileData({
                ...profileData,
                resume: {
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    uploadedAt: new Date().toISOString()
                }
            });
            toast.success('Resume uploaded successfully!');
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, newSkill.trim()]
            });
            setNewSkill('');
            toast.success('Skill added!');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(skill => skill !== skillToRemove)
        });
        toast.success('Skill removed!');
    };

    if (!user) return null;

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
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Jobs</span>
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-blue-600 mb-4 sm:mb-0">
                                {user.initials || user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="sm:ml-6 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                                        <p className="text-slate-600 mt-1">{user.email}</p>
                                        <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                            {user.userType === 'jobseeker' ? 'Job Seeker' : 'Job Provider'}
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
                            <div className="flex items-center space-x-3 text-slate-600">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <span>{profileData.phone}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                <span>{profileData.location}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span>Joined {new Date().getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">About</h2>
                            <p className="text-slate-600 leading-relaxed">{profileData.bio}</p>
                        </div>

                        {/* Experience Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Experience</h2>
                            <div className="space-y-4">
                                {profileData.experience.map((exp, idx) => (
                                    <div key={idx} className="border-l-4 border-blue-600 pl-4">
                                        <h3 className="font-bold text-slate-800">{exp.title}</h3>
                                        <p className="text-blue-600 font-medium">{exp.company}</p>
                                        <p className="text-sm text-slate-500">{exp.duration}</p>
                                        <p className="text-slate-600 mt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Education</h2>
                            <div className="space-y-4">
                                {profileData.education.map((edu, idx) => (
                                    <div key={idx} className="border-l-4 border-indigo-600 pl-4">
                                        <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                        <p className="text-indigo-600 font-medium">{edu.school}</p>
                                        <p className="text-sm text-slate-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Resume Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Resume/CV</h2>
                            {profileData.resume ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <FileText className="h-8 w-8 text-green-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 truncate">{profileData.resume.name}</p>
                                            <p className="text-sm text-slate-500">{profileData.resume.size}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Uploaded {new Date(profileData.resume.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600 text-sm mb-3">No resume uploaded</p>
                                </div>
                            )}
                            <label className="mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium cursor-pointer">
                                <Upload className="h-4 w-4" />
                                <span>Upload Resume</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-slate-500 mt-2 text-center">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {profileData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="group bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200 flex items-center space-x-2"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3 hover:text-red-600" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                    placeholder="Add a skill"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    onClick={addSkill}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
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
        </div>
    );
};

export default Profile;
