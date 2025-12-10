import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Briefcase, Search } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login'); 
  const [userType, setUserType] = useState('jobSeeker'); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Base URL configuration
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  // Register form states (simplified for job seeker)
  const [jobSeekerForm, setJobSeekerForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [jobProviderForm, setJobProviderForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    phone: '',
    companySize: '',
    industry: '',
    website: '',
  });
  
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    // Validation
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      // API call for login
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Store token and user data in localStorage
      const userData = result.data;
      
      console.log('Login successful:', userData);
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Prepare user data for frontend
      const frontendUserData = {
        name: userData.name,
        email: userData.email,
        userType: userData.role,
        initials: userData.name 
          ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : 'U',
        token: userData.token,
        _id: userData._id
      };
      
      // Call onLogin with user data
      onLogin(frontendUserData);
      
      // Clear forms and close modal
      clearForms();
      onClose();
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        setLoginError('Request timeout. Please check your connection and try again.');
      } else if (error.message.includes('HTTP error')) {
        setLoginError(`Server error: ${error.message}. Please try again later.`);
      } else if (error.message === 'Failed to fetch') {
        setLoginError('Unable to reach the server. Please check if the backend is running.');
      } else {
        setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError('');
    
    try {
      let userData;
      let additionalData = {};
      
      if (userType === 'jobSeeker') {
        // Job Seeker validation (simplified)
        if (!jobSeekerForm.name || !jobSeekerForm.email || !jobSeekerForm.password || !jobSeekerForm.confirmPassword) {
          throw new Error('Please fill in all required fields');
        }
        
        if (jobSeekerForm.password !== jobSeekerForm.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (jobSeekerForm.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Prepare data for registration
        userData = {
          name: jobSeekerForm.name,
          email: jobSeekerForm.email,
          password: jobSeekerForm.password,
          role: 'jobseeker'
        };
        
      } else {
        // Job Provider validation
        if (!jobProviderForm.companyName || !jobProviderForm.email || !jobProviderForm.password || 
            !jobProviderForm.confirmPassword || !jobProviderForm.contactPerson) {
          throw new Error('Please fill in all required fields');
        }
        
        if (jobProviderForm.password !== jobProviderForm.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (jobProviderForm.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Use company name as name field for registration
        userData = {
          name: jobProviderForm.companyName,
          email: jobProviderForm.email,
          password: jobProviderForm.password,
          role: 'jobprovider'
        };
        
        // Additional job provider data to save after registration
        additionalData = {
          companyName: jobProviderForm.companyName,
          contactPerson: jobProviderForm.contactPerson,
          phone: jobProviderForm.phone,
          companySize: jobProviderForm.companySize,
          industry: jobProviderForm.industry,
          website: jobProviderForm.website
        };
      }
      
      // API call for registration
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }
      
      // Store token and user data in localStorage
      let registeredUser = result.data;
      
      console.log('Registration successful:', registeredUser);
      
      localStorage.setItem('token', registeredUser.token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      
      // If there's additional data to save (for job provider), make another API call
      if (userType === 'jobProvider' && Object.keys(additionalData).length > 0) {
        try {
          const updateResponse = await fetch(`${baseURL}/auth/update-profile/${registeredUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${registeredUser.token}`
            },
            body: JSON.stringify(additionalData),
          });
          
          if (updateResponse.ok) {
            const updateData = await updateResponse.json();
            if (updateData.success) {
              // Update stored user data with additional fields
              const updatedUser = { ...registeredUser, ...additionalData };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              registeredUser = updatedUser;
            }
          }
        } catch (updateError) {
          console.warn('Could not save additional profile data:', updateError);
          // Continue with registration even if additional data save fails
        }
      }
      
      // Prepare user data for frontend
      const frontendUserData = {
        name: registeredUser.name,
        email: registeredUser.email,
        userType: registeredUser.role,
        initials: registeredUser.name 
          ? registeredUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : 'U',
        token: registeredUser.token,
        _id: registeredUser._id,
        ...(userType === 'jobProvider' ? additionalData : {})
      };
      
      // Call onLogin with user data
      onLogin(frontendUserData);
      
      // Clear forms and close modal
      clearForms();
      onClose();
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.name === 'AbortError') {
        setRegisterError('Request timeout. Please check your connection and try again.');
      } else if (error.message.includes('HTTP error')) {
        setRegisterError(`Server error: ${error.message}. Please try again later.`);
      } else if (error.message === 'Failed to fetch') {
        setRegisterError('Unable to reach the server. Please check if the backend is running.');
      } else {
        setRegisterError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForms = () => {
    setLoginForm({ email: '', password: '' });
    setJobSeekerForm({ 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: ''
    });
    setJobProviderForm({
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactPerson: '',
      phone: '',
      companySize: '',
      industry: '',
      website: '',
    });
    setLoginError('');
    setRegisterError('');
    setUserType('jobSeeker');
    setActiveTab('login');
  };

  const handleClose = () => {
    clearForms();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Welcome to JobPortal
        </h2>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>
        
        {/* User Type Selection (for both login and register) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('jobSeeker')}
              className={`flex items-center justify-center p-3 border rounded-lg transition-all ${
                userType === 'jobSeeker'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <Search className="h-5 w-5 mr-2" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setUserType('jobProvider')}
              className={`flex items-center justify-center p-3 border rounded-lg transition-all ${
                userType === 'jobProvider'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Job Provider
            </button>
          </div>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Don't have an account? Register
              </button>
            </div>
          </form>
        )}
        
        {/* Register Form - Job Seeker (Simplified) */}
        {activeTab === 'register' && userType === 'jobSeeker' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {registerError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {registerError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={jobSeekerForm.name}
                  onChange={(e) => setJobSeekerForm({...jobSeekerForm, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="John Doe"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={jobSeekerForm.email}
                  onChange={(e) => setJobSeekerForm({...jobSeekerForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={jobSeekerForm.password}
                  onChange={(e) => setJobSeekerForm({...jobSeekerForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1 text-left">
                Must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={jobSeekerForm.confirmPassword}
                  onChange={(e) => setJobSeekerForm({...jobSeekerForm, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Job Seeker Account'
              )}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
        
        {/* Register Form - Job Provider */}
        {activeTab === 'register' && userType === 'jobProvider' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {registerError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {registerError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Company Name *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={jobProviderForm.companyName}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, companyName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Acme Inc."
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Contact Person Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={jobProviderForm.contactPerson}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, contactPerson: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="John Doe"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={jobProviderForm.email}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="contact@company.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={jobProviderForm.phone}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                  Company Size
                </label>
                <select
                  value={jobProviderForm.companySize}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, companySize: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={loading}
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                  Industry
                </label>
                <input
                  type="text"
                  value={jobProviderForm.industry}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, industry: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Technology, Healthcare"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Website
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={jobProviderForm.website}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, website: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="https://company.com"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={jobProviderForm.password}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1 text-left">
                Must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={jobProviderForm.confirmPassword}
                  onChange={(e) => setJobProviderForm({...jobProviderForm, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Job Provider Account'
              )}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;