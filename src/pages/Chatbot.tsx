import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldAlert } from 'lucide-react';
import { QUICK_PROMPTS, MOCK_RESPONSES, ChatMessage } from '../data/chat';

let msgId = 0;

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Investigation query assistant for **CR-2026-0142** (Central Market Robbery, MP Nagar).

I can answer questions about this case using verified evidence from the case file. All responses include source evidence references.

**Examples you can ask:**
- Who was present near Central Market after 8 PM?
- Show all persons linked to motorcycle MP04AB1234
- Summarize witness statements

⚠️ All AI findings must be verified against source evidence before operational use.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: `u-${++msgId}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate streaming
    await new Promise((r) => setTimeout(r, 1200));

    const lower = text.toLowerCase();
    let key: keyof typeof MOCK_RESPONSES = 'default';
    if (lower.includes('motorcycle') || lower.includes('vehicle') || lower.includes('mp04')) key = 'motorcycle';
    if (lower.includes('witness') || lower.includes('statement')) key = 'witness';

    const response = MOCK_RESPONSES[key];
    const aiMsg: ChatMessage = {
      id: `a-${++msgId}`,
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      evidenceTags: response.evidenceTags,
    };
    setMessages((m) => [...m, aiMsg]);
    setLoading(false);
  };

  const renderContent = (text: string) => {
    // Bold and evidence tag rendering
    const parts = text.split(/(\*\*[^*]+\*\*|\[EV-\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (/^\[EV-\d+\]$/.test(part)) {
        return (
          <span key={i} className="text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 py-0.5 rounded font-mono text-[10px]">{part}</span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#1e293b] shrink-0">
        <h1 className="text-[14px] font-semibold text-white">Investigation Chat — CR-2026-0142</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <p className="text-[11px] text-[#475569] font-mono">AI Assistant · Verified case data only</p>
        </div>
      </div>

      {/* Safety banner */}
      <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 bg-[#1a1033] border border-[#2d1f5e] rounded text-[11px] text-[#a78bfa] shrink-0">
        <ShieldAlert size={13} className="shrink-0" />
        AI assists investigators — all findings must be verified against source evidence. Evidence citations ([EV-xxxx]) indicate source documents.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded shrink-0 bg-[#1a1033] border border-[#2d1f5e] flex items-center justify-center text-[10px] font-bold text-[#7c3aed] mt-0.5">AI</div>
              )}
              <div className={`max-w-2xl ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded px-3.5 py-2.5 text-[12px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#1a1033] border border-[#2d1f5e] text-[#c4b5fd]'
                      : 'bg-[#161b26] border border-[#1e293b] text-[#94a3b8]'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-[#334155] font-mono">{msg.timestamp}</span>
                  {msg.evidenceTags && msg.evidenceTags.length > 0 && (
                    <div className="flex gap-1">
                      {msg.evidenceTags.map((ev) => (
                        <span key={ev} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{ev}]</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded shrink-0 bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-[#7c3aed] mt-0.5">RD</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded shrink-0 bg-[#1a1033] border border-[#2d1f5e] flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">AI</div>
            <div className="bg-[#161b26] border border-[#1e293b] rounded px-4 py-2.5 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-5 py-2 border-t border-[#1e293b] shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={loading}
              className="shrink-0 px-2.5 py-1 bg-[#161b26] border border-[#1e293b] rounded text-[10px] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-[#1e293b] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this case — suspects, evidence, timeline..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-[#161b26] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] placeholder-[#334155] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded bg-[#7c3aed] text-white flex items-center justify-center hover:bg-[#6d28d9] transition-colors disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
