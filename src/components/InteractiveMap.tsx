import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Project } from '../types';

interface InteractiveMapProps {
  projects: Project[];
  selectedProjectId?: string | null;
  onSelectProject?: (project: Project) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  Environment: { bg: 'bg-emerald-600', text: 'text-emerald-600', hex: '#059669' },
  Education: { bg: 'bg-blue-600', text: 'text-blue-600', hex: '#2563eb' },
  Community: { bg: 'bg-amber-600', text: 'text-amber-600', hex: '#d97706' },
  Infrastructure: { bg: 'bg-purple-600', text: 'text-purple-600', hex: '#7c3aed' },
  Health: { bg: 'bg-rose-600', text: 'text-rose-600', hex: '#e11d48' },
  'Animal Welfare': { bg: 'bg-teal-600', text: 'text-teal-600', hex: '#0d9488' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  center = [19.0760, 72.8777],
  zoom = 12,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      // Standard OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add marker for each project
    projects.forEach(project => {
      const colorInfo = CATEGORY_COLORS[project.category] || { hex: '#2563eb' };
      const progress = Math.min(100, Math.round((project.amount_raised / project.funding_goal) * 100));

      const markerHtml = `
        <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <div style="background-color: ${colorInfo.hex}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold; font-size: 13px;">
            ${progress}%
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${colorInfo.hex}; margin-top: -1px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-community-marker',
        html: markerHtml,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([project.latitude, project.longitude], { icon: customIcon }).addTo(map);

      // Popup HTML content with styling
      const popupHtml = `
        <div style="width: 250px; font-family: system-ui, sans-serif;">
          <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 110px; object-fit: cover; display: block;" />
          <div style="padding: 12px;">
            <div style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 600; text-transform: uppercase; background-color: #f1f5f9; color: ${colorInfo.hex}; border-radius: 4px; margin-bottom: 6px;">
              ${project.category}
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3;">
              ${project.title}
            </h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.3;">
              📍 ${project.location}
            </p>
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 3px;">
                <span style="color: #059669;">₹${project.amount_raised.toLocaleString()}</span>
                <span style="color: #64748b;">Goal: ₹${project.funding_goal.toLocaleString()}</span>
              </div>
              <div style="width: 100%; height: 6px; background-color: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${progress}%; height: 100%; background-color: #059669; border-radius: 999px;"></div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #475569;">🤝 ${project.volunteers_count ?? 0} Volunteers</span>
              <button id="view-proj-${project.id}" style="background-color: #0f172a; color: white; border: none; padding: 5px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;">
                View Details &rarr;
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-proj-${project.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectProject) {
              onSelectProject(project);
            }
          };
        }
      });

      markersRef.current.push(marker);

      // If this is the selected project, center and open popup
      if (selectedProjectId && selectedProjectId === project.id) {
        marker.openPopup();
        map.setView([project.latitude, project.longitude], 14, { animate: true });
      }
    });

    // Fit bounds if multiple projects and no specific one selected
    if (projects.length > 0 && !selectedProjectId && map) {
      try {
        const group = L.featureGroup(markersRef.current);
        if (group.getBounds().isValid()) {
          map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 13 });
        }
      } catch (e) {
        // Fallback
      }
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [projects, selectedProjectId]);

  // Clean resize observer
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/80 shadow-md text-xs text-slate-700 pointer-events-auto hidden sm:flex items-center gap-3">
        <span className="font-semibold text-slate-900">Map Legend:</span>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Env</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Edu</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> Comm</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span> Infra</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> Health</div>
      </div>
    </div>
  );
};
