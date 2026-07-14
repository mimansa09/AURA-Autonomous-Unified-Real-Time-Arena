import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, MessageSquare, Volume2, Globe, Sparkles, X, Mic } from 'lucide-react';
import { auraBrain } from '../ai/auraBrain';

export default function StadiumAssistant({ onRouteSelect, stadiumState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "AURA Commentator Booth is online! 🎙️ Need directions to Seat B21, wheelchair support, concessions, or announcement translations? Ask me, and I'll plot your route live on the pitch!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Commentator beep sound effect using Web Audio API
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime); // Radio frequency beep
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context blocked
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    playBeep();

    try {
      // Query central AURA Brain
      const response = await auraBrain.processMessage(text, stadiumState);
      
      // Delay slightly to simulate AI thinking
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'assistant',
          text: response.text
        }]);

        // Synthesize commentator voice audio beep pulse
        playBeep();

        // If path routes are returned, trigger the 3D visual rendering
        if (response.route) {
          // If the query involved wheelchair/accessibility, pass flag to route
          const isAccessibility = text.toLowerCase().includes('wheelchair') || text.toLowerCase().includes('disabled') || text.toLowerCase().includes('elderly');
          onRouteSelect(isAccessibility ? `${response.route} ♿` : response.route, response.focus);
        }
      }, 700);

    } catch (err) {
      setIsThinking(false);
      console.error(err);
    }
  };

  const sampleQueries = [
    { label: "📍 Locate Seat B21", query: "Guide me to Seat Block B21" },
    { label: "♿ Wheelchair Assist", query: "I need wheelchair assistance" },
    { label: "🍔 Vegan Food", query: "Where is vegetarian food?" },
    { label: "📢 Translate PA", query: "Translate stadium announcement" }
  ];

  return (
    <>
      {/* 1. FLOATING FOOTBALL BUTTON (Stadium Identity) */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); playBeep(); }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-fifa-neon hover:bg-emerald-400 text-fifa-dark border-4 border-[#0c1d3c] flex items-center justify-center shadow-glow-neon active:scale-95 transition-all duration-300 group cursor-pointer"
        >
          {/* Soccer ball pattern SVG inside button */}
          <svg className="w-9 h-9 text-fifa-dark animate-spin-slow group-hover:scale-110 transition-transform" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="none" />
            <polygon points="50,30 38,38 43,54 57,54 62,38" />
            <line x1="50" y1="30" x2="50" y2="8" stroke="currentColor" strokeWidth="4" />
            <line x1="38" y1="38" x2="16" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="62" y1="38" x2="84" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="43" y1="54" x2="28" y2="78" stroke="currentColor" strokeWidth="4" />
            <line x1="57" y1="54" x2="72" y2="78" stroke="currentColor" strokeWidth="4" />
          </svg>
          {/* Label tooltip */}
          <span className="absolute -top-9 bg-fifa-navy border border-fifa-gold text-fifa-gold text-[9px] font-black py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider shadow">
            ASK AURA STRIKER 🎙️
          </span>
        </button>
      )}

      {/* 2. COMMENTATOR BOOTH CONSOLE CHAT PANEL */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[340px] h-[440px] bg-fifa-dark border-2 border-fifa-gold/40 rounded-xl overflow-hidden shadow-glow-gold flex flex-col justify-between glass-panel-heavy animate-fade-in">
          {/* Panel Header styled like broadcaster monitor */}
          <div className="bg-gradient-to-r from-fifa-navy to-black p-3 border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-fifa-gold flex items-center justify-center border border-white/10 shadow-glow-gold">
                  <Mic size={16} className="text-fifa-dark" />
                </div>
                {/* blinking recording indicator */}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-fifa-dark animate-ping"></span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-fifa-dark"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">AURA STRIKER</h3>
                  <span className="bg-red-950 text-red-500 border border-red-500/20 text-[7px] font-extrabold px-1 rounded-sm tracking-widest uppercase">
                    ON AIR
                  </span>
                </div>
                <span className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Announcer Console</span>
              </div>
            </div>

            {/* Broadcast Frequency Bars (commentator visualizer) */}
            <div className="flex items-end gap-0.5 h-4 px-2">
              <div className="w-0.5 bg-fifa-neon rounded-full h-2.5 animate-pulse"></div>
              <div className="w-0.5 bg-fifa-neon rounded-full h-4 animate-pulse duration-300"></div>
              <div className="w-0.5 bg-fifa-neon rounded-full h-1.5 animate-pulse duration-500"></div>
              <div className="w-0.5 bg-fifa-neon rounded-full h-3 animate-pulse duration-200"></div>
            </div>

            <button 
              onClick={() => { setIsOpen(false); playBeep(); }}
              className="p-1 hover:bg-white/10 rounded transition-all text-white/50 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-fifa-blue text-white rounded-tr-none border border-white/10 shadow-lg font-semibold'
                    : 'bg-fifa-cardLight/70 text-white rounded-tl-none border border-white/5'
                }`}>
                  {/* Format newlines */}
                  {msg.text.split('\n').map((str, index) => (
                    <p key={index} className={index > 0 ? "mt-1.5" : ""}>{str}</p>
                  ))}
                </div>
                <span className="text-[7px] text-white/30 mt-1 uppercase font-semibold tracking-widest font-mono">
                  {msg.sender === 'user' ? 'VIP GUEST' : 'STRIKER [COMM]'}
                </span>
              </div>
            ))}

            {/* AI thinking state */}
            {isThinking && (
              <div className="self-start flex flex-col items-start max-w-[85%]">
                <div className="p-2.5 rounded-lg bg-fifa-cardLight/70 text-white/50 rounded-tl-none border border-white/5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fifa-neon animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-fifa-neon animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-fifa-neon animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[9px] font-mono tracking-widest ml-1">AI THINKING...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commentator actions */}
          <div className="px-2 py-1.5 bg-black/40 border-t border-white/5 flex gap-1 overflow-x-auto scrollbar-none whitespace-nowrap">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="px-2 py-1 rounded bg-fifa-navy border border-fifa-blue/20 text-white/80 hover:text-white text-[9px] font-bold transition-all hover:bg-fifa-blue hover:border-fifa-blue cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Announcer mic input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="p-2.5 border-t border-white/10 bg-fifa-navy flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Striker (e.g. Find Seat B21...)"
              className="flex-1 bg-black/50 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-fifa-gold font-medium"
            />
            <button 
              type="submit"
              className="bg-fifa-gold hover:bg-yellow-500 active:scale-95 text-fifa-dark font-black p-2 rounded transition-all shadow-glow-gold flex items-center justify-center cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
