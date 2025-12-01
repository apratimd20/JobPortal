import React from 'react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Login or Register
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => onLogin('John Doe', 'john@example.com')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Login as Demo User
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

// import React, { useState } from 'react';
// import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

// const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
//   const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Login Form State
//   const [loginForm, setLoginForm] = useState({
//     email: '',
//     password: '',
//   });
  
//   // Register Form State
//   const [registerForm, setRegisterForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
  
//   // Error States
//   const [loginError, setLoginError] = useState('');
//   const [registerError, setRegisterError] = useState('');

//   if (!isOpen) return null;

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setLoginError('');
    
//     // Basic validation
//     if (!loginForm.email || !loginForm.password) {
//       setLoginError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       // In production, this would be an API call
//       // Simulating API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
    
//       onLogin({
//         name: loginForm.email.split('@')[0],
//         email: loginForm.email,
//         initials: loginForm.email.split('@')[0].slice(0, 2).toUpperCase()
//       });
      
//     } catch (error) {
//       setLoginError(error.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setRegisterError('');
    
    
//     if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
//       setRegisterError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }
    
//     if (registerForm.password !== registerForm.confirmPassword) {
//       setRegisterError('Passwords do not match');
//       setLoading(false);
//       return;
//     }
    
//     if (registerForm.password.length < 6) {
//       setRegisterError('Password must be at least 6 characters');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       // Simulating API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Mock registration - in real app, send to backend
//       onLogin({
//         name: registerForm.name,
//         email: registerForm.email,
//         initials: registerForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
//       });
      
//     } catch (error) {
//       setRegisterError(error.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginDemo = () => {
//     onLogin({
//       name: 'John Doe',
//       email: 'john@example.com',
//       initials: 'JD'
//     });
//   };

//   const clearForms = () => {
//     setLoginForm({ email: '', password: '' });
//     setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
//     setLoginError('');
//     setRegisterError('');
//     setActiveTab('login');
//   };

//   const handleClose = () => {
//     clearForms();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
//         <button
//           onClick={handleClose}
//           className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
//         >
//           <X className="h-5 w-5" />
//         </button>
        
//         <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
//           Welcome to JobPortal
//         </h2>
        
//         {/* Tabs */}
//         <div className="flex mb-6 border-b border-slate-200">
//           <button
//             onClick={() => setActiveTab('login')}
//             className={`flex-1 py-3 font-medium text-sm transition-colors ${
//               activeTab === 'login'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-600 hover:text-slate-800'
//             }`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setActiveTab('register')}
//             className={`flex-1 py-3 font-medium text-sm transition-colors ${
//               activeTab === 'register'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-600 hover:text-slate-800'
//             }`}
//           >
//             Register
//           </button>
//         </div>
        
//         {/* Login Form */}
//         {activeTab === 'login' && (
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             {loginError && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//                 {loginError}
//               </div>
//             )}
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type="email"
//                   value={loginForm.email}
//                   onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="you@example.com"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={loginForm.password}
//                   onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
//                   className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="••••••••"
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
            
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={() => setActiveTab('register')}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Don't have an account? Register
//               </button>
//             </div>
//           </form>
//         )}
        
//         {/* Register Form */}
//         {activeTab === 'register' && (
//           <form onSubmit={handleRegisterSubmit} className="space-y-4">
//             {registerError && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//                 {registerError}
//               </div>
//             )}
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type="text"
//                   value={registerForm.name}
//                   onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="John Doe"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type="email"
//                   value={registerForm.email}
//                   onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="you@example.com"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={registerForm.password}
//                   onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
//                   className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="••••••••"
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//               <p className="text-xs text-slate-500 mt-1">
//                 Must be at least 6 characters
//               </p>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={registerForm.confirmPassword}
//                   onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   placeholder="••••••••"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
            
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={() => setActiveTab('login')}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Already have an account? Login
//               </button>
//             </div>
//           </form>
//         )}
        
//         {/* Divider */}
//         <div className="my-6 flex items-center">
//           <div className="flex-1 border-t border-slate-300"></div>
//           <span className="px-4 text-sm text-slate-500">OR</span>
//           <div className="flex-1 border-t border-slate-300"></div>
//         </div>
        
//         {/* Demo Login */}
//         <button
//           onClick={handleLoginDemo}
//           className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center"
//         >
//           Try Demo Account
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;