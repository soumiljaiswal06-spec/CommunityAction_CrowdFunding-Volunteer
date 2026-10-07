import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { Search, Filter, SlidersHorizontal, MapPin, X, RotateCcw } from 'lucide-react';

interface ExplorePageProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
  onQuickFund: (project: Project) => void;
}

const CATEGORIES = [
  'All',
  'Environment',
  'Education',
  'Community',
  'Infrastructure',
  'Health',
  'Animal Welfare',
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Actively Raising', value: 'active' },
  { label: 'Urgent Action Needed', value: 'urgent' },
  { label: '100% Goal Reached', value: 'funded' },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({
  projects,
  onViewDetails,
  onQuickFund,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'most_funded' | 'urgent' | 'goal'>('newest');

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.creator_name.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'All' && p.status !== selectedStatus) {
          return false;
        }

        // Location text filter
        if (locationFilter.trim()) {
          const loc = locationFilter.toLowerCase();
          if (!p.location.toLowerCase().includes(loc)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'most_funded') {
          const pctA = a.amount_raised / a.funding_goal;
          const pctB = b.amount_raised / b.funding_goal;
          return pctB - pctA;
        }
        if (sortBy === 'urgent') {
          if (a.status === 'urgent' && b.status !== 'urgent') return -1;
          if (b.status === 'urgent' && a.status !== 'urgent') return 1;
          return 0;
        }
        if (sortBy === 'goal') {
          return b.funding_goal - a.funding_goal;
        }
        // default: newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [projects, searchTerm, selectedCategory, selectedStatus, locationFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setLocationFilter('');
    setSortBy('newest');
  };

  const isFiltered =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'All' ||
    locationFilter !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
          Browse Directory
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
          Explore Community Projects
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Find civic initiatives that resonate with you, volunteer your time, or contribute funds.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        
        {/* Top row: Search input + Location input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by initiative title, keywords, or coordinator..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              placeholder="Filter by city/ward..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            {locationFilter && (
              <button
                onClick={() => setLocationFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest</option>
              <option value="urgent">Sort: Urgent First</option>
              <option value="most_funded">Sort: Most Funded</option>
              <option value="goal">Sort: Highest Goal</option>
            </select>
          </div>

        </div>

        {/* Second row: Category Pills + Status Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status selector & Reset */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="py-1.5 px-3 bg-slate-100 border-none rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Showing <span className="text-slate-900">{filteredProjects.length}</span>{' '}
          {filteredProjects.length === 1 ? 'Community Initiative' : 'Community Initiatives'}
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={onViewDetails}
              onQuickFund={onQuickFund}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No community initiatives found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Try adjusting your search keywords, clearing categories, or checking another neighborhood.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
