import React from 'react';
import { Briefcase, Building2, Bookmark } from 'lucide-react';

const StatsSection = ({ totalJobs, uniqueCompanies, savedJobs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{totalJobs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 font-medium">Companies</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{uniqueCompanies}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 font-medium">Saved Jobs</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{savedJobs}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Bookmark className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;