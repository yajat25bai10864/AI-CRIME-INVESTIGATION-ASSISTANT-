import { ShieldAlert } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1a1033] border-b border-[#2d1f5e] text-xs text-[#a78bfa]">
      <ShieldAlert size={13} className="shrink-0 text-[#8b5cf6]" />
      <span>
        <strong className="text-[#c4b5fd] font-semibold">AI assists investigators — humans make the final decisions.</strong>
        {' '}Verify all AI-generated findings against source evidence before operational use.
      </span>
    </div>
  );
}
