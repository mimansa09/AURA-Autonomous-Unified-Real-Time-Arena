// Crowd Captain Agent
export const crowdAgent = {
  id: "crowd-captain",
  name: "CROWD CAPTAIN",
  number: "10",
  position: "ATT",
  role: "Flow Controller",
  purpose: "Optimize spectator ingress/egress and stand densities.",
  currentTask: "Monitoring general seating stand densities and gate queue velocities.",
  confidence: 98,
  
  // Live simulation of crowd telemetry analysis
  analyzeCrowd: (stadiumData) => {
    const { crowdPercentage, gateCPercent } = stadiumData;
    let liveReasoning = "Spectator ingress velocity is nominal at 1.2 m/s. Seating stands are filled evenly.";
    let recommendation = "Maintain current gate configurations.";
    let confidence = 98;

    if (gateCPercent > 85) {
      liveReasoning = `CRITICAL bottleneck detected at Gate C (${gateCPercent}% load). Inflow rate exceeds gate throughput capacity. Estimated delay is 14 minutes.`;
      recommendation = "Tactical redirection: Divert incoming ticket holders from Gate C to Gate D (Control Center entrance).";
      confidence = 94;
    } else if (crowdPercentage > 90) {
      liveReasoning = "Stadium stands capacity exceeding 90%. Egress routes must be prepared for post-match dispersal.";
      recommendation = "Pre-load egress exits and notify public transit systems to increase train frequency.";
      confidence = 97;
    }

    return {
      purpose: crowdAgent.purpose,
      currentTask: crowdAgent.currentTask,
      confidence,
      liveReasoning,
      recommendation,
      stats: { flw: 99, eco: 78, saf: 85, acc: 90, nvr: 96, ops: 94 }
    };
  }
};
