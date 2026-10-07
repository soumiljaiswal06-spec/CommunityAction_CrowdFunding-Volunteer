import React, { useState } from 'react';
import { Project } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { MapPin, Filter, Layers, ExternalLink, Users } from 'lucide-react';

interface MapPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const filtered = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const categories = ['All', 'Environment', 'Education', 'Community', 'Infrastructure', 'Health'];

  const handleCardClick = (project: Project) => {
    setActiveProjectId(project.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            Geographic View
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Community Action Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Click pins to view civic needs, volunteer counts, and funding progress across your city.
          </p>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Container (8 Cols on desktop) */}
        <div className="lg:col-span-8 h-[550px] lg:h-[650px] relative">
          <InteractiveMap
            projects={filtered}
            selectedProjectId={activeProjectId}
            onSelectProject={onSelectProject}
            height="100%"
          />
        </div>

        {/* Project List Sidebar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col h-[550px] lg:h-[650px] bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Drives ({filtered.length})
            </span>
            <span className="text-[11px] text-slate-400">Click to focus pin</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {filtered.map(proj => {
              const progress = Math.min(100, Math.round((proj.amount_raised / proj.funding_goal) * 100));
              const isSelected = activeProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => handleCardClick(proj)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {proj.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ₹{proj.amount_raised.toLocaleString()} / ₹{proj.funding_goal.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {proj.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    📍 {proj.location}
                  </p>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {proj.volunteers_count ?? 0} Volunteers
                    </span>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onSelectProject(proj);
                      }}
                      className="text-[11px] font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-0.5"
                    >
                      <span>Full Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
