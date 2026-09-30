import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Eye, EyeOff } from 'lucide-react';
import { CCTV_STATS, CCTV_EVENTS, CCTV_DETECTIONS } from '../data/cctv';

const EVENT_TYPE_COLOR: Record<string, string> = {
  PERSON: 'text-[#ef4444]',
  VEHICLE: 'text-[#f59e0b]',
  PLATE: 'text-[#8b5cf6]',
  EVENT: 'text-[#06b6d4]',
};

export default function CCTVIntelligence() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBboxes, setShowBboxes] = useState(true);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleVideoUpload = (file: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setPlaying(false);
    setProgress(0);
  };

  const toggleVideo = async () => {
    if (!videoRef.current || !videoUrl) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(
      100,
      Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
    );

    setProgress(pct);

    if (videoRef.current?.duration) {
      videoRef.current.currentTime =
        (pct / 100) * videoRef.current.duration;
    }
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.max(
      0,
      Math.min(
        videoRef.current.duration || Infinity,
        videoRef.current.currentTime + seconds
      )
    );
  };

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">
          CCTV Intelligence
        </h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">
          EV-1024 · MP Nagar Chowk Camera #7 · 08 Sep 2026
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">

          {/* Video */}
          <div
            className="relative bg-[#0a0f1a] border border-[#1e293b] rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                  setPlaying(false);
                  setProgress(100);
                }}
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;

                  if (video.duration) {
                    setProgress(
                      (video.currentTime / video.duration) * 100
                    );
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0f1a] via-[#0d1520] to-[#080d14]">
                <div className="text-center">
                  <div className="text-[#475569] text-sm font-mono mb-3">
                    No CCTV footage loaded
                  </div>

                  <label className="inline-block px-4 py-2 rounded border border-[#334155] bg-[#161b26] text-[11px] text-[#94a3b8] cursor-pointer hover:border-[#7c3aed] hover:text-white">
                    Upload CCTV Footage
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {videoUrl && (
              <>
                <div className="absolute top-3 left-3 font-mono text-[10px] text-[#22c55e] bg-black/60 px-2 py-1 rounded">
                  CAM-07 · MP NAGAR CHOWK
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] text-[#ef4444] bg-black/60 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                  PLAYBACK
                </div>

                {showBboxes && (
                  <>
                    <div
                      className="absolute border border-[#f59e0b]"
                      style={{
                        left: '38%',
                        top: '35%',
                        width: '22%',
                        height: '40%',
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] font-mono bg-[#f59e0b] text-black px-1">
                        VEHICLE
                      </span>
                    </div>

                    <div
                      className="absolute border border-[#ef4444]"
                      style={{
                        left: '44%',
                        top: '28%',
                        width: '8%',
                        height: '22%',
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] font-mono bg-[#ef4444] text-white px-1">
                        PERSON
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Upload */}
          <div className="flex items-center gap-3">
            <label className="px-3 py-2 rounded border border-[#334155] bg-[#161b26] text-[11px] text-[#94a3b8] cursor-pointer hover:border-[#7c3aed] hover:text-white">
              {videoFile ? 'Change Footage' : 'Upload Footage'}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
              />
            </label>

            {videoFile && (
              <span className="text-[10px] text-[#64748b] font-mono truncate">
                {videoFile.name}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="bg-[#161b26] border border-[#1e293b] rounded p-3 space-y-2">
            <div
              className="relative h-1.5 bg-[#1e293b] rounded-full cursor-pointer"
              onClick={scrub}
            >
              <div
                className="h-full bg-[#7c3aed] rounded-full"
                style={{ width: `${progress}%` }}
              />

              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white shadow"
                style={{
                  left: `${progress}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => seek(-10)}
                  className="text-[#64748b] hover:text-[#94a3b8]"
                >
                  <SkipBack size={15} />
                </button>

                <button
                  onClick={toggleVideo}
                  disabled={!videoUrl}
                  className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white hover:bg-[#6d28d9] disabled:opacity-40"
                >
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                </button>

                <button
                  onClick={() => seek(10)}
                  className="text-[#64748b] hover:text-[#94a3b8]"
                >
                  <SkipForward size={15} />
                </button>
              </div>

              <div className="font-mono text-[11px] text-[#475569]">
                {videoRef.current && Number.isFinite(videoRef.current.duration)
                  ? `${Math.floor(videoRef.current.currentTime)}s / ${Math.floor(videoRef.current.duration)}s`
                  : '00s / --'}
              </div>

              <button
                onClick={() => setShowBboxes(!showBboxes)}
                className="flex items-center gap-1.5 text-[11px] text-[#64748b] hover:text-[#94a3b8]"
              >
                {showBboxes ? <Eye size={13} /> : <EyeOff size={13} />}
                Detections {showBboxes ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'People', value: CCTV_STATS.people, color: '#ef4444' },
              { label: 'Vehicles', value: CCTV_STATS.vehicles, color: '#f59e0b' },
              { label: 'Plates', value: CCTV_STATS.plates, color: '#8b5cf6' },
              { label: 'Events', value: CCTV_STATS.events, color: '#06b6d4' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-[#161b26] border border-[#1e293b] rounded p-3 text-center"
              >
                <div
                  className="text-xl font-bold font-mono"
                  style={{ color }}
                >
                  {value}
                </div>
                <div className="text-[10px] text-[#475569] mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">
            Detection Events
          </div>

          <div className="space-y-2">
            {CCTV_EVENTS.map((ev, i) => (
              <button
                key={i}
                onClick={() =>
                  setActiveEvent(activeEvent === i ? null : i)
                }
                className={`w-full text-left px-3 py-2.5 rounded border transition-colors ${
                  activeEvent === i
                    ? 'border-[#7c3aed] bg-[#1a1033]'
                    : 'border-[#1e293b] hover:border-[#2d3748] hover:bg-[#1e293b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#475569] shrink-0">
                    {ev.timestamp}
                  </span>

                  <span
                    className={`text-[9px] font-semibold uppercase ${EVENT_TYPE_COLOR[ev.type]}`}
                  >
                    {ev.type}
                  </span>

                  <span className="ml-auto font-mono text-[10px] text-[#334155]">
                    {ev.confidence}%
                  </span>
                </div>

                <div className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                  {ev.description}
                </div>
              </button>
            ))}
          </div>

          {/* Detections */}
          <div className="mt-4 pt-4 border-t border-[#1e293b]">
            <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">
              Active Detections
            </div>

            <div className="space-y-2">
              {CCTV_DETECTIONS.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ background: d.color }}
                  />

                  <span className="text-[11px] text-[#94a3b8] flex-1 truncate">
                    {d.label}
                  </span>

                  <span
                    className="font-mono text-[10px]"
                    style={{ color: d.color }}
                  >
                    {d.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
