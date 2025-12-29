import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
    Trash2,
    Save,
    ArrowLeft,
    Mail,
    Smartphone,
    MessageSquare,
    Eye,
    Lock,
    Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const Settings = () => {
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

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('userSettings');
        return saved ? JSON.parse(saved) : {
            notifications: {
                email: true,
                push: true,
                sms: false,
                jobAlerts: true,
                applicationUpdates: true,
                newsletter: false
            },
            privacy: {
                profileVisibility: 'public',
                showEmail: false,
                showPhone: false,
                allowMessages: true
            },
            preferences: {
                theme: 'light',
                language: 'en',
                emailFrequency: 'daily'
            }
        };
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const updateNotification = (key, value) => {
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                [key]: value
            }
        });
        toast.success('Notification preference updated!', {
            position: 'top-right',
            autoClose: 2000,
        });
    };

    const updatePrivacy = (key, value) => {
        setSettings({
            ...settings,
            privacy: {
                ...settings.privacy,
                [key]: value
            }
        });
        toast.success('Privacy setting updated!', {
            position: 'top-right',
            autoClose: 2000,
        });
    };

    const updatePreference = (key, value) => {
        setSettings({
            ...settings,
            preferences: {
                ...settings.preferences,
                [key]: value
            }
        });
        toast.success('Preference updated!', {
            position: 'top-right',
            autoClose: 2000,
        });
    };

    const ToggleSwitch = ({ enabled, onChange }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => { }}
                onHomeClick={() => navigate('/')}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Jobs</span>
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                        <SettingsIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
                        <p className="text-slate-600 mt-1">Manage your account preferences</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Account Settings */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <User className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800">Account Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed here. Contact support if needed.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <button className="w-full text-left px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
                                    Change Password (Coming Soon)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Bell className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800">Notification Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive updates via email</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.email}
                                    onChange={(val) => updateNotification('email', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Smartphone className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Push Notifications</p>
                                        <p className="text-sm text-slate-500">Get push notifications on your device</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.push}
                                    onChange={(val) => updateNotification('push', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <MessageSquare className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">SMS Notifications</p>
                                        <p className="text-sm text-slate-500">Receive text messages</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.sms}
                                    onChange={(val) => updateNotification('sms', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Job Alerts</p>
                                        <p className="text-sm text-slate-500">Get notified about new job postings</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.jobAlerts}
                                    onChange={(val) => updateNotification('jobAlerts', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Application Updates</p>
                                        <p className="text-sm text-slate-500">Updates on your job applications</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.applicationUpdates}
                                    onChange={(val) => updateNotification('applicationUpdates', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Newsletter</p>
                                        <p className="text-sm text-slate-500">Weekly job market insights</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.notifications.newsletter}
                                    onChange={(val) => updateNotification('newsletter', val)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800">Privacy & Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Visibility</label>
                                <select
                                    value={settings.privacy.profileVisibility}
                                    onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="public">Public - Visible to everyone</option>
                                    <option value="private">Private - Only visible to you</option>
                                    <option value="recruiters">Recruiters Only</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Eye className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Show Email on Profile</p>
                                        <p className="text-sm text-slate-500">Make your email visible to others</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.privacy.showEmail}
                                    onChange={(val) => updatePrivacy('showEmail', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Eye className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Show Phone on Profile</p>
                                        <p className="text-sm text-slate-500">Make your phone number visible</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.privacy.showPhone}
                                    onChange={(val) => updatePrivacy('showPhone', val)}
                                />
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <MessageSquare className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">Allow Messages</p>
                                        <p className="text-sm text-slate-500">Let recruiters message you</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.privacy.allowMessages}
                                    onChange={(val) => updatePrivacy('allowMessages', val)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Application Preferences */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Palette className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800">Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Frequency</label>
                                <select
                                    value={settings.preferences.emailFrequency}
                                    onChange={(e) => updatePreference('emailFrequency', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="realtime">Real-time</option>
                                    <option value="daily">Daily Digest</option>
                                    <option value="weekly">Weekly Summary</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                                <select
                                    value={settings.preferences.language}
                                    onChange={(e) => updatePreference('language', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" />
                            <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                        </div>
                        <p className="text-slate-600 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            disabled
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
                        >
                            Delete Account (Disabled)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
