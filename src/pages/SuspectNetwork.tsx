import { useState, useRef, useEffect } from 'react';
import { PERSONS } from '../data/suspects';
import { X } from 'lucide-react';
import { getCaseGraph, type CaseGraphResponse } from '../services/api';

const NODE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  suspect: { fill: '#ef444420', stroke: '#ef4444', text: '#ef4444' },
  victim: { fill: '#22c55e20', stroke: '#22c55e', text: '#22c55e' },
  witness: { fill: '#06b6d420', stroke: '#06b6d4', text: '#06b6d4' },
  associate: { fill: '#f59e0b20', stroke: '#f59e0b', text: '#f59e0b' },
  vehicle: { fill: '#8b5cf620', stroke: '#8b5cf6', text: '#8b5cf6' },
  location: { fill: '#64748b20', stroke: '#64748b', text: '#64748b' },
};

const ROLE_COLOR: Record<string, string> = {
  PERSON_OF_INTEREST: 'text-[#f59e0b] bg-[#f59e0b10] border-[#f59e0b30]',
  WITNESS: 'text-[#06b6d4] bg-[#06b6d410] border-[#06b6d430]',
  VICTIM: 'text-[#22c55e] bg-[#22c55e10] border-[#22c55e30]',
  ASSOCIATE: 'text-[#64748b] bg-[#64748b10] border-[#64748b30]',
};

export default function SuspectNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const [graph, setGraph] = useState<CaseGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 700, h: 400 });

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await getCaseGraph('FIR-2026-DD590181');
        setGraph(data);
      } catch (error) {
        console.error('Failed to load case graph:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGraph();
  }, []);

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDims({ w: rect.width, h: rect.height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scaleX = dims.w / 700;
  const scaleY = dims.h / 440;

  const getNode = (id: string) => {
    const node = graph?.nodes.find((n) => n.id === id);
    if (!node) return undefined;

    const index = graph?.nodes.indexOf(node) ?? 0;
    const count = graph?.nodes.length ?? 1;

    return {
      ...node,
      type:
        node.type === 'victim'
          ? 'victim'
          : node.type === 'suspect'
            ? 'suspect'
            : node.type === 'witness'
              ? 'witness'
              : node.type === 'location'
                ? 'location'
                : 'associate',
      x: 120 + (index / Math.max(count - 1, 1)) * 460,
      y: index % 2 === 0 ? 180 : 300,
    };
  };
  const person = selected ? PERSONS.find((p) => p.id === selected) : null;

  const selectedNode = selected ? getNode(selected) : null;
  const nodes = graph?.nodes ?? [];
  const links = graph?.links ?? [];

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Suspect Relationship Network</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">{loading ? "Loading graph..." : `${graph?.case_id ?? "No case"} · Click any node to view details`}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(NODE_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px] capitalize" style={{ color: colors.text }}>
            <div className="w-3 h-3 rounded-full" style={{ background: colors.fill, border: `1.5px solid ${colors.stroke}` }} />
            {type}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Network */}
        <div className="lg:col-span-2 bg-[#161b26] border border-[#1e293b] rounded overflow-hidden" style={{ height: 440 }}>
          <svg ref={svgRef} width="100%" height="100%" className="cursor-pointer">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d3748" />
              </marker>
            </defs>

            {/* Edges */}
            {links.map((edge, i) => {
              const src = getNode(edge.source);
              const tgt = getNode(edge.target);
              if (!src || !tgt) return null;
              const x1 = src.x * scaleX;
              const y1 = src.y * scaleY;
              const x2 = tgt.x * scaleX;
              const y2 = tgt.y * scaleY;
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x={mx} y={my - 4} fill="#334155" fontSize="8" textAnchor="middle">{edge.label}</text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((rawNode) => {
              const node = getNode(rawNode.id);
              if (!node) return null;

              const colors = NODE_COLORS[node.type] ?? NODE_COLORS.associate;
              const nx = node.x * scaleX;
              const ny = node.y * scaleY;
              const isSelected = selected === node.id;
              const lines = node.label.split('\n');
              return (
                <g key={node.id} onClick={() => setSelected(selected === node.id ? null : node.id)} className="cursor-pointer">
                  <circle
                    cx={nx} cy={ny} r={isSelected ? 28 : 22}
                    fill={colors.fill}
                    stroke={isSelected ? colors.stroke : colors.stroke + '80'}
                    strokeWidth={isSelected ? 2 : 1.5}
                    className="transition-all"
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={nx} y={ny + (lines.length === 1 ? 4 : li * 12 - 4)}
                      fill={colors.text}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
          {!selected && (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-[#334155] text-[12px]">Click a node to view entity details</div>
              </div>
            </div>
          )}
          {selected && !person && selectedNode && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-semibold text-white">{selectedNode.label.replace('\n', ' ')}</div>
                <button onClick={() => setSelected(null)}><X size={14} className="text-[#475569]" /></button>
              </div>
              <div className="text-[11px] text-[#475569] capitalize">{selectedNode.type}</div>
              <div className="mt-3 text-[11px] text-[#64748b]">
                {selectedNode.type === 'vehicle' && 'Motorcycle MP04AB1234. Registered to Arun Chauhan. Observed at scene and toll plaza.'}
                {selectedNode.type === 'location' && 'Central Market, MP Nagar — primary crime scene. Multiple evidence items collected here.'}
              </div>
            </div>
          )}
          {person && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-semibold text-white">{person.name}</div>
                <button onClick={() => setSelected(null)}><X size={14} className="text-[#475569]" /></button>
              </div>
              <span className={`text-[9px] border rounded px-1.5 py-0.5 font-semibold uppercase ${ROLE_COLOR[person.role]}`}>
                {person.role.replace(/_/g, ' ')}
              </span>

              <div className="mt-3 space-y-2 text-[11px]">
                {person.age && (
                  <div className="flex justify-between"><span className="text-[#475569]">Age</span><span className="text-[#94a3b8] font-mono">{person.age}</span></div>
                )}
                {person.address && person.address !== 'Unknown' && (
                  <div><span className="text-[#475569]">Address</span><div className="text-[#94a3b8] font-mono mt-0.5">{person.address}</div></div>
                )}
                {person.phone && person.phone !== 'Unknown' && (
                  <div className="flex justify-between"><span className="text-[#475569]">Phone</span><span className="text-[#94a3b8] font-mono">{person.phone}</span></div>
                )}
              </div>

              {person.description && (
                <div className="mt-3">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Description</div>
                  <div className="text-[11px] text-[#64748b] leading-snug">{person.description}</div>
                </div>
              )}

              {person.notes && (
                <div className="mt-3">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Investigator Notes</div>
                  <div className="text-[11px] text-[#94a3b8] italic leading-snug">{person.notes}</div>
                </div>
              )}

              {person.linkedEvidence.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Linked Evidence</div>
                  <div className="flex flex-wrap gap-1">
                    {person.linkedEvidence.map((ev) => (
                      <span key={ev} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{ev}]</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 text-[10px] text-[#334155] bg-[#0d1117] border border-[#1e293b] rounded p-2">
                Status: <span className="text-[#64748b]">{person.status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
