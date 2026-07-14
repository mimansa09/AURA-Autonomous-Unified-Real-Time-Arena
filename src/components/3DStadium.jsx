import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';

// Component to handle camera animations (intro fly-through and focus points)
function CameraController({ introActive, setIntroActive, cameraFocusZone }) {
  const { camera } = useThree();
  const progress = useRef(0);

  // Initialize camera position inside the tunnel
  useEffect(() => {
    if (introActive) {
      camera.position.set(0, 1.8, 55); // Inside player tunnel
      camera.lookAt(0, 2, 0);
    }
  }, [introActive, camera]);

  useFrame((state, delta) => {
    if (introActive) {
      progress.current += delta * 0.45; // Speed of camera exit
      if (progress.current >= 1) {
        progress.current = 1;
        setIntroActive(false); // End intro
      }

      const t = progress.current;
      const smoothT = t * t * (3 - 2 * t);
      
      const x = THREE.MathUtils.lerp(0, 0, smoothT);
      const y = THREE.MathUtils.lerp(1.8, 26, smoothT);
      const z = THREE.MathUtils.lerp(55, 60, smoothT);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 2, -10 * (1 - smoothT));
    } else if (cameraFocusZone) {
      let targetPos = new THREE.Vector3(0, 28, 65);
      let targetLookAt = new THREE.Vector3(0, 0, 0);

      switch (cameraFocusZone) {
        case 'seating':
          targetPos.set(10, 22, 40);
          targetLookAt.set(20, 4, -10);
          break;
        case 'tunnel':
          targetPos.set(0, 4, 52);
          targetLookAt.set(0, 1, 58);
          break;
        case 'gate-a':
          targetPos.set(-45, 12, 35);
          targetLookAt.set(-45, 1, 35);
          break;
        case 'gate-b':
          targetPos.set(45, 12, 35);
          targetLookAt.set(45, 1, 35);
          break;
        case 'gate-c':
          targetPos.set(-45, 12, -35);
          targetLookAt.set(-45, 1, -35);
          break;
        case 'gate-d':
          targetPos.set(45, 12, -35);
          targetLookAt.set(45, 1, -35);
          break;
        case 'food':
          targetPos.set(-35, 7, 5);
          targetLookAt.set(-50, 1.5, 0);
          break;
        case 'sustainability':
          targetPos.set(0, 38, 10);
          targetLookAt.set(0, 15, 0);
          break;
        default:
          targetPos.set(0, 28, 65);
          targetLookAt.set(0, 0, 0);
      }

      camera.position.lerp(targetPos, 0.05);
      
      const currentLookAt = new THREE.Vector3(0, 0, 0);
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);
    }
  });

  return null;
}

// Interactive Football component on the pitch
function Football({ introActive }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      if (introActive) {
        const z = THREE.MathUtils.lerp(50, 0, Math.min(time * 0.45, 1));
        const bounce = Math.abs(Math.sin(time * 5)) * 0.8;
        meshRef.current.position.set(0, 0.22 + bounce, z);
        meshRef.current.rotation.x = -time * 6;
      } else {
        const x = Math.sin(time * 0.8) * 15;
        const z = Math.cos(time * 1.5) * 8;
        const bounce = Math.abs(Math.sin(time * 4)) * 0.3;
        meshRef.current.position.set(x, 0.22 + bounce, z);
        meshRef.current.rotation.x = time * 2;
        meshRef.current.rotation.y = time * 3;
      }
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.22, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.31, 8, 8]} />
        <meshBasicMaterial color="#111111" wireframe={true} transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial color="#001800" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// 3D Pitch Markings & Goals
