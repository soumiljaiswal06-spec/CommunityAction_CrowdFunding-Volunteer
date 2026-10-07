import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  PlusCircle,
  Compass,
  MapPin,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
}) => {
  const { user, logout, demoAccounts, switchUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors block leading-tight">
                Community<span className="text-emerald-600">Action</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 block">
                Crowdfund & Volunteer
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'home'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'explore'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Projects</span>
            </button>
            <button
              onClick={() => handleNavClick('map')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'map'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => handleNavClick('create')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'create'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </nav>

          {/* Right Side: Demo Quick Switcher & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher Dropdown (Crucial for Evaluation/Demonstration) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDemoDropdownOpen(!demoDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 flex items-center gap-1.5 transition-colors"
                title="Switch demo persona for testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">Demo Persona:</span>
                <span className="font-bold text-slate-900 truncate max-w-[90px]">
                  {user ? user.name.split(' ')[0] : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Switch Test Account
                  </div>
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        switchUser(acc);
                        setDemoDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={acc.avatar} alt={acc.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{acc.name}</div>
                          <div className="text-[10px] text-slate-500">{acc.role === 'admin' ? 'Administrator' : 'Citizen'}</div>
                        </div>
                      </div>
                      {user?.id === acc.id && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile or Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setDemoDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-emerald-100"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <span className="block text-xs font-bold text-slate-900 truncate max-w-[110px] leading-tight">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        Role: {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>My Dashboard</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2 text-left"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        <span>Admin Control Panel</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Projects</span>
            </button>
            <button
              onClick={() => handleNavClick('map')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => handleNavClick('create')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Create Project</span>
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>My Dashboard</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-purple-700 bg-purple-50 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* User state in mobile */}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-rose-600 font-bold px-3 py-1 bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-bold text-white bg-slate-900 rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
