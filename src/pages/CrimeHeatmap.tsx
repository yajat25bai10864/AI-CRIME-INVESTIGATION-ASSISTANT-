import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { BHOPAL_CENTER } from '../data/crimeLocations';
import { getCrimeHeatmap, type CrimeHeatmapPoint } from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SEVERITY_COLOR: Record<string, string> = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
};

const CRIME_TYPES = ['ALL', 'Armed Robbery', 'Vehicle Theft', 'Theft', 'Assault', 'Burglary', 'Chain Snatching', 'Fraud'];

function createMarkerIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0d1117;box-shadow:0 0 8px ${color}60"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function DarkTiles() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function CrimeHeatmap() {
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('ALL');
  const [selected, setSelected] = useState<string | null>(null);
  const [heatmapPoints, setHeatmapPoints] = useState<CrimeHeatmapPoint[]>([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const data = await getCrimeHeatmap();
        setHeatmapPoints(data.points);
        setTotalIncidents(data.total_incidents);
      } catch (error) {
        console.error('Failed to load crime heatmap:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmap();
  }, []);

  const filtered = heatmapPoints.filter((point) => {
    if (crimeTypeFilter === 'ALL') return true;
    return Object.keys(point.crime_types).some(
      (crimeType) => crimeType.toLowerCase() === crimeTypeFilter.toLowerCase()
    );
  });

  const stats = {
    high: 0,
    medium: 0,
    low: 0,
  };

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Crime Heatmap — Bhopal</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">{totalIncidents} incidents · MP Nagar Police Station jurisdiction</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'High Priority', value: stats.high, color: '#ef4444' },
          { label: 'Medium Priority', value: stats.medium, color: '#f59e0b' },
          { label: 'Low Priority', value: stats.low, color: '#22c55e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#161b26] border border-[#1e293b] rounded p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            </div>
            <div>
              <div className="text-lg font-bold font-mono" style={{ color }}>{value}</div>
              <div className="text-[10px] text-[#475569]">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {CRIME_TYPES.map((ct) => (
          <button
            key={ct}
            onClick={() => setCrimeTypeFilter(ct)}
            className={`px-2.5 py-1 rounded text-[10px] font-medium border transition-colors ${
              crimeTypeFilter === ct
                ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                : 'bg-[#161b26] text-[#64748b] border-[#1e293b] hover:text-[#94a3b8]'
            }`}
          >
            {ct}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 rounded overflow-hidden border border-[#1e293b]" style={{ height: 420 }}>
          <MapContainer
            center={BHOPAL_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%', background: '#0d1117' }}
            zoomControl={false}
          >
            <DarkTiles />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {filtered.map((point, index) => {
              const crimeType = Object.keys(point.crime_types)[0] ?? 'Unknown';
              const markerId = `${point.latitude}-${point.longitude}-${index}`;

              return (
                <Marker
                  key={markerId}
                  position={[point.latitude, point.longitude]}
                  icon={createMarkerIcon('#ef4444')}
                  eventHandlers={{ click: () => setSelected(markerId) }}
                >
                  <Popup className="crime-popup">
                    <div className="bg-[#161b26] text-[#cbd5e1] p-2 rounded text-[11px] min-w-[200px]">
                      <div className="font-semibold text-white">
                        Crime Incident
                      </div>
                      <div className="text-[#64748b] mt-0.5">
                        Bhopal
                      </div>
                      <div className="mt-1 font-mono text-[#7c3aed] text-[10px]">
                        {point.incident_count} incident{point.incident_count !== 1 ? 's' : ''}
                      </div>
                      <div className="mt-0.5 text-[#f59e0b] text-[10px]">
                        {crimeType}
                      </div>
                      <div className="mt-0.5 text-[#475569]">
                        {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Incident list */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-3 overflow-y-auto" style={{ maxHeight: 420 }}>
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Incidents ({filtered.length})</div>
          <div className="space-y-2">
            {filtered.map((point, index) => {
              const crimeType = Object.keys(point.crime_types)[0] ?? 'Unknown';
              const markerId = `${point.latitude}-${point.longitude}-${index}`;

              return (
                <button
                  key={markerId}
                  onClick={() => setSelected(selected === markerId ? null : markerId)}
                  className={`w-full text-left px-2.5 py-2 rounded border transition-colors ${
                    selected === markerId
                      ? 'border-[#7c3aed] bg-[#1a1033]'
                      : 'border-[#1e293b] hover:border-[#2d3748]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: '#ef4444' }}
                    />
                    <span className="text-[11px] font-medium text-[#cbd5e1] truncate">
                      {crimeType}
                    </span>
                  </div>

                  <div className="flex gap-2 text-[10px] font-mono ml-4">
                    <span className="text-[#7c3aed]">
                      {point.incident_count} incident{point.incident_count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[#475569]">
                      Weight {point.weight.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#334155] ml-4">
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
