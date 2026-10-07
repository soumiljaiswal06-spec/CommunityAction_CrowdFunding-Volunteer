/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Project, SummaryStats } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { MapPage } from './pages/MapPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { MockPaymentModal } from './components/MockPaymentModal';
import { VolunteerModal } from './components/VolunteerModal';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'map' | 'create' | 'details' | 'dashboard' | 'admin'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [fundProject, setFundProject] = useState<Project | null>(null);
  const [volunteerProject, setVolunteerProject] = useState<Project | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/overview');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const refreshAllData = () => {
    fetchProjects();
    fetchStats();
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProjects(), fetchStats()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleViewProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProjectById = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickFund = (project: Project) => {
    setFundProject(project);
  };

  const handleProjectCreated = (newProject: Project) => {
    refreshAllData();
    setSelectedProjectId(newProject.id);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDonationSuccess = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p)));
    fetchStats();
  };

  const handleVolunteerSuccess = () => {
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab: string) => {
          setCurrentTab(tab as any);
        }}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading && projects.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Connecting to Community Action platform...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                stats={stats}
                featuredProjects={projects}
                onNavigate={(tab) => setCurrentTab(tab as any)}
                onViewProject={handleViewProject}
                onQuickFund={handleQuickFund}
              />
            )}

            {currentTab === 'explore' && (
              <ExplorePage
                projects={projects}
                onViewDetails={handleViewProject}
                onQuickFund={handleQuickFund}
              />
            )}

            {currentTab === 'map' && (
              <MapPage
                projects={projects}
                onSelectProject={handleViewProject}
              />
            )}

            {currentTab === 'create' && (
              <CreateProjectPage
                onProjectCreated={handleProjectCreated}
                onCancel={() => setCurrentTab('explore')}
              />
            )}

            {currentTab === 'details' && selectedProjectId && (
              <ProjectDetailsPage
                projectId={selectedProjectId}
                onBack={() => setCurrentTab('explore')}
                onOpenFundModal={(p) => setFundProject(p)}
                onOpenVolunteerModal={(p) => setVolunteerProject(p)}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardPage
                onSelectProject={handleSelectProjectById}
                onCreateProject={() => setCurrentTab('create')}
              />
            )}

            {currentTab === 'admin' && (
              <AdminPage
                onSelectProject={handleSelectProjectById}
                onRefreshAllData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab as any)} />

      {/* Modals */}
      {fundProject && (
        <MockPaymentModal
          project={fundProject}
          isOpen={true}
          onClose={() => setFundProject(null)}
          onSuccess={handleDonationSuccess}
        />
      )}

      {volunteerProject && (
        <VolunteerModal
          project={volunteerProject}
          isOpen={true}
          onClose={() => setVolunteerProject(null)}
          onSuccess={handleVolunteerSuccess}
        />
      )}

      {authModalMode && (
        <AuthModal
          isOpen={true}
          defaultMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
