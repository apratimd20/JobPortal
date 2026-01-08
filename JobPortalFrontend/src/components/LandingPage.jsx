import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, Building2, Users, TrendingUp, Shield, Zap, Award } from 'lucide-react';
import AuthModal from './AuthModal';

const LandingPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            // Redirect to appropriate dashboard
            if (role === 'jobseeker') {
                navigate('/dashboard/seeker');
            } else if (role === 'jobprovider') {
                navigate('/dashboard/provider');
            }
        }
    }, [navigate]);

    const handleLogin = (userData) => {
        setShowAuthModal(false);
        // Navigation will be handled by App.jsx after login
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <img src="/images/logo.png" alt="CareerConnect Logo" className="h-12 w-auto object-contain" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {/* CareerConnect */}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
                        >
                            <span>Get Started</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Find Your Dream Job
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Or Perfect Candidate
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto">
                            Connect talented professionals with amazing opportunities.
                            Whether you're seeking your next role or building your dream team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span className="relative z-10">Get Started Now</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all border-2 border-slate-200 hover:border-blue-600"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Jobs', value: '10,000+', icon: Briefcase },
                            { label: 'Companies', value: '5,000+', icon: Building2 },
                            { label: 'Job Seekers', value: '50,000+', icon: Users },
                            { label: 'Success Rate', value: '95%', icon: TrendingUp }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-3">
                                    <stat.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Powerful features for both job seekers and employers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Job Seekers */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                                    <Search className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">For Job Seekers</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { icon: Search, text: 'Advanced job search with smart filters' },
                                    { icon: Briefcase, text: 'Save and track your favorite opportunities' },
                                    { icon: Zap, text: 'One-click apply to multiple positions' },
                                    { icon: Award, text: 'Personalized job recommendations' }
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="bg-blue-600 rounded-lg p-1.5 mt-0.5">
                                            <feature.icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-slate-700 text-lg">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Job Providers */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">For Employers</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { icon: Briefcase, text: 'Post unlimited job listings' },
                                    { icon: Users, text: 'Manage applicants efficiently' },
                                    { icon: TrendingUp, text: 'Track job performance analytics' },
                                    { icon: Shield, text: 'Verified candidate profiles' }
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="bg-purple-600 rounded-lg p-1.5 mt-0.5">
                                            <feature.icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-slate-700 text-lg">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of professionals and companies finding success on CareerConnect
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        Create Your Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="bg-white p-1 rounded-lg">
                                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                            </div>
                            {/* <span className="text-xl font-bold text-white">CareerConnect</span> */}
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-sm">© 2026 CareerConnect. All rights reserved.</p>
                            <p className="text-xs text-slate-400 mt-1">Connecting talent with opportunity</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={handleLogin}
            />
        </div>
    );
};

export default LandingPage;
