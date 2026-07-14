import React, { useState, useEffect } from 'react';
import Stadium3D from './components/3DStadium';
import ScoreBoard from './components/ScoreBoard';
import TicketCard from './components/TicketCard';
import StadiumAssistant from './components/StadiumAssistant';
import FootballCard from './components/FootballCard';
import AgentPlayerCard from './components/AgentPlayerCard';
import PitchMap from './components/PitchMap';
import confetti from 'canvas-confetti';
import { 
  Tv, 
  User, 
  Briefcase, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Leaf, 
  Activity, 
  ShieldCheck, 
  Globe, 
  Languages,
  Sun,
  Moon,
  AlertTriangle,
  Info
} from 'lucide-react';
import { auraBrain } from './ai/auraBrain';

// Multilingual PA Announcements Data
const announcements = {
  en: "PA Announcer: 'Match starts in 10 minutes. Please take your seats.'",
  hi: "PA उद्घोषक: 'मैच 10 मिनट में शुरू होगा। कृपया अपनी सीटें लें।'",
  es: "Locutor PA: 'El partido comienza en 10 minutos. Por favor, tomen sus asientos.'",
  fr: "Annonceur PA: 'Le match commence dans 10 minutes. Veuillez prendre vos places.'",
  ja: "PAアナウンサー：「試合は10分後に開始されます。お席にお着きください。」"
};

