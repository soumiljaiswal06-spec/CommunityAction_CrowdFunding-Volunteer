import React, { useState, useEffect } from 'react';
import { Project, Donation, Volunteer, ProjectUpdate } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Users,
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  AlertTriangle,
  Send,
  UserCheck,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface ProjectDetailsPageProps {
  projectId: string;
  onBack: () => void;
  onOpenFundModal: (project: Project) => void;
  onOpenVolunteerModal: (project: Project) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  projectId,
  onBack,
  onOpenFundModal,
  onOpenVolunteerModal,
}) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New update form state (for creator or admin)
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateDesc, setNewUpdateDesc] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        throw new Error('Project not found');
      }
      const data = await res.json();
      setProject(data.project);
      setDonations(data.donations || []);
      setVolunteers(data.volunteers || []);
      setUpdates(data.updates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle.trim() || !newUpdateDesc.trim()) return;

    setPostingUpdate(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newUpdateTitle.trim(),
          description: newUpdateDesc.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUpdates([data.update, ...updates]);
        setNewUpdateTitle('');
        setNewUpdateDesc('');
        setShowUpdateForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingUpdate(false);
    }
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading community initiative...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">{error || 'This project may have been removed.'}</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const percentage = Math.min(100, Math.round((project.amount_raised / project.funding_goal) * 100));
  const isFunded = project.amount_raised >= project.funding_goal;
  const volunteerPercentage = Math.min(
    100,
    Math.round((volunteers.length / (project.volunteers_needed || 1)) * 100)
  );

  const canPostUpdates = user && (user.id === project.creator_id || user.role === 'admin');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Bar: Back & Share */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <button
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{shareCopied ? 'Link Copied!' : 'Share Project'}</span>
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Project Details, Gallery, Updates, Volunteers (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Title & Image */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative h-72 sm:h-96 w-full bg-slate-900">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Status and Category */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/95 text-slate-900 backdrop-blur-md rounded-xl text-xs font-bold shadow-md">
                  {project.category}
                </span>
                {project.status === 'urgent' ? (
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Urgent Action
                  </span>
                ) : isFunded ? (
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved
                  </span>
                ) : null}
              </div>

              {/* Overlay Bottom Details */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-1.5 text-xs text-white/90 mb-2 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{project.location}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {project.title}
                </h1>
              </div>
            </div>

            {/* Description & Action Plan */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Creator bio row */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                    {project.creator_name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Initiative Coordinator</span>
                    <span className="text-sm font-bold text-slate-900">{project.creator_name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Launched On</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(project.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Initiative Narrative */}
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
                  About This Initiative
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Volunteer tasks & requirements */}
              <div className="bg-blue-50/70 border border-blue-100 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Volunteer Requirements & Scope</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed mb-3">
                  {project.volunteer_skills_needed || 'Open to all community members willing to lend a hand!'}
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-blue-900 pt-2 border-t border-blue-200/50">
                  <span>Target Volunteers: {project.volunteers_needed}</span>
                  <span>Joined So Far: {volunteers.length}</span>
                </div>
              </div>

            </div>
          </div>

          {/* PROJECT UPDATES TIMELINE */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Project Updates ({updates.length})</h3>
                <p className="text-xs text-slate-500">Live progress reports from the initiative organizers</p>
              </div>

              {canPostUpdates && !showUpdateForm && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Post Update
                </button>
              )}
            </div>

            {/* Post update form */}
            {showUpdateForm && (
              <form onSubmit={handlePostUpdate} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Post Progress Update as Coordinator
                </h4>
                <input
                  type="text"
                  required
                  placeholder="Update Headline (e.g. Supplies ordered / Volunteer date finalized)"
                  value={newUpdateTitle}
                  onChange={e => setNewUpdateTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Share details, milestones, vendor receipts, or logistical reminders..."
                  value={newUpdateDesc}
                  onChange={e => setNewUpdateDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={postingUpdate}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    {postingUpdate ? 'Posting...' : 'Publish Update'}
                  </button>
                </div>
              </form>
            )}

            {/* Updates list */}
            {updates.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {updates.map(upd => (
                  <div key={upd.id} className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100"></div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{upd.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          {new Date(upd.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {upd.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-6">
                No updates posted yet. The coordinator will share progress milestones here as funding advances.
              </p>
            )}
          </div>

          {/* VOLUNTEERS & DONORS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Donors Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Recent Supporters ({donations.length})</span>
                </h4>
              </div>

              {donations.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {donations.map(d => (
                    <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{d.user_name}</span>
                        <span className="text-emerald-700">₹{d.amount.toLocaleString()}</span>
                      </div>
                      {d.message && (
                        <p className="text-[11px] text-slate-600 italic">"{d.message}"</p>
                      )}
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {new Date(d.created_at).toLocaleDateString()} • {d.payment_method}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  Be the first neighbor to support this initiative!
                </p>
              )}
            </div>

            {/* Volunteers Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Enlisted Volunteers ({volunteers.length})</span>
                </h4>
              </div>

              {volunteers.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {volunteers.map(v => (
                    <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{v.user_name}</span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          {v.availability}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">Skills: {v.skills}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No volunteers signed up yet. Step forward and join the drive!
                </p>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Funding & Volunteer Action Panel (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-lg sticky top-24 space-y-6">
            
            {/* Funding Progress Meter */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{project.amount_raised.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium block">
                    raised of ₹{project.funding_goal.toLocaleString()} goal
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  {percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 mt-3">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {new Date(project.deadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-0.5">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Backers</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {donations.length} Contributions
                  </span>
                </div>
              </div>
            </div>

            {/* Volunteer Requirement Meter */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Volunteers Enlisted</span>
                </span>
                <span>
                  {volunteers.length} / {project.volunteers_needed}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${volunteerPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {Math.max(0, project.volunteers_needed - volunteers.length)} more volunteer(s) needed for this initiative.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onOpenFundModal(project)}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Fund This Project (Demo)</span>
              </button>

              <button
                onClick={() => onOpenVolunteerModal(project)}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Volunteer for this Project</span>
              </button>
            </div>

            {/* Platform Guarantee / Trust note */}
            <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Community Action Platform Guarantee</span>
              </div>
              <p>
                Funds collected are recorded openly and coordinators publish expense receipts in the updates feed.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
