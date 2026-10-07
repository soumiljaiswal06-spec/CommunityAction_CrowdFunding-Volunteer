import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  Layers,
  HeartHandshake,
  DollarSign,
  Trash2,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

interface AdminPageProps {
  onSelectProject: (projectId: string) => void;
  onRefreshAllData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onSelectProject,
  onRefreshAllData,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'donations' | 'volunteers' | 'users'>('overview');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteProject = async (projectId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the project: "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMessage(`Project "${title}" has been deleted.`);
        fetchAdminData();
        onRefreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVolunteerStatus = async (volId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'registered' : 'approved';
    try {
      const res = await fetch(`/api/admin/volunteers/${volId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoDb = async () => {
    if (!window.confirm('Reset database to pristine sample data? This is great for refreshing demonstrations.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/reset-demo', { method: 'POST' });
      const resData = await res.json();
      setActionMessage(resData.message || 'Database reset successfully');
      fetchAdminData();
      onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You are currently viewing with citizen permissions. Use the top bar persona switcher to switch to <strong>Dr. Anita Roy (Administrator)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs uppercase border border-purple-500/30">
              Admin Control Panel
            </span>
            <span className="text-xs text-slate-400">Logged in as {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Platform Moderation & Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage published civic initiatives, review simulated donations, and verify volunteer rosters.
          </p>
        </div>

        <div>
          <button
            onClick={handleResetDemoDb}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
            title="Restore initial college demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Sample Data</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Total Registered Users</span>
          </span>
          <div className="text-2xl font-black text-slate-900">{data?.stats?.totalUsers ?? '...'}</div>
          <p className="text-[11px] text-slate-400">Citizens & coordinators</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Projects</span>
          </span>
          <div className="text-2xl font-black text-slate-900">{data?.stats?.totalProjects ?? '...'}</div>
          <p className="text-[11px] text-slate-400">Published community initiatives</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>Total Donations</span>
          </span>
          <div className="text-2xl font-black text-slate-900">{data?.stats?.totalDonations ?? '...'}</div>
          <p className="text-[11px] text-slate-400">Total micro-contributions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            <span>Total Raised</span>
          </span>
          <div className="text-2xl font-black text-emerald-700">₹{(data?.stats?.totalRaised ?? 0).toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Across all projects</p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Projects ({data?.projects?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'donations'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Donations ({data?.donations?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'volunteers'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Volunteer Registrations ({data?.volunteers?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registered Users ({data?.users?.length ?? 0})
        </button>
      </div>

      {/* Tab: Manage Projects */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Coordinator</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Funding Progress</th>
                  <th className="py-3 px-4">Volunteers</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.projects?.map((p: any) => {
                  const pct = Math.min(100, Math.round((p.amount_raised / p.funding_goal) * 100));
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                        <span className="line-clamp-1">{p.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">📍 {p.location}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{p.creator_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          ₹{p.amount_raised.toLocaleString()}{' '}
                          <span className="text-[10px] font-normal text-slate-500">({pct}%)</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {p.volunteers_count}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'funded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="View Project"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Inappropriate Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: All Donations */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Target Initiative</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.donations?.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{d.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{d.user_name}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{d.project_title}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">₹{d.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{d.payment_method}</td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">{d.message || '—'}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Volunteer Registrations */}
      {activeTab === 'volunteers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Skills Offered</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.volunteers?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{v.user_name}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <div>{v.email}</div>
                      <div className="text-[10px]">{v.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{v.project_title}</td>
                    <td className="py-3 px-4 text-slate-600">{v.skills}</td>
                    <td className="py-3 px-4 text-slate-600">{v.availability}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        v.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleVolunteerStatus(v.id, v.status)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          v.status === 'approved'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {v.status === 'approved' ? 'Mark Pending' : 'Approve Volunteer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{u.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-500">{u.location || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
