import React from 'react';
import { Project, SummaryStats } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Compass,
  CheckCircle,
  Lightbulb,
  DollarSign,
  HeartHandshake,
  MapPin,
  Shield,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  stats: SummaryStats | null;
  featuredProjects: Project[];
  onNavigate: (tab: string) => void;
  onViewProject: (project: Project) => void;
  onQuickFund: (project: Project) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  featuredProjects,
  onNavigate,
  onViewProject,
  onQuickFund,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white -z-10" />
        
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/25 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Civic Crowdfunding & Neighborhood Action</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Small Actions. Real Neighbors.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Transforming Our Communities.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Spot a problem in your street, park, or local school. Propose a solution, raise micro-funds with fellow citizens, register hands-on volunteers, and track the impact on an interactive map.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 text-base"
            >
              <span>Create a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 text-base"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Projects</span>
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>View On Map</span>
            </button>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% Transparent Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Verified Volunteer Signups</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Direct Neighborhood Impact</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Stat 1 */}
            <div className="pt-4 lg:pt-0 lg:px-6 first:pt-0 first:lg:pl-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Projects Created</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.totalProjects ?? 6}
              </div>
              <p className="text-xs text-slate-400 mt-1">Local initiatives launched</p>
            </div>

            {/* Stat 2 */}
            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Amount Raised</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                ₹{(stats?.totalRaised ?? 101600).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Direct citizen funding</p>
            </div>

            {/* Stat 3 */}
            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>Volunteers</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.totalVolunteers ?? 88}+
              </div>
              <p className="text-xs text-slate-400 mt-1">Neighbors ready to help</p>
            </div>

            {/* Stat 4 */}
            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Communities Helped</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.communitiesHelped ?? 14}
              </div>
              <p className="text-xs text-slate-400 mt-1">Wards & neighborhoods</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED COMMUNITY PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Urgent & High Impact</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Community Initiatives
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Active projects that need your contribution and weekend hands today
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onViewDetails={onViewProject}
              onQuickFund={onQuickFund}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/70 px-3 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              How Community Action Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From identifying an unattended municipal issue to organizing neighbors and creating visible civic improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Spot a Need</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a photo of a littered park, an under-equipped school, or barren neighborhood streets and define the exact need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Post The Project</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publish a clear budget goal (e.g. ₹15,000 for waste bins) and the number of volunteers required on the public map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Crowdfund & Enlist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Neighbors contribute micro-donations (₹200 - ₹2,000) and sign up for weekend volunteer slots matching their skills.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Execute & Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete the drive, post photo updates, and mark the goal reached. Transparent tracking for everyone.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Have a community idea in mind? Post It Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE MAP PREVIEW TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 bg-white/10 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider">
              OpenStreetMap + Leaflet
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Locate Civic Action Around Your Neighborhood
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Browse geocoded pins for active drives across town. Filter by park cleanups, educational libraries, or urgent elder care camps directly on our interactive map.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Open Full Interactive Map</span>
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm"
              >
                Browse List View
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Live Map Highlights
            </div>
            <div className="space-y-3">
              {featuredProjects.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => onViewProject(p)}
                  className="p-3 bg-white/10 hover:bg-white/15 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-300 truncate">📍 {p.location}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 shrink-0">
                    ₹{p.amount_raised.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
