import React from 'react';
import { Shield, Zap, RefreshCw, UserCheck, Flame } from 'lucide-react';

export default function AgentPlayerCard({ agent }) {
  // Map icons for agents
  const getIcon = (role) => {
    switch (role) {
      case 'safety':
        return <Shield className="text-red-400" size={16} />;
      case 'eco':
        return <Zap className="text-fifa-gold" size={16} />;
      case 'route':
        return <RefreshCw className="text-fifa-blue" size={16} />;
      case 'access':
        return <UserCheck className="text-[#a855f7]" size={16} />;
      case 'crowd':
        return <Flame className="text-fifa-neon" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[180px] h-[280px] bg-gradient-to-b from-fifa-navy to-black border-2 border-fifa-gold/40 rounded-xl relative card-shimmer flex flex-col items-center justify-between p-2.5 transition-all duration-300 hover:border-fifa-gold hover:-translate-y-2 hover:shadow-glow-gold">
      
      {/* Top Card HUD: OVR Rating & Position */}
      <div className="w-full flex items-start justify-between border-b border-white/10 pb-1.5">
        <div className="flex flex-col items-center">
          <span className="text-xl font-black text-fifa-gold leading-none">{agent.ovr}</span>
          <span className="text-[9px] text-white/50 font-bold tracking-widest">{agent.position}</span>
        </div>
        <div className="p-1 rounded bg-black/40 border border-white/5 shadow-inner">
          {getIcon(agent.roleType)}
        </div>
      </div>

      {/* Agent Photo Mock / Mascot Sphere */}
      <div className="relative my-2 w-16 h-16 rounded-full bg-gradient-to-tr from-fifa-blue/40 to-fifa-neon/20 flex items-center justify-center border-2 border-fifa-gold/20 shadow-lg">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-fifa-neon/10 to-transparent blur-md"></div>
        {/* Procedural player jersey design inside card */}
        <svg className="w-12 h-12 text-white/80" viewBox="0 0 100 100">
          {/* Jersey */}
          <path d="M 30,100 L 70,100 L 70,60 L 90,45 L 80,30 L 65,40 L 65,25 L 35,25 L 35,40 L 20,30 L 10,45 L 30,60 Z" fill="#081229" stroke="#eab308" strokeWidth="2" />
          {/* Stripe */}
          <rect x="46" y="25" width="8" height="75" fill="#00ff66" />
          {/* Collars */}
          <polygon points="35,25 50,45 65,25" fill="#eab308" />
        </svg>
        <span className="absolute -bottom-1 px-1.5 py-0.5 rounded bg-fifa-gold text-[8px] font-black text-fifa-dark tracking-widest">
          {agent.number}
        </span>
      </div>

      {/* Agent Name */}
      <div className="text-center w-full">
        <h4 className="text-[11px] font-black text-white uppercase tracking-wider truncate">{agent.name}</h4>
        <span className="text-[8px] text-fifa-neon font-semibold tracking-wider block leading-none mt-0.5">
          {agent.role}
        </span>
      </div>

      {/* Stats block (PAC SHO PAS DRI DEF PHY style but for AI) */}
      <div className="w-full grid grid-cols-3 gap-y-1 gap-x-1.5 border-t border-b border-white/10 py-1.5 my-1.5 text-[10px] text-center bg-black/20 rounded">
        <div>
          <span className="text-white/40 block text-[8px]">FLW</span>
          <span className="font-extrabold text-white">{agent.stats.flw}</span>
        </div>
        <div>
          <span className="text-white/40 block text-[8px]">ECO</span>
          <span className="font-extrabold text-white">{agent.stats.eco}</span>
        </div>
        <div>
          <span className="text-white/40 block text-[8px]">SAF</span>
          <span className="font-extrabold text-white">{agent.stats.saf}</span>
        </div>
        <div>
          <span className="text-white/40 block text-[8px]">ACC</span>
          <span className="font-extrabold text-white">{agent.stats.acc}</span>
        </div>
        <div>
          <span className="text-white/40 block text-[8px]">NVR</span>
          <span className="font-extrabold text-white">{agent.stats.nvr}</span>
        </div>
        <div>
          <span className="text-white/40 block text-[8px]">OPS</span>
          <span className="font-extrabold text-white">{agent.stats.ops}</span>
        </div>
      </div>

      {/* Live Action log */}
      <div className="w-full bg-black/60 p-1.5 rounded text-[8px] text-left leading-normal border border-white/5 h-[34px] overflow-hidden flex flex-col justify-center">
        <div className="text-white/40 uppercase font-black tracking-widest text-[6px]">Live Operation</div>
        <div className="text-fifa-gold font-medium truncate mt-0.5">
          📡 {agent.liveAction}
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="w-full mt-1.5">
        <div className="flex justify-between text-[7px] font-bold text-white/50 tracking-wider">
          <span>AI CONFIDENCE</span>
          <span className="text-fifa-neon">{agent.confidence}%</span>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
          <div 
            className="bg-gradient-to-r from-fifa-blue to-fifa-neon h-full rounded-full transition-all duration-500" 
            style={{ width: `${agent.confidence}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
}
