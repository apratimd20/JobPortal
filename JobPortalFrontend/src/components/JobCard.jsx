import React from 'react';
import { MapPin, Clock, Building2, Bookmark, ChevronRight } from 'lucide-react';

const JobCard = ({ 
  job, 
  isSaved, 
  onSaveClick, 
  onApplyClick, 
  showAuthModal,
  user 
}) => {
  const getInitials = (company) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 overflow-hidden group cursor-pointer">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="text-sm font-bold bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg group-hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center text-blue-700">
              {getInitials(job.company)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-slate-600 font-medium text-sm">{job.company}</p>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                showAuthModal();
                return;
              }
              onSaveClick(job._id);
            }}
            className="ml-2"
          >
            <Bookmark
              className={`h-5 w-5 transition-all ${
                isSaved
                  ? 'fill-blue-600 text-blue-600'
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            />
          </button>
        </div>

        <p className="text-slate-600 mb-4 text-sm line-clamp-3">
          {job.description?.substring(0, 120)}...
        </p>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{job.jobType || 'Full-time'}</span>
          </div>
          {job.experience && (
            <div className="flex items-center space-x-1">
              <Building2 className="h-3 w-3" />
              <span>{job.experience}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">{formatDate(job.dateFetched)}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                showAuthModal();
                return;
              }
              onApplyClick(job);
            }}
            className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm group-hover:shadow-lg"
          >
            <span>Apply</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;