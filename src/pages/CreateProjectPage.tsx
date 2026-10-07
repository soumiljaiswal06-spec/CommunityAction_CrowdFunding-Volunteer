import React, { useState } from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Sparkles, MapPin, Image, Calendar, Users, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

interface CreateProjectPageProps {
  onProjectCreated: (project: Project) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Environment',
  'Education',
  'Community',
  'Infrastructure',
  'Health',
  'Animal Welfare',
] as const;

const PHOTO_PRESETS = [
  {
    name: 'Park & Greenery',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'School & Books',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Community Center',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Playground',
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Health Camp',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Animal Rescue',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
  },
];

const TEMPLATES = [
  {
    label: '🌳 Tree Planting Drive',
    title: 'Plant 100 Fruit Trees in Neighborhood Colony',
    category: 'Environment',
    goal: 12000,
    volunteers: 20,
    skills: 'Pit digging, watering saplings, logistics',
    location: 'Sector 5 Green Belt, North Colony',
    lat: 19.0850,
    lng: 72.8800,
    desc: 'Our street sidewalks lack shading and suffer high summer temperatures. We are planting 100 native fruit and shade trees with metal protective tree cages.',
    img: PHOTO_PRESETS[0].url,
  },
  {
    label: '📚 Library Corner',
    title: 'Science Books & Experiment Kits for Ward School',
    category: 'Education',
    goal: 18000,
    volunteers: 8,
    skills: 'Sorting books, science demo for kids, organizing shelves',
    location: 'Municipal High School, Gandhi Chowk',
    lat: 19.0720,
    lng: 72.8650,
    desc: 'Setting up a hands-on STEM science corner with interactive kits, microscope, and 150 illustrated books for 6th-8th grade public school students.',
    img: PHOTO_PRESETS[1].url,
  },
  {
    label: '🛝 Playground Repair',
    title: 'Fix Broken Swings & Add Safety Turf to Public Ground',
    category: 'Infrastructure',
    goal: 25000,
    volunteers: 12,
    skills: 'Metal painting, sand filling, carpentry supervision',
    location: 'Public Recreational Ground, Station Road',
    lat: 19.0620,
    lng: 72.8520,
    desc: 'The children play area has sharp exposed bolts on old swings. We need to repaint, weld supports, and lay non-slip recycled rubber mats.',
    img: PHOTO_PRESETS[3].url,
  },
];

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({
  onProjectCreated,
  onCancel,
}) => {
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Environment');
  const [fundingGoal, setFundingGoal] = useState<string>('15000');
  const [deadline, setDeadline] = useState<string>('2026-11-30');
  const [location, setLocation] = useState('Green Valley Colony, North Ward');
  const [latitude, setLatitude] = useState<number>(19.0760);
  const [longitude, setLongitude] = useState<number>(72.8777);
  const [image, setImage] = useState(PHOTO_PRESETS[0].url);
  const [volunteersNeeded, setVolunteersNeeded] = useState<string>('15');
  const [volunteerSkills, setVolunteerSkills] = useState('Physical cleanup, organizing, coordination');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.desc);
    setCategory(tpl.category as any);
    setFundingGoal(String(tpl.goal));
    setVolunteersNeeded(String(tpl.volunteers));
    setVolunteerSkills(tpl.skills);
    setLocation(tpl.location);
    setLatitude(tpl.lat);
    setLongitude(tpl.lng);
    setImage(tpl.img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in title, description, and location.');
      return;
    }

    if (Number(fundingGoal) <= 0) {
      setError('Funding goal must be greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          funding_goal: Number(fundingGoal),
          deadline,
          location: location.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          image,
          volunteers_needed: Number(volunteersNeeded) || 5,
          volunteer_skills_needed: volunteerSkills.trim(),
          creator_id: user?.id || 'demo-user',
          creator_name: user?.name || 'Community Member',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setLoading(false);
        return;
      }

      onProjectCreated(data.project);
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
          Citizen Initiative Proposal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
          Post a Community Project
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Propose a local problem that needs collective neighborhood funds and volunteer labor.
        </p>
      </div>

      {/* College Quick-Fill Template Buttons */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick College Presentation Templates (Click to Auto-fill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-slate-800 border border-emerald-200 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Project Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Park Needs Cleaning & Waste Bins"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Category & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Deadline *
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Problem & Action Plan *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the current issue in your locality, why it matters, what materials will be bought, and how funds will be spent..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Financial & Volunteers Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Funding Goal (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={fundingGoal}
                onChange={e => setFundingGoal(e.target.value)}
                placeholder="15000"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Volunteers Required *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                required
                value={volunteersNeeded}
                onChange={e => setVolunteersNeeded(e.target.value)}
                placeholder="15"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Volunteer Skills Needed */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Volunteer Skills or Requirements Needed
          </label>
          <input
            type="text"
            value={volunteerSkills}
            onChange={e => setVolunteerSkills(e.target.value)}
            placeholder="e.g. Trash collection, painting, teaching kids, gardening, first aid"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Location & Map Coordinates */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Geographic Location for Interactive Map</span>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Location Name / Street Address *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Riverside Primary School, 4th Cross"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={e => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={e => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Project Image Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Project Cover Photo
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {PHOTO_PRESETS.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setImage(p.url)}
                className={`relative rounded-xl overflow-hidden cursor-pointer h-16 border-2 transition-all ${
                  image === p.url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center truncate px-1 py-0.5">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          <input
            type="url"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="Or enter custom image URL"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing Initiative...' : 'Publish Community Project'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