function Pitch({ greenMode }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 70]} />
        <meshStandardMaterial 
          color={greenMode ? "#064e3b" : "#1b4332"} 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {/* Turf patterns */}
      {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((xVal, index) => (
        <mesh 
          key={index}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[xVal, 0.001, 0]}
        >
          <planeGeometry args={[5, 70]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? (greenMode ? "#047857" : "#2d6a4f") : (greenMode ? "#065f46" : "#1b4332")} 
            roughness={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[9.1, 9.2, 64]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[0.1, 70]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Touchlines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 35]}>
        <planeGeometry args={[100, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -35]}>
        <planeGeometry args={[100, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, 0.002, 0]}>
        <planeGeometry args={[0.1, 70]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, 0.002, 0]}>
        <planeGeometry args={[0.1, 70]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Penalty Areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-42, 0.002, 0]}>
        <planeGeometry args={[0.1, 33]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-46, 0.002, 16.5]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-46, 0.002, -16.5]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[42, 0.002, 0]}>
        <planeGeometry args={[0.1, 33]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[46, 0.002, 16.5]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[46, 0.002, -16.5]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      <GoalPost position={[-50, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <GoalPost position={[50, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

function GoalPost({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 3.66, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 7.32, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.83, -3.66]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.66, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.83, 3.66]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.66, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[1, 1.83, 0]}>
        <boxGeometry args={[2, 3.66, 7.32]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Seating Stands with DYNAMIC Crowd Density Heatmap Colors
function SeatingStands({ highlightedSection, crowdRate }) {
  // Pre-calculate stand density loads based on central crowdRate
  // East Stand is affected by redirections (crowdRate)
  const standLoads = {
    East: crowdRate,      // E.g. starts at 94%, falls to 74%
    West: 76,
    North: 88,
    South: 92
  };

  const stands = [
    { id: 'North', name: 'NORTH STAND', pos: [-60, 4, 0], rot: [0, Math.PI / 2, 0], scale: [80, 8, 12] },
    { id: 'South', name: 'SOUTH STAND', pos: [60, 4, 0], rot: [0, -Math.PI / 2, 0], scale: [80, 8, 12] },
    { id: 'East', name: 'EAST STAND - ZONE B & D', pos: [0, 4, -45], rot: [0, 0, 0], scale: [110, 8, 12] },
    { id: 'West', name: 'WEST STAND - ZONE A & C', pos: [0, 4, 45], rot: [0, Math.PI, 0], scale: [110, 8, 12] }
  ];

  // Helper to pick color matching crowd density
  const getDensityColor = (load, isSelected) => {
    if (isSelected) return '#00ff66'; // High glowing green for manual highlight
    if (load > 90) return '#ef4444'; // Red alarm for congested stands (>90%)
    if (load > 80) return '#ea580c'; // Orange warning (80-90%)
    return '#1e3a8a'; // Blue/navy nominal seat load (<80%)
  };

  return (
    <group>
      {stands.map((stand, index) => {
        const load = standLoads[stand.id];
        
        let isHighlighted = false;
        if (highlightedSection) {
          const sect = highlightedSection.toUpperCase();
          if (stand.id === 'North' && sect.startsWith('N')) isHighlighted = true;
          if (stand.id === 'South' && sect.startsWith('S')) isHighlighted = true;
          if (stand.id === 'East' && (sect.includes('B') || sect.includes('D'))) isHighlighted = true;
          if (stand.id === 'West' && (sect.includes('A') || sect.includes('C'))) isHighlighted = true;
        }

        const color = getDensityColor(load, isHighlighted);

        return (
          <group key={index} position={stand.pos} rotation={stand.rot}>
            {/* Tier 1 */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[stand.scale[0], 2, stand.scale[2]]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.7} 
                emissive={color}
                emissiveIntensity={isHighlighted ? 0.4 : 0.15}
              />
            </mesh>

            {/* Tier 2 */}
            <mesh position={[0, 3, 3]} castShadow receiveShadow>
              <boxGeometry args={[stand.scale[0] - 4, 3, stand.scale[2] - 2]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.7} 
                emissive={color}
                emissiveIntensity={isHighlighted ? 0.5 : 0.1}
              />
            </mesh>

            {/* Tier 3 */}
            <mesh position={[0, 6, 6]} castShadow receiveShadow>
              <boxGeometry args={[stand.scale[0] - 8, 4, stand.scale[2] - 4]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.7} 
                emissive={color}
                emissiveIntensity={isHighlighted ? 0.6 : 0.05}
              />
            </mesh>

            {/* Stand Label overlay */}
            <Html position={[0, 8.5, 6]} center>
              <div className="px-2 py-0.5 rounded text-[9px] font-black bg-fifa-dark/95 border border-white/10 text-white whitespace-nowrap uppercase tracking-wider shadow">
                {stand.name} <span className="text-fifa-gold ml-1">({load}%)</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Sustainability solar roof
function SustainabilityRoof({ active }) {
  return (
    <group position={[0, 16, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[65, 3, 16, 64]} />
        <meshStandardMaterial color={active ? "#10b981" : "#1e293b"} roughness={0.3} />
      </mesh>

      {Array.from({ length: 16 }).map((_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 65;
        const z = Math.sin(angle) * 65;
        
        return (
          <mesh key={index} position={[x, 0.4, z]} rotation={[0.1, -angle, 0]} castShadow>
            <boxGeometry args={[14, 0.2, 6]} />
            <meshStandardMaterial 
              color={active ? "#00ff66" : "#0f172a"} 
              roughness={0.1} 
              metalness={0.8}
              emissive={active ? "#052e16" : "#000000"}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}

      {active && (
        <Sparkles 
          count={60} 
          scale={[130, 2, 130]} 
          color="#00ff66" 
          size={2.5} 
          speed={0.5} 
          noise={0.5} 
        />
      )}
    </group>
  );
}

// Stadium Gates & Tunnel Markers
function GateMarkers({ highlightedGate, onGateClick }) {
  const gates = [
    { id: 'gate-a', label: 'Gate A - FAN', pos: [-48, 0.5, 42], color: '#3b82f6' },
    { id: 'gate-b', label: 'Gate B - FAN', pos: [48, 0.5, 42], color: '#3b82f6' },
    { id: 'gate-c', label: 'Gate C - VIP', pos: [-48, 0.5, -42], color: '#eab308' },
    { id: 'gate-d', label: 'Gate D - COMMAND', pos: [48, 0.5, -42], color: '#ef4444' }
  ];

  return (
    <group>
      <group position={[0, 0.1, 52]}>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[6, 3.6, 8]} />
          <meshStandardMaterial color="#0c1d3c" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.5, -0.5]}>
          <boxGeometry args={[5.2, 3.0, 0.1]} />
          <meshBasicMaterial color="#00ff66" transparent opacity={0.6} />
        </mesh>
        <Html position={[0, 4, 0]} center>
          <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-fifa-accent/90 text-white whitespace-nowrap tracking-widest shadow">
            TEAM TUNNEL
          </span>
        </Html>
      </group>

      {gates.map((gate) => {
        const isHighlighted = highlightedGate === gate.id;
        
        return (
          <group 
            key={gate.id} 
            position={gate.pos}
            onClick={() => onGateClick && onGateClick(gate.id)}
          >
            <mesh castShadow position={[0, 2.5, 0]}>
              <cylinderGeometry args={[1, 1.2, 5, 8]} />
              <meshStandardMaterial 
                color={isHighlighted ? '#00ff66' : '#111827'} 
                roughness={0.4} 
                emissive={isHighlighted ? '#00ff66' : gate.color}
                emissiveIntensity={isHighlighted ? 0.8 : 0.3}
              />
            </mesh>
            
            <mesh position={[0, 5.5, 0]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial color={isHighlighted ? '#00ff66' : gate.color} />
            </mesh>

            <Html position={[0, 6.8, 0]} center>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onGateClick && onGateClick(gate.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border shadow-lg flex items-center gap-1.5 ${
                  isHighlighted 
                    ? 'bg-fifa-neon text-fifa-dark border-fifa-neon font-black scale-110 shadow-glow-green animate-pulse'
                    : 'bg-fifa-navy/90 text-white border-fifa-blue/50 hover:bg-fifa-blue hover:text-white hover:scale-105'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {gate.label}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Accessibility elevator columns and markers in 3D
function AccessibilityElevators({ active }) {
  const elevatorPositions = [
    [-44, 4, 25], // North-West Concourses
    [44, 4, -25]  // South-East Concourses
  ];

  return (
    <group>
      {elevatorPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Glass Elevator shaft */}
          <mesh castShadow position={[0, 1, 0]}>
            <boxGeometry args={[2.5, 10, 2.5]} />
            <meshStandardMaterial 
              color="#0055ff" 
              transparent 
              opacity={active ? 0.3 : 0.15} 
              roughness={0.1}
              metalness={0.9} 
            />
          </mesh>
          {/* Elevator Cabin indicator */}
          <mesh position={[0, active ? 4 : -2, 0]}>
            <boxGeometry args={[2.2, 2.0, 2.2]} />
            <meshBasicMaterial color={active ? "#00ff66" : "#0055ff"} transparent opacity={0.6} />
          </mesh>
          {/* Floating wheelchair HTML icon */}
          {active && (
            <Html position={[0, 7.5, 0]} center>
              <div className="w-5 h-5 rounded-full bg-[#a855f7] border border-white text-white flex items-center justify-center text-[10px] shadow shadow-glow-gold animate-bounce">
                ♿
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function Floodlights({ active, greenMode }) {
  const corners = [
    { pos: [-55, 18, -40], rot: [0.3, Math.PI / 4, 0] },
    { pos: [55, 18, -40], rot: [0.3, -Math.PI / 4, 0] },
    { pos: [-55, 18, 40], rot: [-0.3, 3 * Math.PI / 4, 0] },
    { pos: [55, 18, 40], rot: [-0.3, -3 * Math.PI / 4, 0] }
  ];

  return (
    <group>
      {corners.map((c, index) => (
        <group key={index} position={c.pos}>
          <mesh castShadow position={[0, -9, 0]}>
            <cylinderGeometry args={[0.4, 0.8, 18, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>

          <group position={[0, 0, 0]} rotation={c.rot}>
            <mesh castShadow>
              <boxGeometry args={[4, 2.5, 0.8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>

            {[-1.5, -0.5, 0.5, 1.5].map((lx) => 
              [-0.8, 0, 0.8].map((ly) => (
                <mesh key={`${lx}-${ly}`} position={[lx, ly, 0.41]}>
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshBasicMaterial 
                    color={active ? (greenMode ? "#00ff66" : "#ffffff") : "#475569"} 
                  />
                </mesh>
              ))
            )}

            {active && (
              <mesh position={[0, 0, 4]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[4, 8, 16, 1, true]} />
                <meshBasicMaterial 
                  color={greenMode ? "#10b981" : "#ffffff"} 
                  transparent 
                  opacity={0.12} 
                  side={THREE.DoubleSide} 
                />
              </mesh>
            )}
          </group>

          {active && (
            <spotLight 
              position={[0, 1, 0]} 
              target-position={[0, 0, 0]}
              intensity={greenMode ? 1.5 : 2.5} 
              distance={85} 
              angle={Math.PI / 3} 
              penumbra={0.6} 
              castShadow 
              color={greenMode ? "#10b981" : "#ffffff"}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// 3D Path Route Visualizer for Mascot Guiding
function RouteVisualizer({ routeTarget }) {
  if (!routeTarget) return null;

  let points = [];
  let isAccessibility = routeTarget.includes("♿") || routeTarget.includes("Access");
  const baseLabel = routeTarget.replace("♿", "").trim();

  switch (baseLabel) {
    case 'Seat B21': // East Stand
      if (isAccessibility) {
        // Go through elevator ramp
        points = [
          [0, 0.15, 48],
          [0, 0.15, 25],
          [44, 0.15, 25], // Go to South-East Elevator
          [44, 4.0, -25], // Take elevator corridor
          [15, 4.5, -35]
        ];
      } else {
        points = [
          [0, 0.15, 48],
          [0, 0.15, 20],
          [25, 0.15, 20],
          [25, 0.15, -15],
          [15, 1.2, -38]
        ];
      }
      break;
    case 'Food Counter': // West Stand Concession
      points = [
        [0, 0.15, 48],
        [0, 0.15, 0],
        [-38, 0.15, 0],
        [-46, 0.8, 0]
      ];
      break;
    case 'VIP Gate C': // VIP Gate C
      points = [
        [0, 0.15, 48],
        [-30, 0.15, 40],
        [-48, 0.15, -42]
      ];
      break;
    case 'Gate B': // Gate B
      points = [
        [0, 0.15, 48],
        [48, 0.15, 42]
      ];
      break;
    default:
      return null;
  }

  const vecPoints = points.map(p => new THREE.Vector3(...p));

  return (
    <group>
      <Line
        points={vecPoints}
        color={isAccessibility ? "#a855f7" : "#00ff66"} // Purple for Accessibility, Neon Green for general
        lineWidth={5}
        dashed={isAccessibility}
        dashSize={1}
        gapSize={0.5}
      />
      {points.map((p, idx) => (
        <mesh key={idx} position={p}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshBasicMaterial color={isAccessibility ? "#a855f7" : "#eab308"} />
        </mesh>
      ))}
    </group>
  );
}

export default function Stadium3D({
  introActive,
  setIntroActive,
  cameraFocusZone,
  highlightedSection,
  highlightedGate,
  onGateClick,
  sustainabilityActive,
  routeTarget,
  crowdRate = 88,
  theme = 'dark', // 'dark' | 'light'
  onElementClick // onClick callback for interactive stadium parts
}) {
  const [lightsOn, setLightsOn] = useState(true);

  // Auto turn on lights during intro
  useEffect(() => {
    if (introActive) {
      setLightsOn(false);
      const timer = setTimeout(() => {
        setLightsOn(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [introActive]);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#030611' : '#bae6fd'; // Dark space blue vs bright sky blue

  // Concessions, Restrooms, Medical, Elevators, Transport click positions
  const interactiveAssets = [
    { id: 'food', name: 'Burger Zone & Pizza Corner', pos: [-38, 0.8, 0], icon: '🍔', desc: 'Concourse food stalls', crowd: '62%', wait: '5m wait time', advice: 'Burger Zone 25m wait, Pizza Corner 5m wait.' },
    { id: 'restrooms', name: 'Restrooms Area North', pos: [-25, 0.8, -30], icon: '🚻', desc: 'Concourse sanitation systems', crowd: '18%', wait: '1m wait time', advice: 'Bypass restroom at main gate for 0 wait here.' },
    { id: 'medical', name: 'Medical Center Zone B', pos: [25, 0.8, -30], icon: '🚑', desc: 'Emergency & first aid facility', crowd: '5%', wait: '0m wait time', advice: 'Staff on standby, wheelchair transport cart available.' },
    { id: 'transport', name: 'Subway Exit & Transport Gate B', pos: [48, 0.5, 42], icon: '🚆', desc: 'High frequency express trains connect', crowd: '45%', wait: '2m wait time', advice: 'Fastest egress route to city lines.' }
  ];

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 28, 65], fov: 45 }}
        className="w-full h-full"
        style={{ backgroundColor: bgColor }}
      >
        <color attach="background" args={[bgColor]} />
        
        {/* Dynamic lighting mapping theme */}
        <ambientLight intensity={isDark ? (lightsOn ? (sustainabilityActive ? 0.35 : 0.6) : 0.08) : 1.1} />
        
        <directionalLight
          castShadow
          position={isDark ? [10, 40, 20] : [30, 60, 40]}
          intensity={isDark ? (lightsOn ? 1.0 : 0.05) : 1.8}
          shadow-mapSize={[1024, 1024]}
          color={isDark ? '#e0e7ff' : '#fffbeb'} // Daylight warm sun vs cool stadium flood
        />

        {/* Floodlight posts */}
        <Floodlights active={isDark ? lightsOn : false} greenMode={sustainabilityActive} />

        {/* Pitch markings */}
        <Pitch greenMode={sustainabilityActive || !isDark} />

        {/* Dynamic seating stands color-changing by load */}
        <SeatingStands 
          highlightedSection={highlightedSection} 
          crowdRate={crowdRate}
          onClickStand={(standId) => {
            if (onElementClick) {
              onElementClick({
                id: standId.toLowerCase(),
                name: `${standId.toUpperCase()} STAND`,
                desc: 'Main seating tier',
                crowd: standId === 'East' ? `${crowdRate}%` : '76%',
                wait: '4m exit climb',
                advice: 'Redirection bypass routes are active'
              });
            }
          }}
        />

        {/* Tunnel and Gates */}
        <GateMarkers 
          highlightedGate={highlightedGate} 
          onGateClick={(gateId) => {
            if (onGateClick) onGateClick(gateId);
            if (onElementClick) {
              const loads = { 'gate-a': '32%', 'gate-b': '55%', 'gate-c': '14%', 'gate-d': '94%' };
              const wait = { 'gate-a': '1m wait', 'gate-b': '2m wait', 'gate-c': '0m wait', 'gate-d': '12m wait' };
              const name = gateId.replace('-', ' ').toUpperCase();
              onElementClick({
                id: gateId,
                name: name,
                desc: gateId === 'gate-d' ? 'FIFA Organizer Entrance' : 'Fan Admission Portal',
                crowd: loads[gateId] || '40%',
                wait: wait[gateId] || '3m wait',
                advice: gateId === 'gate-d' ? 'North Stand congestion increasing, routing fans to Gate B' : 'Normal flow ingress'
              });
            }
          }} 
        />

        {/* Clickable Food, Restrooms, Medical, Transport icons in 3D */}
        {interactiveAssets.map((asset) => (
          <group 
            key={asset.id} 
            position={asset.pos}
            onClick={() => onElementClick && onElementClick(asset)}
          >
            <mesh castShadow position={[0, 1.2, 0]}>
              <boxGeometry args={[2, 2.4, 2]} />
              <meshStandardMaterial color={isDark ? '#0f172a' : '#ffffff'} roughness={0.3} metalness={0.7} />
            </mesh>
            <Html position={[0, 3.2, 0]} center>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onElementClick && onElementClick(asset);
                }}
                className="px-2 py-1 rounded bg-fifa-navy border border-fifa-gold text-white text-[10px] font-black uppercase tracking-wider shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{asset.icon}</span>
                <span>{asset.id.toUpperCase()}</span>
              </button>
            </Html>
          </group>
        ))}

        {/* Glass Accessibility Elevator Shafts */}
        <AccessibilityElevators active={routeTarget && (routeTarget.includes("♿") || routeTarget.includes("Access"))} />

        {/* Procedural football */}
        <Football introActive={introActive} />

        {/* Solar Roof grid */}
        <SustainabilityRoof active={sustainabilityActive} />

        {/* Glowing routing path line */}
        <RouteVisualizer routeTarget={routeTarget} />

        {/* Crowd sparkles */}
        <Sparkles 
          count={isDark ? (lightsOn ? 150 : 35) : 75} 
          scale={[100, 8, 80]} 
          color={sustainabilityActive ? "#00ff66" : routeTarget?.includes("♿") ? "#a855f7" : isDark ? "#ffffff" : "#1e40af"} 
          size={1.6} 
          speed={0.8} 
          noise={0.5} 
          position={[0, 4, 0]}
        />

        {!introActive && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            minDistance={15}
            maxDistance={110}
            maxPolarAngle={Math.PI / 2 - 0.05}
            target={[0, 2, 0]}
          />
        )}

        <CameraController 
          introActive={introActive} 
          setIntroActive={setIntroActive} 
          cameraFocusZone={cameraFocusZone} 
        />
      </Canvas>

      {!introActive && (
        <div className="absolute bottom-6 left-6 z-10 flex gap-2">
          {isDark && (
            <button 
              onClick={() => setLightsOn(!lightsOn)}
              className={`px-3 py-1.5 rounded bg-fifa-navy/85 backdrop-blur border text-xs font-bold transition-all flex items-center gap-2 ${
                lightsOn 
                  ? 'border-fifa-gold text-fifa-gold shadow-glow-gold' 
                  : 'border-white/20 text-white/60 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${lightsOn ? 'bg-fifa-gold animate-ping' : 'bg-white/40'}`}></span>
              LIGHTS: {lightsOn ? 'ON' : 'OFF'}
            </button>
          )}
        </div>
      )}

      {introActive && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/45 backdrop-blur-sm pointer-events-none transition-all duration-1000">
          <div className="text-center p-6 border-2 border-fifa-neon/30 bg-fifa-navy/95 rounded-xl max-w-md shadow-glow-green animate-pulse">
            <h2 className="text-2xl font-black text-fifa-neon tracking-widest uppercase">TUNNEL CAM</h2>
            <p className="text-xs text-white/80 mt-1 uppercase tracking-widest">Entering AURA Arena...</p>
          </div>
        </div>
      )}
    </div>
  );
}

