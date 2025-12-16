import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, User, Bookmark, Briefcase as BriefcaseIcon, LogOut, Settings, Bell } from 'lucide-react';

const Navbar = ({ user, onLogout, onLoginClick, onHomeClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.initials}
                  </div>
                  <span className="font-medium text-slate-700 hidden lg:inline">
                    {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-10">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate">{user.name}</p>
                          <p className="text-sm text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {user.userType === 'jobseeker' ? 'Job Seeker' : 'Job Provider'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-slate-400" />
                        My Profile
                      </a>

                      {user.userType === 'jobseeker' ? (
                        <>
                          <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Bookmark className="h-4 w-4 mr-3 text-slate-400" />
                            Saved Jobs
                          </button>
                          <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <BriefcaseIcon className="h-4 w-4 mr-3 text-slate-400" />
                            Applied Jobs
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <BriefcaseIcon className="h-4 w-4 mr-3 text-slate-400" />
                            My Job Listings
                          </button>
                          <button className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Bell className="h-4 w-4 mr-3 text-slate-400" />
                            Applications
                          </button>
                        </>
                      )}

                      <a
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-slate-400" />
                        Settings
                      </a>
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-md"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Login/Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
