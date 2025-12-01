import React from 'react';
import { Search, MapPin } from 'lucide-react';

const HeroSection = ({ 
  searchTerm, 
  locationFilter, 
  onSearchChange, 
  onLocationChange, 
  onSearch, 
  onKeyPress 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Discover opportunities from top companies around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                value={searchTerm}
                onChange={onSearchChange}
                onKeyPress={onKeyPress}
              />
            </div>
            
            <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl md:w-64">
              <MapPin className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                value={locationFilter}
                onChange={onLocationChange}
                onKeyPress={onKeyPress}
              />
            </div>
            
            <button 
              onClick={onSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;