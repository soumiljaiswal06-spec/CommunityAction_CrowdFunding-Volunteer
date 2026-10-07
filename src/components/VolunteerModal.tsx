import React, { useState } from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { HandHeart, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface VolunteerModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 ');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('Weekends (Saturday/Sunday)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim() || !phone.trim()) {
      setError('Name, email, and phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${project.id}/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          skills: skills.trim() || 'General community support',
          availability,
          userId: user?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit registration');
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandHeart className="w-5 h-5" />
            <h3 className="font-bold text-base">Volunteer Registration</h3>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4 bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900">
              <span className="font-semibold block mb-0.5">Project: {project.title}</span>
              <span className="text-blue-700">Required Skills / Tasks: {project.volunteer_skills_needed || 'Open for all volunteers'}</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skills or Strengths You Can Offer
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. Physical labor, organizing, tutoring, driving, painting"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your Availability
                </label>
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Weekends (Saturday/Sunday)">Weekends (Saturday / Sunday)</option>
                  <option value="Weekday Evenings (After 5 PM)">Weekday Evenings (After 5 PM)</option>
                  <option value="Full Time Volunteer">Full Time / Multi-day Event</option>
                  <option value="Flexible / On Call">Flexible / On-call as needed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Confirm Volunteer Sign-Up'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Registration Successful!</h4>
            <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
              Your volunteer request has been submitted successfully. The organizer will reach out with the event itinerary and schedule.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition-all"
            >
              Back to Project
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
