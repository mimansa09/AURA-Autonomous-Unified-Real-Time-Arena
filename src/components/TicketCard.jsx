import React from 'react';
import { QrCode, Ticket, MapPin, Calendar, Clock } from 'lucide-react';

export default function TicketCard({ 
  seat = "Block C Row 12 Seat 24", 
  gate = "Gate A", 
  row = "12", 
  section = "East Stand",
  price = "$450.00", 
  onHighlightSeat 
}) {
  return (
    <div className="w-full max-w-sm mx-auto bg-fifa-navy border border-fifa-blue/30 rounded-xl overflow-hidden shadow-2xl ticket-cut relative hover:shadow-glow-blue transition-all duration-300">
      {/* Top Banner with Trophy Background Accent */}
      <div className="bg-gradient-to-r from-fifa-blue via-[#0c1a30] to-fifa-blue p-3 text-center border-b border-white/10 relative">
        <div className="absolute inset-0 scanlines opacity-30"></div>
        <div className="flex items-center justify-center gap-1.5 text-fifa-gold font-extrabold text-[11px] tracking-widest uppercase">
          <Ticket size={12} />
          <span>Official Match Day Ticket</span>
        </div>
        <h3 className="text-sm font-bold text-white mt-1">FIFA WORLD CUP FINAL 2026</h3>
      </div>

      {/* Match Details */}
      <div className="p-4 border-b border-dashed border-white/10 flex flex-col items-center">
        <span className="text-[10px] text-fifa-gold tracking-widest uppercase font-black">Alex | VIP Guest</span>
        <div className="flex items-center gap-4 mt-2 justify-center w-full">
          <div className="text-right w-1/3">
            <h4 className="text-base font-black text-white leading-tight">ARGENTINA</h4>
            <span className="text-[10px] text-white/40">Home</span>
          </div>
          <div className="text-center bg-fifa-cardLight/50 px-2 py-0.5 rounded text-[10px] font-black border border-white/10 text-fifa-gold">
            VS
          </div>
          <div className="text-left w-1/3">
            <h4 className="text-base font-black text-white leading-tight">FRANCE</h4>
            <span className="text-[10px] text-white/40">Away</span>
          </div>
        </div>
      </div>

      {/* Ticket Details Grid */}
      <div className="p-4 grid grid-cols-2 gap-3 text-xs bg-fifa-card/45">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-fifa-gold" />
          <div>
            <p className="text-[9px] text-white/40 uppercase">Date</p>
            <p className="font-bold">July 19, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-fifa-gold" />
          <div>
            <p className="text-[9px] text-white/40 uppercase">Kick-off</p>
            <p className="font-bold">20:00 EST</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-fifa-gold" />
          <div>
            <p className="text-[9px] text-white/40 uppercase">Venue</p>
            <p className="font-bold text-white">MetLife Arena, NYNJ</p>
          </div>
        </div>
        <div>
          <p className="text-[9px] text-white/40 uppercase">Price Category</p>
          <p className="font-bold text-fifa-neon">FINAL - Category 1</p>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="h-0 border-t-2 border-dashed border-white/20 my-1 mx-4"></div>

      {/* Seating Parameters & Dynamic Highlight Button */}
      <div className="p-4 bg-fifa-card text-center relative">
        <div className="grid grid-cols-3 gap-2 border border-white/10 rounded-lg p-2 bg-black/30">
          <div>
            <span className="text-[9px] text-white/40 uppercase block">Gate</span>
            <span className="text-xs font-black text-white">Gate A</span>
          </div>
          <div>
            <span className="text-[9px] text-white/40 uppercase block">Row</span>
            <span className="text-xs font-black text-white">Row 12</span>
          </div>
          <div>
            <span className="text-[9px] text-white/40 uppercase block">Seat</span>
            <span className="text-xs font-black text-fifa-neon">Seat 24</span>
          </div>
        </div>

        {/* Highlight seat action button */}
        <button
          onClick={() => onHighlightSeat && onHighlightSeat("Seat Block C Row 12 Seat 24", "gate-a")}
          className="mt-3 w-full bg-fifa-gold hover:bg-yellow-500 text-fifa-dark font-black text-xs py-2 px-3 rounded border border-white/10 shadow-lg hover:shadow-glow-gold transition-all duration-300 uppercase tracking-widest cursor-pointer"
        >
          🚀 Navigate Me
        </button>
      </div>

      {/* QR Code Segment (Mock Ticket Stub Scan) */}
      <div className="bg-black/60 p-4 border-t border-white/10 flex items-center justify-between gap-4">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-white/40 uppercase font-mono">Security QR Code</span>
          <span className="text-[10px] font-bold text-white/90">AURA-FINAL-2026</span>
          <span className="text-[8px] text-fifa-neon font-mono mt-1">VERIFIED BY AURA</span>
        </div>
        <div className="bg-white p-1 rounded shadow-md select-none">
          {/* Simulated QR Code SVG */}
          <svg className="w-10 h-10 text-black" viewBox="0 0 100 100">
            <rect x="0" y="0" width="20" height="20" fill="currentColor" />
            <rect x="0" y="80" width="20" height="20" fill="currentColor" />
            <rect x="80" y="0" width="20" height="20" fill="currentColor" />
            <rect x="25" y="25" width="50" height="10" fill="currentColor" />
            <rect x="25" y="45" width="20" height="30" fill="currentColor" />
            <rect x="55" y="55" width="30" height="30" fill="currentColor" />
            <rect x="80" y="80" width="10" height="10" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

