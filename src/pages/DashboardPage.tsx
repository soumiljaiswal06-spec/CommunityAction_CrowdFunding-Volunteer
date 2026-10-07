import React, { useState, useEffect } from 'react';
import { Project, Donation, Volunteer } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  HeartHandshake,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface DashboardPageProps {
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectProject,
  onCreateProject,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'donations' | 'volunteering'>('projects');
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projectsCreated: 0,
    totalDonated: 0,
    volunteerProjects: 0,
  });
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [myVolunteering, setMyVolunteering] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`/api/user/dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || { projectsCreated: 0, totalDonated: 0, volunteerProjects: 0 });
        setMyProjects(data.myProjects || []);
        setMyDonations(data.myDonations || []);
        setMyVolunteering(data.myVolunteering || []);
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In to Access Your Dashboard</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Track your created civic initiatives, donations made, and volunteered drives.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover bg-emerald-100 border-2 border-emerald-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.location || 'Local Community Member'}</span>
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={onCreateProject}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose New Project</span>
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Projects Created</span>
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.projectsCreated}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Community drives initiated</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>Total Donated</span>
            </span>
            <div className="text-2xl font-black text-emerald-700">₹{stats.totalDonated.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Micro-contributions given</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Volunteer Drives</span>
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.volunteerProjects}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Civic drives joined</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Created Projects ({myProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'donations'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>My Donations ({myDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteering')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'volunteering'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Volunteering ({myVolunteering.length})</span>
        </button>
      </div>

      {/* Tab 1: My Projects */}
      {activeTab === 'projects' && (
        <div>
          {myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map(proj => {
                const progress = Math.min(100, Math.round((proj.amount_raised / proj.funding_goal) * 100));
                return (
                  <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-500 uppercase">{proj.category}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          proj.status === 'funded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{proj.title}</h3>
                      <p className="text-xs text-slate-500 mb-3">📍 {proj.location}</p>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-emerald-700">₹{proj.amount_raised.toLocaleString()}</span>
                          <span className="text-slate-500">Goal: ₹{proj.funding_goal.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Manage / View Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No projects created by you yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Spot a need in your local street or school and start your first drive!</p>
              <button
                onClick={onCreateProject}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Create a Community Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Donations */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {myDonations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Project Name</th>
                    <th className="py-3 px-4">Donation Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDonations.map(don => (
                    <tr key={don.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {don.project_title}
                        {don.message && <p className="text-[11px] text-slate-500 italic font-normal">"{don.message}"</p>}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                        ₹{don.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium">
                          {don.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(don.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectProject(don.project_id)}
                          className="text-slate-900 font-bold hover:text-emerald-700 flex items-center gap-1 justify-end ml-auto"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 p-8">
              <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No donations yet</p>
              <p className="text-xs text-slate-500 mt-1">Explore neighborhood projects and make your first micro-contribution!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Volunteering */}
      {activeTab === 'volunteering' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {myVolunteering.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Initiative</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4">Registered Skills</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myVolunteering.map(vol => (
                    <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {vol.project_title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {vol.project_location || 'City'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {vol.availability}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {vol.skills}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          vol.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectProject(vol.project_id)}
                          className="text-slate-900 font-bold hover:text-emerald-700 flex items-center gap-1 justify-end ml-auto"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 p-8">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No volunteer registrations yet</p>
              <p className="text-xs text-slate-500 mt-1">Lend your skills to a local park cleanup or school library drive.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