// Concessions details
const foodStalls = [
  { name: 'Burger Zone', wait: '25 min', distance: '120m', popularity: '⭐ 4.9', icon: '🍔' },
  { name: 'Pizza Corner', wait: '5 min', distance: '40m', popularity: '⭐ 4.7', icon: '🍕' },
  { name: 'Healthy Bowl', wait: '10 min', distance: '80m', popularity: '⭐ 4.5', icon: '🥗' },
  { name: 'Vegan Area', wait: '8 min', distance: '90m', popularity: '⭐ 4.8', icon: '🥬' }
];

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'fan' | 'command'
  const [introActive, setIntroActive] = useState(true); // Tunnel cam control
  const [soundOn, setSoundOn] = useState(false);
  const [currentLang, setCurrentLang] = useState('en'); // 'en' | 'hi' | 'es' | 'fr' | 'ja'
  const [matchTheme, setMatchTheme] = useState('dark'); // 'dark' | 'light'

  // Navigation route controls
  const [navStart, setNavStart] = useState('Gate A');
  const [navDest, setNavDest] = useState('Seat Block C Row 12 Seat 24');

  // Selected element detailed diagnostics
  const [selectedStadiumElement, setSelectedStadiumElement] = useState(null);
  
  // 3D Stadium state overrides
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [highlightedGate, setHighlightedGate] = useState(null);
  const [cameraFocusZone, setCameraFocusZone] = useState(null);
  const [sustainabilityActive, setSustainabilityActive] = useState(false);
  const [routeTarget, setRouteTarget] = useState(null);

  // Diagnostic states
  const [crowdRate, setCrowdRate] = useState(88);
  const [ecoPower, setEcoPower] = useState(4.8);
  const [safetyLevel, setSafetyLevel] = useState(99.8);
  const [decisionsMade, setDecisionsMade] = useState(124);
  const [energySavedPercent, setEnergySavedPercent] = useState(14);

  // Live simulation variables for organizer command room
  const [totalFans, setTotalFans] = useState(84520);
  const [availableSeats, setAvailableSeats] = useState(1240);
  const [activeGates, setActiveGates] = useState(14);
  const [volunteersCount, setVolunteersCount] = useState(350);
  const [commandAlerts, setCommandAlerts] = useState([
    { id: 1, type: 'info', msg: 'System initializing. Standard ingress flow.' }
  ]);

  // AI agents & strategies
  const [agents, setAgents] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Fan experience tab control
  const [fanTab, setFanTab] = useState('ticket'); // 'ticket' | 'fanDna' | 'squad' | 'capsule'

  // Expansion: 8 AURA FIFA Winning Features states
  const [fanDnaQuestions, setFanDnaQuestions] = useState({
    matchCount: 'Yes',
    family: 'Yes',
    kids: 'No',
    accessibility: 'No',
    food: 'Yes',
    merch: 'Yes',
    crowd: 'No'
  });
  const [fanDnaResult, setFanDnaResult] = useState(null);
  const [userDnaName, setUserDnaName] = useState('MIMANSA');
  const [lostPersonActive, setLostPersonActive] = useState(false);
  const [memoryCapsuleReady, setMemoryCapsuleReady] = useState(false);
  const [shuttleDispatched, setShuttleDispatched] = useState(false);
  const [twinSimulating, setTwinSimulating] = useState(false);
  const [twinStatus, setTwinStatus] = useState('Idle - Ready');
  const [twinTimeSaved, setTwinTimeSaved] = useState(null);
  const [halftimeRushAlert, setHalftimeRushAlert] = useState(true);

  // HUD interactive states
  const [hudFoodSelection, setHudFoodSelection] = useState(null);
  const [hudRestroomSelection, setHudRestroomSelection] = useState(null);
  const [hudMedicalSelection, setHudMedicalSelection] = useState(null);
  const [hudTransportSelection, setHudTransportSelection] = useState(null);

  // Initialize AURA Brain agents & strategies
  useEffect(() => {
    const telemetry = { crowdRate, sustainabilityActive, safetyLevel };
    setAgents(auraBrain.getSquadStatus(telemetry));
    
    // Load strategies
    setStrategies([
      {
        id: 'play-1',
        code: 'PLAY 01',
        title: 'Counter-Pressure Ingress',
        issue: 'Gate C crowd rising rapidly (94% capacity)',
        action: 'Redirect incoming fans to Gate D',
        matchConfidence: 97,
        deployed: false,
        focusZone: 'gate-d',
        gateHighlight: 'gate-d'
      },
      {
        id: 'play-2',
        code: 'PLAY 02',
        title: 'Eco-Stadium Formations',
        issue: 'Peak energy consumption in seating stands',
        action: 'Activate solar roof grids & transition to smart lighting',
        matchConfidence: 99,
        deployed: false,
        focusZone: 'sustainability',
        solarActive: true
      },
      {
        id: 'play-3',
        code: 'PLAY 03',
        title: 'Route-Play Assist',
        issue: 'Wheelchair elevator delay at Sector A',
        action: 'Reroute accessibility visitors and deploy golf shuttles',
        matchConfidence: 94,
        deployed: false,
        focusZone: 'sustainability',
        routeTarget: 'Seat Block C Row 12 Seat 24'
      }
    ]);
  }, []);

  // Update AI agents telemetry when stadium states change
  useEffect(() => {
    const telemetry = { crowdPercentage: crowdRate, gateCPercent: crowdRate > 80 ? 94 : 44, sustainabilityActive, safetyLevel };
    setAgents(auraBrain.getSquadStatus(telemetry));
  }, [crowdRate, sustainabilityActive, safetyLevel]);

  // Simulated AI Event Loop ticker
  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (activeView === 'command') {
        // Randomly adjust safety or eco ratings slightly to look dynamic
        setSafetyLevel(prev => {
          const delta = (Math.random() - 0.5) * 0.4;
          return parseFloat(Math.min(Math.max(prev + delta, 98), 100).toFixed(1));
        });
        setEcoPower(prev => {
          const delta = (Math.random() - 0.5) * 0.1;
          const base = sustainabilityActive ? 6.8 : 4.8;
          return parseFloat((base + delta).toFixed(1));
        });

        // Simulating crowd fluctuation
        setTotalFans(prev => Math.min(Math.max(prev + Math.floor((Math.random() - 0.5) * 80), 83000), 85000));
        setAvailableSeats(prev => Math.min(Math.max(prev + Math.floor((Math.random() - 0.5) * 10), 1100), 1300));

        // Generate Simulated Crowd Intelligence Alerts
        const alertTrigger = Math.random();
        if (alertTrigger > 0.8) {
          const alertsList = [
            "North Stand congestion increasing",
            "Medical assistance requested Zone B",
            "Food demand rising near West Concourse",
            "Elevator East queue wait time reaches 4 mins",
            "Spectator inflow rate normal at Gate A"
          ];
          const chosenAlert = alertsList[Math.floor(Math.random() * alertsList.length)];
          const newAlert = {
            id: Date.now(),
            type: chosenAlert.includes('congestion') || chosenAlert.includes('Medical') ? 'warning' : 'info',
            msg: chosenAlert
          };
          setCommandAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        }
      }
    }, 4000);

    return () => clearInterval(eventTimer);
  }, [activeView, sustainabilityActive]);

  const handleSkipIntro = () => {
    setIntroActive(false);
    setCameraFocusZone(null);
  };

  const handleEnterView = (view, gateId) => {
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0055ff', '#00ff66', '#eab308']
    });
    
    setIntroActive(false);
    setActiveView(view);
    setHighlightedGate(gateId);
    setCameraFocusZone(gateId);
  };

  const handleRouteHighlight = (target, focusZone, accessibilityMode = false) => {
    const fullTargetName = accessibilityMode ? `${target} ♿` : target;
    setRouteTarget(fullTargetName);
    setCameraFocusZone(focusZone);

    if (target.includes('Block C') || target.includes('Seat')) {
      setHighlightedSection('West');
      setHighlightedGate('gate-a');
    } else if (target.includes('Food')) {
      setHighlightedSection(null);
      setHighlightedGate('gate-b');
    } else {
      setHighlightedSection(null);
      setHighlightedGate('gate-b');
    }
  };

  const handleDeployStrategy = (strategy) => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.4, x: 0.75 },
      colors: ['#eab308', '#00ff66', '#0055ff']
    });

    setStrategies(prev => prev.map(s => s.id === strategy.id ? { ...s, deployed: true } : s));
    setDecisionsMade(prev => prev + 1);

    if (strategy.solarActive) {
      setSustainabilityActive(true);
      setEcoPower(6.8);
      setEnergySavedPercent(22);
    }
    if (strategy.gateHighlight) {
      setHighlightedGate(strategy.gateHighlight);
      setCameraFocusZone(strategy.focusZone);
      setCrowdRate(74); // Redirect relief
    }
    if (strategy.routeTarget) {
      setRouteTarget(`${strategy.routeTarget} ♿`); // Direct wheelchair route
      setCameraFocusZone('sustainability'); // Focus elevators
    }
  };

  // Organizer Actions
  const handleOpenGate = () => {
    setActiveGates(prev => Math.min(prev + 1, 16));
    setDecisionsMade(prev => prev + 1);
    setCommandAlerts(prev => [
      { id: Date.now(), type: 'info', msg: 'Gate D additional queue scanners activated.' },
      ...prev
    ]);
    confetti({ particleCount: 30, colors: ['#00ff66'] });
  };

  const handleSendVolunteers = () => {
    setVolunteersCount(prev => prev + 25);
    setDecisionsMade(prev => prev + 1);
    setCommandAlerts(prev => [
      { id: Date.now(), type: 'info', msg: 'Dispaching 25 volunteers to North Stand escalator ramps.' },
      ...prev
    ]);
  };

  const handleRedirectCrowd = () => {
    setCrowdRate(72);
    setDecisionsMade(prev => prev + 1);
    setCommandAlerts(prev => [
      { id: Date.now(), type: 'info', msg: 'Rerouting transit queue flows via automated digital stadium signage.' },
      ...prev
    ]);
  };

  const handleOptimizeEnergy = () => {
    setSustainabilityActive(true);
    setEcoPower(6.8);
    setEnergySavedPercent(25);
    setDecisionsMade(prev => prev + 1);
    setCommandAlerts(prev => [
      { id: Date.now(), type: 'info', msg: 'Adjusting luxury suite lighting grids. Dynamic offsets engaged.' },
      ...prev
    ]);
  };

  const handleBackToLobby = () => {
    setActiveView('landing');
    setRouteTarget(null);
    setHighlightedGate(null);
    setHighlightedSection(null);
    setCameraFocusZone(null);
    setSustainabilityActive(false);
    setCrowdRate(88);
    setEcoPower(4.8);
    setSelectedAgent(null);
    setSelectedStadiumElement(null);
  };

  const agentPlayers = [
    { id: 5, gridArea: 'col-start-2 row-start-1 justify-self-center', positionLabel: 'FWD', name: 'EXPERIENCE STRIKER', num: '09', role: 'Fan experience agent', key: 'access' },
    { id: 1, gridArea: 'col-start-2 row-start-5 justify-self-center', positionLabel: 'GK', name: 'SAFETY KEEPER', num: '01', role: 'Perimeter scanning', key: 'safety' },
    { id: 3, gridArea: 'col-start-3 row-start-3 justify-self-end mr-4', positionLabel: 'MID', name: 'ROUTE PLAYMAKER', num: '08', role: 'Pathfinding engine', key: 'route' },
    { id: 4, gridArea: 'col-start-2 row-start-2 justify-self-center', positionLabel: 'CAP', name: 'CROWD CAPTAIN', num: '10', role: 'Ingress traffic controller', key: 'crowd' },
    { id: 2, gridArea: 'col-start-1 row-start-3 justify-self-start ml-4', positionLabel: 'DEF', name: 'ECO DEFENDER', num: '04', role: 'Solar and sustainability', key: 'eco' }
  ];

  const handleManualNav = () => {
    const isAccessibility = navDest.includes('Elevator') || navDest.includes('♿');
    handleRouteHighlight(navDest, isAccessibility ? 'sustainability' : 'seating', isAccessibility);
  };

  return (
    <div className={`w-screen h-screen overflow-hidden flex flex-col font-sans relative transition-colors duration-500 ${
      matchTheme === 'dark' ? 'bg-[#030611] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* MULTILINGUAL WORLD CUP ANNOUNCEMENT TICKER */}
      {activeView !== 'landing' && (
        <div className={`border-b p-2 px-4 flex items-center justify-between text-xs z-40 select-none ${
          matchTheme === 'dark' ? 'bg-[#0c1a30] border-fifa-blue/35 text-white' : 'bg-slate-200 border-slate-300 text-slate-800'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden w-[70%]">
            <div className="bg-fifa-neon/15 border border-fifa-neon text-fifa-neon px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0 animate-pulse">
              <Languages size={10} />
              <span>Translation Live</span>
            </div>
            <span className="font-semibold truncate font-mono">
              {announcements[currentLang]}
            </span>
          </div>

          {/* Lang Selector flags */}
          <div className="flex items-center gap-1">
            {[
              { id: 'en', label: '🇺🇸 EN' },
              { id: 'hi', label: '🇮🇳 HI' },
              { id: 'es', label: '🇪🇸 ES' },
              { id: 'fr', label: '🇫🇷 FR' },
              { id: 'ja', label: '🇯🇵 JA' }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setCurrentLang(lang.id)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                  currentLang === lang.id
                    ? 'bg-fifa-blue border-fifa-blue text-white shadow shadow-glow-blue scale-105'
                    : 'bg-black/20 border-black/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MATCH THEME TOGGLE & Sound Toggle HUD */}
      <div className="absolute top-12 right-4 z-50 flex items-center gap-2">
        {/* Theme system toggle */}
        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
          <button 
            onClick={() => setMatchTheme('light')}
            className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              matchTheme === 'light' ? 'bg-white text-fifa-dark font-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            ☀️ Day Match
          </button>
          <button 
            onClick={() => setMatchTheme('dark')}
            className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              matchTheme === 'dark' ? 'bg-fifa-navy text-fifa-neon font-black shadow-glow-green border border-fifa-neon/20' : 'text-white/60 hover:text-white'
            }`}
          >
            🌙 Night Match
          </button>
        </div>

        <button 
          onClick={() => setSoundOn(!soundOn)}
          className="p-2 rounded-full bg-fifa-navy/80 border border-white/10 hover:border-fifa-blue text-white transition-all shadow-lg"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* 3D Canvas stadium view */}
        <div className={`relative h-1/2 md:h-full transition-all duration-700 ${
          activeView === 'landing' ? 'w-full' : 'w-full md:w-3/5'
        }`}>
          <Stadium3D
            introActive={introActive}
            setIntroActive={setIntroActive}
            cameraFocusZone={cameraFocusZone}
            highlightedSection={highlightedSection}
            highlightedGate={highlightedGate}
            sustainabilityActive={sustainabilityActive}
            routeTarget={routeTarget}
            crowdRate={crowdRate}
            theme={matchTheme}
            onElementClick={(elem) => setSelectedStadiumElement(elem)}
            onGateClick={(gateId) => {
              if (activeView === 'landing') {
                if (gateId === 'gate-d') {
                  handleEnterView('command', 'gate-d');
                } else {
                  handleEnterView('fan', 'gate-b');
                }
              } else {
                setHighlightedGate(gateId);
                setCameraFocusZone(gateId);
              }
            }}
          />

          {/* Detailed Selected Element HUD overlay */}
          {selectedStadiumElement && (
            <div className="absolute top-16 left-4 z-40 bg-fifa-navy/95 border border-fifa-gold/60 p-4 rounded-xl shadow-glow-gold max-w-sm text-left animate-fade-in text-white glass-panel-heavy">
              <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
                <div>
                  <h3 className="text-sm font-black text-fifa-gold uppercase tracking-wider">{selectedStadiumElement.name}</h3>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">{selectedStadiumElement.desc}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedStadiumElement(null);
                    setHudFoodSelection(null);
                    setHudRestroomSelection(null);
                    setHudMedicalSelection(null);
                    setHudTransportSelection(null);
                  }} 
                  className="text-white/50 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-black/35 p-2 rounded">
                  <span className="text-[8px] text-white/40 block uppercase">Crowd Level</span>
                  <span className="font-extrabold text-fifa-neon">{selectedStadiumElement.crowd}</span>
                </div>
                <div className="bg-black/35 p-2 rounded">
                  <span className="text-[8px] text-white/40 block uppercase">Waiting time</span>
                  <span className="font-extrabold text-fifa-gold">{selectedStadiumElement.wait}</span>
                </div>
              </div>

              {/* INTERACTIVE COMPONENT DETAILS BASED ON SELECTION ID */}
              
              {/* 1. Food Menu Ordering */}
              {selectedStadiumElement.id === 'food' && (
                <div className="mb-3 border-t border-white/15 pt-2.5 space-y-2">
                  <span className="text-[9px] font-black text-fifa-gold uppercase tracking-wider block">🍔 SELECT TO ORDER (AI FOOD MENU):</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                    {[
                      { item: 'AURA Double Burger', price: '$12' },
                      { item: 'Metro Margherita Pizza', price: '$10' },
                      { item: 'Green Pitch Salad', price: '$8' },
                      { item: 'Neon Spark Energy Drink', price: '$4' }
                    ].map(food => (
                      <button
                        key={food.item}
                        onClick={() => {
                          setHudFoodSelection(food.item);
                          confetti({ particleCount: 15, colors: ['#00ff66'] });
                        }}
                        className={`p-1.5 rounded border text-left transition-all cursor-pointer ${
                          hudFoodSelection === food.item
                            ? 'bg-fifa-blue border-fifa-blue text-white'
                            : 'bg-black/40 border-white/10 hover:border-fifa-blue'
                        }`}
                      >
                        <span className="font-bold block truncate">{food.item}</span>
                        <span className="text-[8px] text-fifa-neon">{food.price}</span>
                      </button>
                    ))}
                  </div>
                  {hudFoodSelection && (
                    <div className="bg-fifa-blue/15 border border-fifa-blue/40 p-2 rounded text-[9px] leading-tight text-white animate-fade-in">
                      🎉 <strong>Order Placed:</strong> {hudFoodSelection}! Proceed to Pizza Corner (lowest wait: 5m) or Burger Zone to collect.
                    </div>
                  )}
                </div>
              )}

              {/* 2. Restroom Selector */}
              {selectedStadiumElement.id === 'restrooms' && (
                <div className="mb-3 border-t border-white/15 pt-2.5 space-y-2">
                  <span className="text-[9px] font-black text-fifa-gold uppercase tracking-wider block">🚻 SELECT RESTROOM TYPE:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-[9.5px] text-center">
                    {['Male', 'Female', 'Senior Citizen ♿'].map(gender => (
                      <button
                        key={gender}
                        onClick={() => {
                          setHudRestroomSelection(gender);
                          if (gender.includes('♿')) {
                            handleRouteHighlight("Elevators ♿", "seating");
                          }
                        }}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          hudRestroomSelection === gender
                            ? 'bg-fifa-neon border-fifa-neon text-fifa-dark font-black'
                            : 'bg-black/40 border-white/10 hover:border-fifa-neon'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                  {hudRestroomSelection && (
                    <div className="bg-black/40 p-2 rounded text-[9.5px] text-white/80 animate-fade-in leading-tight">
                      ℹ️ <strong>Status:</strong> {hudRestroomSelection} restroom currently at 18% capacity. Wait time: <strong>&lt; 1 minute</strong>.
                    </div>
                  )}
                </div>
              )}

              {/* 3. Medical Emergency Support */}
              {selectedStadiumElement.id === 'medical' && (
                <div className="mb-3 border-t border-white/15 pt-2.5 space-y-2">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">🚑 SELECT MEDICAL ASSISTANCE NEEDED:</span>
                  <div className="space-y-1.5 text-[9.5px]">
                    {[
                      'Bandages & First Aid Request',
                      'Dehydration / Heat Stroke Relief',
                      'Mobility assistance Golf Cart dispatch'
                    ].map(prob => (
                      <button
                        key={prob}
                        onClick={() => {
                          setHudMedicalSelection(prob);
                          if (prob.includes('Golf Cart')) {
                            setShuttleDispatched(true);
                            handleRouteHighlight("Elevators ♿", "seating");
                          }
                          setCommandAlerts(prev => [
                            { id: Date.now(), type: 'warning', msg: `🚑 Emergency: ${prob} logged near VIP Sector.` },
                            ...prev
                          ]);
                          confetti({ particleCount: 20, colors: ['#ef4444'] });
                        }}
                        className={`w-full p-2 text-left rounded border transition-all cursor-pointer ${
                          hudMedicalSelection === prob
                            ? 'bg-red-600 border-red-500 text-white font-bold'
                            : 'bg-black/40 border-white/10 hover:border-red-500'
                        }`}
                      >
                        {prob}
                      </button>
                    ))}
                  </div>
                  {hudMedicalSelection && (
                    <div className="bg-red-950/40 border border-red-500/50 p-2 rounded text-[9px] leading-tight text-red-200 animate-pulse">
                      🚨 <strong>Dispatched:</strong> AURA Medical Team notified. Assist shuttle golf cart #07 routed to your sector.
                    </div>
                  )}
                </div>
              )}

              {/* 4. Parking Lot & Transit Options */}
              {selectedStadiumElement.id === 'transport' && (
                <div className="mb-3 border-t border-white/15 pt-2.5 space-y-2">
                  <span className="text-[9px] font-black text-fifa-gold uppercase tracking-wider block">🚆 SELECT TRANSIT OR PARKING ROUTE:</span>
                  <div className="space-y-1.5 text-[9.5px]">
                    {[
                      { area: 'Lot A - VIP North Express Parking', time: '1m wait' },
                      { area: 'Lot B - General South Deck Parking', time: '4m wait' },
                      { area: 'Subway Egress Hub - Line 9 Transit', time: '2m loop' }
                    ].map(parking => (
                      <button
                        key={parking.area}
                        onClick={() => {
                          setHudTransportSelection(parking.area);
                          handleRouteHighlight("Gate B", "gate-b");
                        }}
                        className={`w-full p-2 rounded border text-left transition-all cursor-pointer ${
                          hudTransportSelection === parking.area
                            ? 'bg-fifa-blue border-fifa-blue text-white font-bold'
                            : 'bg-black/40 border-white/10 hover:border-fifa-blue'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{parking.area}</span>
                          <span className="text-fifa-neon">{parking.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {hudTransportSelection && (
                    <div className="bg-[#081229] border border-fifa-blue/30 p-2 rounded text-[9px] leading-tight text-white/90 animate-fade-in">
                      🚆 <strong>Route Mapped:</strong> Guide path lines to Gate B subway station/parking gates have been rendered on your dashboard.
                    </div>
                  )}
                </div>
              )}

              <div className="bg-black/55 p-2 rounded border border-white/5 text-[10px] leading-relaxed mb-3">
                <span className="text-fifa-gold font-bold block mb-1">💡 AURA Suggestion:</span>
                <p className="text-white/80">{selectedStadiumElement.advice}</p>
              </div>

              <button 
                onClick={() => {
                  let destLabel = selectedStadiumElement.name;
                  if (selectedStadiumElement.id === 'food') destLabel = "Food Counter";
                  if (selectedStadiumElement.id === 'restrooms') destLabel = "Restroom Area";
                  if (selectedStadiumElement.id === 'medical') destLabel = "Elevators ♿";
                  if (selectedStadiumElement.id === 'transport') destLabel = "Gate B";
                  handleRouteHighlight(destLabel, selectedStadiumElement.id === 'food' ? 'food' : selectedStadiumElement.id === 'restrooms' ? 'restrooms' : 'seating');
                  setSelectedStadiumElement(null);
                }}
                className="w-full bg-fifa-blue hover:bg-blue-600 active:scale-95 text-white font-black text-[10px] py-1.5 rounded transition-all uppercase tracking-wider text-center cursor-pointer"
              >
                🗺️ Draw Route on Pitch
              </button>
            </div>
          )}

          {introActive && (
            <button
              onClick={handleSkipIntro}
              className="absolute bottom-6 right-6 z-30 bg-fifa-blue hover:bg-blue-600 px-4 py-2 border border-white/20 rounded font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-glow-blue cursor-pointer text-white"
            >
              ⏩ Skip Tunnel Entrance
            </button>
          )}

          {activeView !== 'landing' && (
            <div className="absolute top-4 left-4 z-10 hidden sm:block">
              <div className="bg-fifa-navy/90 backdrop-blur border border-fifa-blue/40 px-3 py-1.5 rounded flex items-center gap-2 shadow-2xl">
                <Tv size={14} className="text-fifa-neon" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/50 uppercase leading-none tracking-widest">
                    Live Broadcast Cam
                  </span>
                  <span className="text-xs font-bold text-fifa-gold uppercase tracking-wider">
                    {cameraFocusZone ? `Focus: ${cameraFocusZone}` : 'Overview: Orbit Mode'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 1. LANDING SPLASH SCREEN OVERLAY */}
        {activeView === 'landing' && !introActive && (
          <div className="absolute inset-y-0 left-0 z-40 bg-gradient-to-r from-[#030611]/95 via-[#030611]/65 to-transparent pointer-events-none flex flex-col justify-between p-6 md:p-12 max-w-xl">
            <div className="pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="bg-fifa-gold text-fifa-dark px-2 py-0.5 rounded text-[10px] font-black tracking-widest">
                  FIFA 2026
                </div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  GenAI Stadium Ecosystem
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mt-3 flex items-center gap-2">
                AURA <span className="text-fifa-neon animate-pulse">✨</span>
              </h1>
              <p className="text-[10px] text-fifa-gold font-bold tracking-widest uppercase mt-1">
                Autonomous Unified Real-time Arena
              </p>
              <div className="h-0.5 w-16 bg-fifa-blue mt-4"></div>
            </div>

            <div className="pointer-events-auto my-6 text-white animate-fade-in">
              <h2 className="text-lg md:text-xl font-black leading-snug text-fifa-neon uppercase tracking-wide">
                "AURA doesn't manage stadiums. It understands every human inside them."
              </h2>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Welcome to MetLife Arena 2026. Powered by Gemini multi-agent AI networks, AURA coordinates real-time digital twins, maps personalized Fan DNA journeys, alerts lost child protocols, and tracks halftime rush flows instantly to deliver a friction-free, inclusive, and unforgettable World Cup.
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col gap-3">
              <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">Select Stadium Entrance</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleEnterView('fan', 'gate-a')}
                  className="group border border-fifa-blue/50 bg-[#081229]/95 p-4 rounded-xl text-left hover:border-fifa-neon transition-all duration-300 relative overflow-hidden active:scale-95 cursor-pointer shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-fifa-blue group-hover:bg-fifa-neon transition-all"></div>
                  <div className="flex items-center gap-2 text-white">
                    <User size={16} className="text-fifa-blue group-hover:text-fifa-neon" />
                    <span className="text-xs font-black uppercase tracking-widest">Fan Entrance</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">Check seat routes, request mobility carts, translate announcer log.</p>
                  <span className="text-[9px] text-fifa-gold font-bold block mt-3 group-hover:translate-x-1 transition-transform">
                    ENTER GATE A →
                  </span>
                </button>

                <button
                  onClick={() => handleEnterView('command', 'gate-d')}
                  className="group border border-fifa-blue/50 bg-[#081229]/95 p-4 rounded-xl text-left hover:border-red-500 transition-all duration-300 relative overflow-hidden active:scale-95 cursor-pointer shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-red-600 group-hover:bg-red-500 transition-all"></div>
                  <div className="flex items-center gap-2 text-white">
                    <Briefcase size={16} className="text-red-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Command Center</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">FIFA Organizer mode, deploy tactical strategies, monitor AI squads.</p>
                  <span className="text-[9px] text-fifa-gold font-bold block mt-3 group-hover:translate-x-1 transition-transform">
                    ENTER GATE D →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FAN EXPERIENCE PANEL */}
        {activeView === 'fan' && (
          <div className={`w-full md:w-2/5 h-1/2 md:h-full border-t md:border-t-0 md:border-l flex flex-col p-4 justify-between overflow-y-auto scrollbar-thin z-30 ${
            matchTheme === 'dark' ? 'bg-fifa-dark/95 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-850'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200/20 pb-3 mb-3">
              <button
                onClick={handleBackToLobby}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white hover:underline transition-all cursor-pointer"
              >
                <ArrowLeft size={14} className="text-fifa-blue" />
                <span className={matchTheme === 'light' ? 'text-slate-800' : 'text-white'}>Stadium Lobby</span>
              </button>
              <div className="bg-fifa-blue/20 text-fifa-blue border border-fifa-blue/40 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
                🏆 Fan Portal
              </div>
            </div>

            <div className="mb-4">
              <ScoreBoard crowdPercentage={crowdRate} ecoPower={ecoPower} safetyLevel={safetyLevel} />
            </div>

            <div className="grid grid-cols-4 gap-1 bg-[#081229] border border-white/10 p-1 rounded-lg mb-4">
              {[
                { tab: 'ticket', label: '🎟️ Ticket' },
                { tab: 'fanDna', label: '🧬 Fan DNA' },
                { tab: 'squad', label: '👥 Squad' },
                { tab: 'capsule', label: '🏆 Story' }
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => setFanTab(item.tab)}
                  className={`py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer text-center ${
                    fanTab === item.tab ? 'bg-fifa-blue text-white shadow-glow-blue' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-[300px] mb-4 flex flex-col justify-center">
              {fanTab === 'ticket' && (
                <div className="space-y-4">
                  <TicketCard 
                    seat="Block C Row 12 Seat 24" 
                    gate="Gate A" 
                    row="12" 
                    section="East Stand" 
                    onHighlightSeat={(seatStr) => {
                      handleRouteHighlight(seatStr, "seating");
                    }} 
                  />

                  {/* Accessibility AI Golf Cart Integration */}
                  <div className="bg-[#0c1d3c]/80 border border-purple-500/30 rounded-xl p-3 text-left">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block mb-1">♿ Accessibility AI Assistant</span>
                    <p className="text-[9.5px] text-white/70 leading-relaxed mb-2.5">
                      Need mobility assistance? Ingress transit elevators are online, and automated ramps are open at Gate B.
                    </p>
                    <button
                      onClick={() => {
                        setShuttleDispatched(!shuttleDispatched);
                        if (!shuttleDispatched) {
                          handleRouteHighlight("Elevators ♿", "seating");
                          confetti({ particleCount: 20, colors: ['#a855f7'] });
                        }
                      }}
                      className={`w-full text-center py-2 rounded text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        shuttleDispatched 
                          ? 'bg-purple-600 text-white border-purple-500 shadow-glow-neon'
                          : 'bg-fifa-navy text-purple-400 border-purple-500/40 hover:bg-purple-950/20'
                      }`}
                    >
                      {shuttleDispatched ? '⚡ GOLF SHUTTLE #07 DISPATCHED' : '♿ Dispatch Assistant Shuttle'}
                    </button>
                  </div>

                  {/* Route customizer dropdown */}
                  <div className="bg-fifa-navy border border-white/10 p-3 rounded-xl text-left text-white">
                    <span className="text-[9px] font-black text-fifa-gold uppercase block mb-2">Configure Routing:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <label className="block text-[8px] text-white/40 uppercase mb-1">Start Location</label>
                        <select 
                          value={navStart} 
                          onChange={(e) => setNavStart(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 rounded p-1 text-white focus:outline-none focus:border-fifa-gold"
                        >
                          <option>Gate A</option>
                          <option>Gate B</option>
                          <option>Gate C</option>
                          <option>Gate D</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] text-white/40 uppercase mb-1">Destination</label>
                        <select 
                          value={navDest} 
                          onChange={(e) => setNavDest(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 rounded p-1 text-white focus:outline-none focus:border-fifa-gold"
                        >
                          <option value="Seat Block C Row 12 Seat 24">Seat Block C</option>
                          <option value="Food Counter">Burger Concessions</option>
                          <option value="Restroom Area">Concourse Restrooms</option>
                          <option value="Elevators ♿">Wheelchair Elevator</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={handleManualNav}
                      className="w-full bg-fifa-gold hover:bg-yellow-500 text-fifa-dark font-black text-xs py-2 rounded transition-all uppercase tracking-wider text-center cursor-pointer"
                    >
                      🗺️ Generate Animated Route
                    </button>
                  </div>
                </div>
              )}

              {/* 🧬 Fan DNA Journey */}
              {fanTab === 'fanDna' && (
                <div className="bg-fifa-navy border border-white/10 p-4 rounded-xl text-left text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black uppercase text-fifa-gold">🧬 Match Day DNA Builder</span>
                    <span className="text-[8px] bg-fifa-neon/20 border border-fifa-neon/40 px-1.5 py-0.5 rounded text-fifa-neon font-mono font-black">AI PERSONALIZED</span>
                  </div>

                  {!fanDnaResult ? (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[9px] text-white/50 uppercase mb-1">Enter Fan Name:</label>
                        <input
                          type="text"
                          value={userDnaName}
                          onChange={(e) => setUserDnaName(e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-white focus:outline-none focus:border-fifa-neon text-xs font-bold uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="block text-[8px] text-white/40 uppercase mb-0.5">First WC Match?</label>
                          <select 
                            value={fanDnaQuestions.matchCount}
                            onChange={(e) => setFanDnaQuestions(prev => ({...prev, matchCount: e.target.value}))}
                            className="w-full bg-black/60 border border-white/10 rounded p-1 text-white focus:outline-none"
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] text-white/40 uppercase mb-0.5">With Family?</label>
                          <select 
                            value={fanDnaQuestions.family}
                            onChange={(e) => setFanDnaQuestions(prev => ({...prev, family: e.target.value}))}
                            className="w-full bg-black/60 border border-white/10 rounded p-1 text-white focus:outline-none"
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] text-white/40 uppercase mb-0.5">Have Kids?</label>
                          <select 
                            value={fanDnaQuestions.kids}
                            onChange={(e) => setFanDnaQuestions(prev => ({...prev, kids: e.target.value}))}
                            className="w-full bg-black/60 border border-white/10 rounded p-1 text-white focus:outline-none"
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] text-white/40 uppercase mb-0.5">Need Access support?</label>
                          <select 
                            value={fanDnaQuestions.accessibility}
                            onChange={(e) => setFanDnaQuestions(prev => ({...prev, accessibility: e.target.value}))}
                            className="w-full bg-black/60 border border-white/10 rounded p-1 text-white focus:outline-none"
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFanDnaResult({
                            arrival: fanDnaQuestions.family === 'Yes' ? '5:30 PM' : '6:15 PM',
                            gate: fanDnaQuestions.accessibility === 'Yes' ? 'Gate B ♿' : 'Gate A',
                            preMatch: fanDnaQuestions.kids === 'Yes' ? 'Visit Fan Zone Playpark' : 'Visit FIFA Museum Zone',
                            halfTime: fanDnaQuestions.food === 'Yes' ? 'Pizza Zone (lowest queue)' : 'Grab merch at Stand B',
                            afterMatch: 'Wait 12 minutes, Exit Gate D',
                            timeSaved: fanDnaQuestions.accessibility === 'Yes' ? '55 minutes' : '47 minutes'
                          });
                          confetti({ particleCount: 30, colors: ['#00ff66', '#eab308'] });
                        }}
                        className="w-full bg-fifa-neon hover:bg-emerald-400 text-fifa-dark font-black text-xs py-2 rounded transition-all uppercase tracking-widest mt-2 cursor-pointer"
                      >
                        🧬 Generate Match Day DNA
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-black/35 p-3 rounded border border-fifa-gold/30">
                        <span className="text-[10px] font-black text-fifa-gold uppercase block tracking-widest mb-2">
                          🏆 {userDnaName.toUpperCase()}'s MATCH DAY DNA
                        </span>
                        
                        <div className="space-y-1.5 text-xs text-white/95">
                          <p><strong className="text-white/60">Arrival Plan:</strong> {fanDnaResult.arrival}</p>
                          <p><strong className="text-white/60">Target Entrance:</strong> {fanDnaResult.gate}</p>
                          <p><strong className="text-white/60">Pre-Match activity:</strong> {fanDnaResult.preMatch}</p>
                          <p><strong className="text-white/60">Halftime Strategy:</strong> {fanDnaResult.halfTime}</p>
                          <p><strong className="text-white/60">Egress Exit:</strong> {fanDnaResult.afterMatch}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between items-center">
                          <span className="text-[9px] text-white/50 uppercase">Expected Time Saved</span>
                          <span className="text-xs font-black text-fifa-neon font-mono">{fanDnaResult.timeSaved}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setFanDnaResult(null)}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[10px] py-1.5 rounded transition-all uppercase tracking-wider text-center cursor-pointer"
                      >
                        Reset DNA Builder
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 👥 Squad Mode & 🚨 Lost Person AI */}
              {fanTab === 'squad' && (
                <div className="bg-fifa-navy border border-white/10 p-4 rounded-xl text-left text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black uppercase text-fifa-gold">👥 Squad Mode Locator</span>
                    <span className="text-[8px] bg-fifa-blue/20 border border-fifa-blue/40 px-1.5 py-0.5 rounded text-fifa-blue font-mono font-black font-semibold">ACTIVE</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-black/35 p-2.5 rounded border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">👩 Mom</span>
                        <span className="text-[9.5px] text-fifa-neon">Near Food Zone B</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">👦 Friend</span>
                        <span className="text-[9.5px] text-white/60">Walking to Seat C12</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-1.5 text-fifa-gold font-bold">
                        <span>Meet Point: Gate 4</span>
                        <span className="text-[10px]">ETA: 3 mins</span>
                      </div>
                    </div>
                  </div>

                  {/* 🚨 Lost Person AI Module */}
                  <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 mt-2.5 text-left">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">🚨 LOST PERSON ASSIST ACTIVE</span>
                    <p className="text-[9.5px] text-white/70 leading-relaxed mb-3">
                      If a child or family member is missing, activate child locator protocol immediately. Volunteers will be alerted.
                    </p>

                    {!lostPersonActive ? (
                      <button
                        onClick={() => {
                          setLostPersonActive(true);
                          setCommandAlerts(prev => [
                            { id: Date.now(), type: 'warning', msg: '🚨 AMBER ALERT: Child reported lost near Concourse B.' },
                            ...prev
                          ]);
                          confetti({ particleCount: 30, colors: ['#ef4444'] });
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-[10px] py-2 rounded transition-all uppercase tracking-widest cursor-pointer text-center"
                      >
                        🔴 ACTIVATE CHILD LOST PROTOCOL
                      </button>
                    ) : (
                      <div className="space-y-2.5 animate-pulse">
                        <div className="bg-red-950/60 p-2.5 rounded border border-red-500/50 text-[10px] text-red-300">
                          <p className="font-black uppercase tracking-wider mb-1">⚠️ CHILD ASSISTANCE SEARCH ACTIVE</p>
                          <p><strong>Last Location:</strong> Concourse B (Food Court)</p>
                          <p><strong>Nearest Volunteer:</strong> Dispatch Coach (20 meters away)</p>
                          <p className="text-white mt-1"><strong>Route:</strong> Parent route mapped to Safe Zone meeting point.</p>
                        </div>
                        <button
                          onClick={() => {
                            setLostPersonActive(false);
                            setCommandAlerts(prev => [
                              { id: Date.now(), type: 'info', msg: '✅ Child reunited. Emergency protocol resolved.' },
                              ...prev
                            ]);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] py-1.5 rounded transition-all uppercase tracking-wider cursor-pointer text-center"
                        >
                          🟢 REUNITED / CANCEL ALERT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 🏆 Memory Capsule AI */}
              {fanTab === 'capsule' && (
                <div className="bg-fifa-navy border border-white/10 p-4 rounded-xl text-left text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black uppercase text-fifa-gold">🏆 Memory Capsule AI</span>
                    <span className="text-[8px] bg-fifa-gold/20 border border-fifa-gold/40 px-1.5 py-0.5 rounded text-fifa-gold font-mono font-black">MEMORIES</span>
                  </div>

                  {!memoryCapsuleReady ? (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-xs text-white/70 leading-relaxed">
                        Generate your personalized post-match digital keepsake card highlighting your unique FIFA World Cup 2026 journey.
                      </p>
                      <button
                        onClick={() => {
                          setMemoryCapsuleReady(true);
                          confetti({ particleCount: 40, colors: ['#eab308', '#00ff66', '#0055ff'] });
                        }}
                        className="px-4 py-2 bg-fifa-gold hover:bg-yellow-500 text-fifa-dark font-black text-xs rounded transition-all uppercase tracking-wider shadow-lg hover:shadow-glow-gold cursor-pointer"
                      >
                        🏆 Generate My Story
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5 animate-fade-in text-xs">
                      <div className="border-2 border-fifa-gold bg-gradient-to-b from-[#0c1d3c] to-fifa-dark p-3.5 rounded-xl text-center space-y-2 relative shadow-glow-gold">
                        <div className="absolute top-1.5 right-1.5 bg-fifa-gold text-fifa-dark font-mono font-black text-[7.5px] px-1 rounded">
                          OFFICIAL STORY
                        </div>
                        <span className="text-lg block">🏆</span>
                        <h4 className="font-black text-fifa-gold text-sm leading-none uppercase tracking-wider">
                          {userDnaName}'S WORLD CUP STORY
                        </h4>
                        <p className="text-[9px] text-white/50 uppercase tracking-widest">MetLife Arena | July 19, 2026</p>
                        
                        <div className="border-t border-b border-white/10 py-2.5 my-2 text-left space-y-1.5 text-[10.5px]">
                          <p>🏟️ <strong>Match watched:</strong> Argentina vs France (2 - 1)</p>
                          <p>⏰ <strong>Arrival:</strong> Entered at 6:02 PM via Gate B</p>
                          <p>🔥 <strong>Your Moment:</strong> Goal scored at 78'</p>
                          <p>🔊 <strong>Crowd Reaction:</strong> Top 5% loudest fans</p>
                          <p>📸 <strong>Capsule Assets:</strong> 10 photos, Timeline summary, Match highlights</p>
                        </div>
                        <span className="text-[8px] text-fifa-neon font-bold tracking-widest block uppercase font-mono">
                          Share & Celebrate
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                        <button
                          onClick={() => alert("Ready to post to Instagram Stories!")}
                          className="bg-pink-600 hover:bg-pink-700 text-white py-1.5 rounded font-black uppercase tracking-wider cursor-pointer"
                        >
                          📸 Instagram
                        </button>
                        <button
                          onClick={() => alert("Ready to share with your network on LinkedIn!")}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-black uppercase tracking-wider cursor-pointer"
                        >
                          💼 LinkedIn
                        </button>
                      </div>

                      <button
                        onClick={() => setMemoryCapsuleReady(false)}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 py-1 rounded text-[9.5px] uppercase font-bold cursor-pointer"
                      >
                        Reset Story Capsule
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Smart Eco Mode Switcher */}
            <div className="glass-panel border-fifa-accent/30 p-3.5 rounded-lg flex items-center justify-between shadow-lg text-white bg-fifa-navy/85">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-fifa-accent/15 border border-fifa-accent/30">
                  <Leaf size={18} className="text-fifa-accent" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white uppercase leading-none">Smart Eco Mode</h4>
                  <p className="text-[9px] text-white/50 mt-1 leading-tight">Engage photovoltaic roof grid trackers.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSustainabilityActive(!sustainabilityActive);
                  setEcoPower(sustainabilityActive ? 4.8 : 6.8);
                  if (!sustainabilityActive) {
                    confetti({ particleCount: 30, colors: ['#00ff66'] });
                  }
                }}
                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                  sustainabilityActive
                    ? 'bg-fifa-accent text-fifa-dark border-fifa-accent shadow-glow-green'
                    : 'bg-fifa-navy text-white/80 border-white/10 hover:border-fifa-accent'
                }`}
              >
                {sustainabilityActive ? 'ACTIVE ⚡' : 'ENGAGE'}
              </button>
            </div>
          </div>
        )}

        {/* 3. COMMAND CENTER PANEL (FIFA ORGANIZER) */}
        {activeView === 'command' && (
          <div className="w-full md:w-2/5 h-1/2 md:h-full bg-fifa-dark/95 border-t md:border-t-0 md:border-l border-white/10 flex flex-col p-4 justify-between overflow-y-auto scrollbar-thin z-30">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <button
                onClick={handleBackToLobby}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white hover:underline transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Exit Control Room</span>
              </button>
              <div className="bg-red-950/40 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Activity size={10} className="animate-pulse" />
                <span>FIFA Command Room</span>
              </div>
            </div>

            <div className="mb-4">
              <ScoreBoard crowdPercentage={crowdRate} ecoPower={ecoPower} safetyLevel={safetyLevel} />
            </div>

            {/* LIVE MATCH OPERATIONS OVERVIEW SCREEN */}
            <div className="glass-panel border-white/10 p-3 rounded-lg mb-4 select-none">
              <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Live Match Operations Monitor
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-white">
                <div className="bg-black/35 p-2 rounded border border-white/5">
                  <span className="text-[8px] text-white/40 block uppercase">Total Fans</span>
                  <span className="text-xs font-black text-white">{totalFans.toLocaleString()}</span>
                </div>
                <div className="bg-black/35 p-2 rounded border border-white/5">
                  <span className="text-[8px] text-white/40 block uppercase">Free Seats</span>
                  <span className="text-xs font-black text-fifa-neon">{availableSeats}</span>
                </div>
                <div className="bg-black/35 p-2 rounded border border-white/5">
                  <span className="text-[8px] text-white/40 block uppercase">Active Gates</span>
                  <span className="text-xs font-black text-white">{activeGates}</span>
                </div>
                <div className="bg-black/35 p-2 rounded border border-white/5">
                  <span className="text-[8px] text-white/40 block uppercase">Volunteers</span>
                  <span className="text-xs font-black text-fifa-gold">{volunteersCount}</span>
                </div>
              </div>
            </div>

            {/* QUICK AI ONE-CLICK CONTROLS */}
            <div className="glass-panel border-white/10 p-3 rounded-lg mb-4">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 text-left">⚡ Organizer Tactical Interventions:</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleOpenGate}
                  className="bg-fifa-navy hover:bg-fifa-blue hover:text-white border border-white/15 p-2 rounded text-[10px] font-black uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-glow-blue"
                >
                  🚪 Open New Gate
                </button>
                <button 
                  onClick={handleSendVolunteers}
                  className="bg-fifa-navy hover:bg-fifa-blue hover:text-white border border-white/15 p-2 rounded text-[10px] font-black uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-glow-blue"
                >
                  🏃 Send Volunteers
                </button>
                <button 
                  onClick={handleRedirectCrowd}
                  className="bg-fifa-navy hover:bg-fifa-blue hover:text-white border border-white/15 p-2 rounded text-[10px] font-black uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-glow-blue"
                >
                  🔀 Redirect Crowd
                </button>
                <button 
                  onClick={handleOptimizeEnergy}
                  className="bg-fifa-navy hover:bg-fifa-blue hover:text-white border border-white/15 p-2 rounded text-[10px] font-black uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-glow-blue"
                >
                  ⚡ Optimize Energy
                </button>
              </div>
            </div>

            {/* 🏟 STADIUM DIGITAL TWIN SIMULATOR */}
            <div className="glass-panel border-fifa-gold/30 p-3 rounded-lg mb-4 text-left">
              <span className="text-[9px] font-black text-fifa-gold uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                <span>🏟️ Stadium Digital Twin Simulator</span>
                <span className="text-[7.5px] bg-fifa-gold/15 border border-fifa-gold/40 px-1 rounded font-bold font-mono">SIM ENGINE</span>
              </span>
              <p className="text-[9.5px] text-white/70 leading-relaxed mb-2.5">
                Run real-time predictive evacuation and crowd egress simulations to optimize exit routing flows.
              </p>

              {!twinSimulating && !twinTimeSaved ? (
                <button
                  onClick={() => {
                    setTwinSimulating(true);
                    setTwinStatus('Calculating egress routes...');
                    setTimeout(() => {
                      setTwinSimulating(false);
                      setTwinStatus('Simulation Complete: Egress routes optimized.');
                      setTwinTimeSaved('Egress duration reduced: 42 mins ➔ 18 mins (Saved 24m!)');
                      confetti({ particleCount: 30, colors: ['#eab308'] });
                      setCommandAlerts(prev => [
                        { id: Date.now(), type: 'info', msg: '🏟️ Digital Twin: Egress simulation complete. Exit time reduced by 24 mins.' },
                        ...prev
                      ]);
                    }, 1800);
                  }}
                  className="w-full bg-[#081229] hover:bg-fifa-blue hover:text-white border border-fifa-gold/40 p-2 rounded text-[10px] font-black uppercase text-fifa-gold transition-all cursor-pointer text-center"
                >
                  🚀 Run Egress Simulation
                </button>
              ) : (
                <div className="space-y-2 bg-black/45 p-2 rounded border border-white/5 text-[9.5px]">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Status:</span>
                    <span className={`font-bold ${twinSimulating ? 'text-fifa-gold animate-pulse' : 'text-fifa-neon'}`}>{twinStatus}</span>
                  </div>
                  {twinSimulating && (
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-fifa-gold h-full rounded-full animate-pulse" style={{width: '65%'}}></div>
                    </div>
                  )}
                  {twinTimeSaved && (
                    <div className="border-t border-white/10 pt-1.5 mt-1">
                      <p className="text-fifa-neon font-black font-mono leading-tight">{twinTimeSaved}</p>
                      <p className="text-white/50 text-[8px] mt-0.5">Solution: Gates C & D opened automatically. Ingress flow redirected.</p>
                      <button
                        onClick={() => {
                          setTwinTimeSaved(null);
                          setTwinStatus('Idle - Ready');
                        }}
                        className="mt-2 text-white/40 hover:text-white underline cursor-pointer text-[8px] uppercase block font-bold"
                      >
                        Reset Simulator
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 🏃 HALFTIME RUSH AI PREDICTOR & 🧠 CROWD PREDICTION LOAD */}
            <div className="glass-panel border-white/10 p-3 rounded-lg mb-4 text-left">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 flex justify-between">
                <span>🏃 Halftime Rush Predictor</span>
                <span className="text-fifa-neon font-mono font-bold">PREDICTIONS LIVE</span>
              </span>
              
              <div className="space-y-2">
                <div className="bg-red-950/20 border border-red-500/30 p-2.5 rounded text-[10px] space-y-1">
                  <p className="font-bold text-red-400">⚠️ RUSH ALERT: Halftime in 5 mins</p>
                  <p className="text-white/70 leading-normal">
                    AI Predicts: <strong>50,000 fans</strong> likely to move to washrooms & concessions in the next 8 minutes.
                  </p>
                  <div className="mt-1 pt-1.5 border-t border-red-500/20 text-[9px] text-fifa-neon flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-fifa-neon animate-ping"></span>
                    <span>Auto-Mitigation: 12 concession lines opened, 45 volunteers shifted to West Stand.</span>
                  </div>
                </div>

                {/* 🧠 Crowd Load Heatmap values */}
                <div className="space-y-1.5 text-[9.5px]">
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-wider block">🧠 Sector Occupancy Projections:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-white">
                    <div className="bg-[#081229]/90 border border-red-500/30 p-1.5 rounded">
                      <span className="text-[7.5px] text-white/50 block">West Concourse</span>
                      <span className="font-black text-red-400 font-mono">92% Load</span>
                    </div>
                    <div className="bg-[#081229]/90 border border-white/5 p-1.5 rounded">
                      <span className="text-[7.5px] text-white/50 block">East Concourse</span>
                      <span className="font-black text-fifa-neon font-mono">45% Load</span>
                    </div>
                    <div className="bg-[#081229]/90 border border-white/5 p-1.5 rounded">
                      <span className="text-[7.5px] text-white/50 block">South Gate Ingress</span>
                      <span className="font-black text-white font-mono">30% Load</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE INTEL ALERT LOG */}
            <div className="glass-panel border-white/10 p-3 rounded-lg mb-4 text-left">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2">🚨 Live Crowd Intelligence Logs:</span>
              <div className="space-y-1.5 max-h-[85px] overflow-y-auto">
                {commandAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center gap-2 bg-black/45 p-1.5 rounded border border-white/5">
                    {alert.type === 'warning' ? (
                      <AlertTriangle size={12} className="text-red-500 animate-pulse shrink-0" />
                    ) : (
                      <Info size={12} className="text-fifa-blue shrink-0" />
                    )}
                    <span className="text-[9.5px] font-medium text-white/90 truncate">{alert.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI COACH PLAYBOOK STRATEGIES */}
            <div className="mb-4">
              <h4 className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span>📋 AURA Suggests - Match Strategy plays</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-2">
                {strategies.map((play) => (
                  <FootballCard 
                    key={play.id} 
                    strategy={play} 
                    onDeploy={handleDeployStrategy} 
                  />
                ))}
              </div>
            </div>

            {/* TEAM FORMATION BOARD (FUT player cards in pitch layout) */}
            <div className="border border-fifa-blue/20 bg-black/60 rounded-xl p-3 select-none flex flex-col justify-between relative min-h-[220px]">
              <div className="absolute inset-1.5 border border-white/5 rounded"></div>
              <div className="absolute inset-y-1.5 left-1/2 w-px bg-white/5"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/5"></div>

              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 z-10">
                <h4 className="text-[9px] font-black text-fifa-gold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-fifa-gold" />
                  <span>Team AURA Pitch Formation</span>
                </h4>
                <span className="text-[7.5px] text-white/50 font-semibold tracking-wider font-mono">
                  TAP JERSEY TO VIEW DATA
                </span>
              </div>

              {/* Pitch Formation Grid */}
              <div className="grid grid-cols-3 grid-rows-5 gap-y-2 h-[150px] relative z-10">
                {agentPlayers.map((player) => {
                  const agentData = agents.find(a => a.name.includes(player.name.split(' ')[0]));
                  const isSelected = selectedAgent?.id === player.id;
                  
                  return (
                    <div 
                      key={player.id} 
                      className={`${player.gridArea} flex flex-col items-center cursor-pointer`}
                      onClick={() => setSelectedAgent(agentData || null)}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                        isSelected 
                          ? 'bg-fifa-neon border-fifa-neon text-fifa-dark scale-110 shadow-glow-green font-black' 
                          : 'bg-fifa-navy border-fifa-gold/40 text-fifa-gold hover:border-fifa-neon'
                      }`}>
                        {player.num}
                      </div>
                      <span className="text-[7px] font-black text-white mt-1 uppercase tracking-wider block text-center whitespace-nowrap bg-black/50 px-1 rounded-sm">
                        {player.positionLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected agent detail overlay inside board */}
              {selectedAgent && (
                <div className="absolute inset-x-2 bottom-2 bg-[#0c1a30]/95 border border-fifa-gold/40 rounded-lg p-2.5 z-20 flex flex-col justify-between animate-fade-in text-left">
                  <div className="flex items-start justify-between border-b border-white/10 pb-1 mb-1.5">
                    <div>
                      <h5 className="text-[10px] font-black text-white uppercase">{selectedAgent.name}</h5>
                      <span className="text-[8px] text-fifa-neon font-bold tracking-wider">{selectedAgent.purpose}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedAgent(null)}
                      className="text-white/40 hover:text-white text-[10px] font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="text-[8.5px] leading-tight space-y-1">
                    <p className="text-white/70">
                      <strong className="text-white">Live Reasoning: </strong>
                      {selectedAgent.liveReasoning}
                    </p>
                    <p className="text-fifa-neon">
                      <strong className="text-white">AI Suggestion: </strong>
                      {selectedAgent.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Floating Mascot chatbot booth */}
      <StadiumAssistant 
        onRouteSelect={handleRouteHighlight} 
        stadiumState={{ crowdRate, sustainabilityActive, safetyLevel }}
      />

    </div>
  );
}
