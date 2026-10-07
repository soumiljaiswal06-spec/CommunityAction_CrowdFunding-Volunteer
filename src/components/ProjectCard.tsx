import React from 'react';
import { Project } from '../types';
import { MapPin, Users, HeartHandshake, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onQuickFund?: (project: Project) => void;
}

const CATEGORY_TAG_STYLES: Record<string, string> = {
  Environment: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Education: 'bg-blue-50 text-blue-700 border-blue-200',
  Community: 'bg-amber-50 text-amber-700 border-amber-200',
  Infrastructure: 'bg-purple-50 text-purple-700 border-purple-200',
  Health: 'bg-rose-50 text-rose-700 border-rose-200',
  'Animal Welfare': 'bg-teal-50 text-teal-700 border-teal-200',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onQuickFund,
}) => {
  const percentage = Math.min(100, Math.round((project.amount_raised / project.funding_goal) * 100));
  const isFunded = project.amount_raised >= project.funding_goal;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Project Image & Status Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Pills */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-xs ${
              CATEGORY_TAG_STYLES[project.category] || 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {project.category}
          </span>

          {project.status === 'urgent' ? (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" /> Urgent
            </span>
          ) : isFunded ? (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Goal Reached
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/80 text-white backdrop-blur-md shadow-xs">
              Active
            </span>
          )}
        </div>

        {/* Location pill on bottom of image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-xs text-white drop-shadow-sm font-medium">
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span className="truncate max-w-[240px]">{project.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(project)}
            className="text-base font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors mb-2 leading-snug"
          >
            {project.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div>
          {/* Progress Bar & Amounts */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-bold text-emerald-700">
                ₹{project.amount_raised.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> raised</span>
              </span>
              <span className="text-xs text-slate-500">
                Goal: <strong className="text-slate-800">₹{project.funding_goal.toLocaleString()}</strong>
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFunded ? 'bg-emerald-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{percentage}% funded</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <strong className="text-slate-700">{project.volunteers_count ?? 0}</strong> volunteers
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onViewDetails(project)}
              className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onQuickFund && (
              <button
                onClick={() => onQuickFund(project)}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-xs shadow-emerald-600/20 transition-all flex items-center justify-center gap-1"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Fund Project</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
