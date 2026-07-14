import React from 'react';
import { AlertTriangle, Play, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function FootballCard({ strategy, onDeploy }) {
  return (
    <div className="glass-panel border-l-4 border-l-fifa-gold border-white/10 p-3.5 rounded-lg flex flex-col justify-between h-[155px] hover:border-fifa-neon transition-all duration-300 relative">
      {/* Decorative scanline */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-5"></div>

      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-fifa-gold font-extrabold uppercase tracking-widest leading-none">
            Tactical Advisory {strategy.code}
          </span>
          <h4 className="text-xs font-black text-white mt-1 uppercase tracking-wider">{strategy.title}</h4>
        </div>
        <div className={`p-1 rounded text-xs ${
          strategy.severity === 'high' 
            ? 'bg-red-950/60 border border-red-500/30 text-red-400' 
            : 'bg-fifa-navy border border-fifa-blue/30 text-fifa-blue'
        }`}>
          <AlertTriangle size={14} />
        </div>
      </div>

      {/* Strategy Content */}
      <div className="my-2 text-[11px] leading-relaxed">
        <p className="text-white/60">
          <strong className="text-white font-semibold">Issue: </strong> 
          {strategy.issue}
        </p>
        <p className="text-fifa-neon font-medium mt-1">
          <strong className="text-white font-semibold">AI Playbook: </strong> 
          {strategy.action}
        </p>
      </div>

      {/* Deploy Button */}
      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
        <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase font-semibold">
          <span>Confidence:</span>
          <span className="text-fifa-neon font-bold">{strategy.matchConfidence}%</span>
        </div>
        
        <button
          onClick={() => onDeploy && onDeploy(strategy)}
          disabled={strategy.deployed}
          className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 border ${
            strategy.deployed
              ? 'bg-emerald-950/40 text-fifa-neon border-fifa-neon/30 cursor-default'
              : 'bg-fifa-gold hover:bg-yellow-500 text-fifa-dark border-fifa-gold hover:shadow-glow-gold active:scale-95 cursor-pointer'
          }`}
        >
          {strategy.deployed ? (
            <>
              <CheckCircle2 size={12} />
              <span>Deployed</span>
            </>
          ) : (
            <>
              <Play size={10} fill="currentColor" />
              <span>Deploy Play</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
