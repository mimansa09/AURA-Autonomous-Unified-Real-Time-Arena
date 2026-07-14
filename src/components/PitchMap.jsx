import React, { useState } from 'react';
import { Compass, Navigation, Eye, UserCheck, Timer, ShieldAlert } from 'lucide-react';

export default function PitchMap({ onSelectZone, stadiumState }) {
  const [activeZone, setActiveZone] = useState('seating');

  // Realistic World Cup stadium grid data with AI routing statistics
  const zones = [
    { 
      id: 'seating', 
      label: 'Seat Block C24', 
      icon: '🏟️', 
      desc: 'Block C Row 12 Seat 24 Seating stand', 
      focus: 'seating',
      aiAnalysis: {
        path: "Gate A -> North-East Ramp -> Section 12",
        wait: "5 mins walking ETA",
        crowd: "OPTIMAL (76% density)",
        access: "Elevator East is fully operational"
      }
    },
    { 
      id: 'gate-a', 
      label: 'Gate A Entrance', 
      icon: '🚪', 
      desc: 'General North-East Fan Entrypoint', 
      focus: 'gate-a',
      aiAnalysis: {
        path: "Perimeter Road A -> Ingress lane 1-8",
        wait: "1 min wait time",
        crowd: "NOMINAL (32% traffic pressure)",
        access: "Level pathway with braille reader columns"
      }
    },
    { 
      id: 'gate-b', 
      label: 'Gate B Entrance', 
      icon: '🚪', 
      desc: 'General South-East Fan Entrypoint', 
      focus: 'gate-b',
      aiAnalysis: {
        path: "Subway exit corridor -> Gate B",
        wait: "2 mins wait time",
        crowd: "STEADY (55% traffic pressure)",
        access: "Wheelchair ramps and low-counter ticket boxes"
      }
    },
    { 
      id: 'food', 
      label: 'Food Counters', 
      icon: '🍔', 
      desc: 'Burger Zone & Pizza Concessions', 
      focus: 'food',
      aiAnalysis: {
        path: "West Concourse -> Concession Row",
        wait: "3 mins queue waiting",
        crowd: "MODERATE (62% congestion)",
        access: "Priority accessibility serving queues active"
      }
    },
    { 
      id: 'restrooms', 
      label: 'Restrooms', 
      icon: '🚻', 
      desc: 'Public restrooms & sanitary zones', 
      focus: 'restrooms',
      aiAnalysis: {
        path: "Main concourse sectors 1-4",
        wait: "1 min wait",
        crowd: "LOW (20% load)",
        access: "All cubicles equipped with grab bars"
      }
    },
    { 
      id: 'access', 
      label: 'Elevators ♿', 
      icon: '♿', 
      desc: 'Wheelchair corridors and elevator bays', 
      focus: 'sustainability',
      aiAnalysis: {
        path: "All gates -> Elevator East/West shafts",
        wait: "2 mins wait time",
        crowd: "CLEAR",
        access: "Elevators have backup generator protection"
      }
    }
  ];

  const handleZoneClick = (zone) => {
    setActiveZone(zone.id);
    if (onSelectZone) {
      // Translate zone ID to route target name
      let routeTargetName = "Seat Block C Row 12 Seat 24";
      if (zone.id === 'food') routeTargetName = "Food Counter";
      if (zone.id === 'restrooms') routeTargetName = "Restroom Area";
      if (zone.id === 'gate-b') routeTargetName = "Gate B";
      if (zone.id === 'gate-a') routeTargetName = "Gate A";
      if (zone.id === 'access') routeTargetName = "Seat Block C Row 12 Seat 24"; // will trigger accessibility route

      // If accessibility was clicked, trigger accessibility override route
      onSelectZone(routeTargetName, zone.focus, zone.id === 'access');
    }
  };


  const activeZoneData = zones.find(z => z.id === activeZone) || zones[0];

  return (
    <div className="glass-panel border-fifa-blue/40 p-4 rounded-xl shadow-2xl relative flex flex-col justify-between h-full">
      <div className="absolute inset-0 scanlines pointer-events-none opacity-5"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
          <Compass size={14} className="text-fifa-gold" />
          <span>Intelligent Stadium Map</span>
        </h3>
        <span className="text-[9px] text-fifa-gold font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/5 uppercase">
          AI spatial analysis
        </span>
      </div>

      {/* Grid selector buttons */}
      <div className="grid grid-cols-3 gap-1.5 my-3">
        {zones.map((zone) => {
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-fifa-blue text-white border-fifa-blue shadow-glow-blue scale-105 font-bold'
                  : 'bg-fifa-navy border-white/10 hover:border-fifa-blue/50 text-white/80'
              }`}
            >
              <span className="text-lg mb-1">{zone.icon}</span>
              <span className="text-[8px] font-black tracking-wide leading-tight truncate w-full">
                {zone.label.replace(" Entrance", "")}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI Telemetry Analysis HUD panel */}
      <div className="bg-black/55 border border-white/15 rounded-lg p-3 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-neon animate-ping"></span>
            <span className="text-[9px] font-black text-fifa-neon tracking-widest uppercase">
              AURA Spatial Diagnostics
            </span>
          </div>
          <span className="text-[8px] text-white/40 uppercase font-mono">
            {activeZoneData.focus.replace("-", " ")}
          </span>
        </div>

        <p className="text-[10px] text-white/70 font-medium italic mb-2">
          "{activeZoneData.desc}"
        </p>

        {/* AI Analytics rows */}
        <div className="space-y-1.5 text-[9px]">
          <div className="flex items-start gap-2">
            <Navigation size={10} className="text-fifa-gold mt-0.5 shrink-0" />
            <p className="text-white/60">
              <strong className="text-white font-black">Path: </strong>
              {activeZoneData.aiAnalysis.path}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Timer size={10} className="text-fifa-gold mt-0.5 shrink-0" />
            <p className="text-white/60">
              <strong className="text-white font-black">ETA: </strong>
              {activeZoneData.aiAnalysis.wait}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Eye size={10} className="text-fifa-gold mt-0.5 shrink-0" />
            <p className="text-white/60">
              <strong className="text-white font-black">Traffic: </strong>
              <span className={activeZoneData.aiAnalysis.crowd.includes("CONGESTED") || activeZoneData.aiAnalysis.crowd.includes("CRITICAL") ? "text-red-400 font-bold" : "text-fifa-neon"}>
                {activeZoneData.aiAnalysis.crowd}
              </span>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <UserCheck size={10} className="text-[#a855f7] mt-0.5 shrink-0" />
            <p className="text-white/60">
              <strong className="text-white font-black">Inclusive: </strong>
              {activeZoneData.aiAnalysis.access}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[8.5px] text-white/45 flex items-center gap-1">
        <ShieldAlert size={10} className="text-fifa-gold" />
        <span>Tactical route lines will draw automatically in green/purple.</span>
      </div>
    </div>
  );
}
