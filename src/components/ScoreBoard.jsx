import React, { useState, useEffect } from 'react';
import { Shield, CloudSun, Flame, Zap } from 'lucide-react';

export default function ScoreBoard({ crowdPercentage = 88, ecoPower = 4.8, safetyLevel = 99.8 }) {
  const [matchTime, setMatchTime] = useState('67:24');

  // Simulate football match timer running
  useEffect(() => {
    const timer = setInterval(() => {
      const parts = matchTime.split(':');
      let min = parseInt(parts[0], 10);
      let sec = parseInt(parts[1], 10);
      sec += 1;
      if (sec >= 60) {
        sec = 0;
        min += 1;
      }
      const minStr = min < 10 ? `0${min}` : min;
      const secStr = sec < 10 ? `0${sec}` : sec;
      setMatchTime(`${minStr}:${secStr}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [matchTime]);

  return (
    <div className="glass-panel border-fifa-blue/50 text-white p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 w-full shadow-2xl relative overflow-hidden">
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20"></div>

      {/* Match Title & Broadcast Graphic */}
      <div className="flex items-center gap-3">
        {/* FIFA logo mockup */}
        <div className="bg-fifa-blue px-2.5 py-1 rounded text-[10px] font-black tracking-widest text-white border border-white/20 uppercase shadow-glow-blue fifa-skew">
          <div className="fifa-skew-inner">FIFA WC26</div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Stadium Hub Live</span>
          <span className="text-xs font-bold text-fifa-gold">METLIFE ARENA, NYNJ</span>
        </div>
      </div>

      {/* Main Scoreboard HUD */}
      <div className="flex items-center gap-4 bg-fifa-navy border border-fifa-cardLight px-4 py-2 rounded-md shadow-inner">
        {/* Home Team */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider text-white">ARG</span>
          <div className="w-4 h-3 bg-sky-400 border border-white/40"></div>
        </div>

        {/* Score & Time Display */}
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded border border-white/5 font-mono text-lg font-black text-fifa-neon">
          <span>2</span>
          <span className="text-white/30 animate-pulse">:</span>
          <span>1</span>
          <span className="text-xs font-normal text-white/60 ml-2 border-l border-white/20 pl-2 tracking-widest">
            {matchTime}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-[#0055ff] border border-white/40"></div>
          <span className="text-xs font-black tracking-wider text-white">FRA</span>
        </div>
      </div>


      {/* Live Stadium Metrics */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        {/* Crowd Capacity */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-fifa-navy border border-white/5">
          <Flame size={14} className="text-red-500" />
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase">Crowd Rate</span>
            <span className="font-bold text-white">{crowdPercentage}% <span className="text-[10px] font-normal text-white/50">(68,450)</span></span>
          </div>
        </div>

        {/* Solar Power Generator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-fifa-navy border border-white/5">
          <Zap size={14} className="text-fifa-gold" />
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase">Clean Energy</span>
            <span className="font-bold text-fifa-gold">{ecoPower} MW</span>
          </div>
        </div>

        {/* Safety System Level */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-fifa-navy border border-white/5">
          <Shield size={14} className="text-fifa-neon" />
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase">Safety Rating</span>
            <span className="font-bold text-fifa-neon">{safetyLevel}%</span>
          </div>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-fifa-navy border border-white/5">
          <CloudSun size={14} className="text-sky-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase">Stadium Environment</span>
            <span className="font-bold text-white">22°C (Roof Open)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
