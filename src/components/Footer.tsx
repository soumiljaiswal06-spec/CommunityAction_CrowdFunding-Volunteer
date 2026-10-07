import React from 'react';
import { HeartHandshake, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Community<span className="text-emerald-500">Action</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A transparent, grassroots civic crowdfunding and volunteer coordination platform empowering citizens to revitalize neighborhood parks, schools, playgrounds, and community centers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[11px] rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full-Stack College Demo Edition</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                  Browse All Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
                  Interactive Leaflet Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-white transition-colors">
                  Propose a Community Need
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Citizen Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Focus Areas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Focus Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Environmental Cleanups & Trees</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Public School Education & Books</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Playground & Park Infrastructure</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Civic Centers & Digital Labs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Senior Health & Community Camps</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Stack & Demonstration Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Architecture & Stack
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>Built as a clean full-stack web application:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">React 19</span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">Node.js Express</span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">Leaflet Maps</span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">Relational DB</span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">Tailwind CSS</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                Simulated transactions for demonstration purposes.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Crowdfunded Community Action Platform. College & Event Demonstration Project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for civic impact with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by student developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
