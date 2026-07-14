// Route Playmaker Agent
export const navigationAgent = {
  id: "route-playmaker",
  name: "ROUTE PLAYMAKER",
  number: "08",
  position: "MID",
  role: "Path Optimizer",
  purpose: "Calculate optimal paths, walk times, and directions for stadium visitors.",
  currentTask: "Plotting lines from main gates to seating sections and amenities.",
  confidence: 96,

  calculateRoute: (startPoint, endPoint, accessibilityMode = false) => {
    // Simulated pathfinder logic
    let path = [];
    let etaMinutes = 4;
    let description = "";

    if (accessibilityMode) {
      etaMinutes = 7;
      description = "Accessibility route active. Rerouted via Elevator East and flat concrete corridors.";
      path = ["Entrance Tunnel", "East Concourse Flat-path", "Elevator B", "Seating Row 12"];
    } else {
      if (endPoint.includes("B21") || endPoint.toLowerCase().includes("seat")) {
        path = ["Entrance Tunnel", "General East Ramp", "Section 12 Corridor", "Seat B21"];
        description = "General admission path optimized. Enter via Gate B, climb East Ramp, head straight to Section 12.";
      } else if (endPoint.toLowerCase().includes("food") || endPoint.toLowerCase().includes("counter")) {
        path = ["Entrance Tunnel", "West Main Gate", "Concourse Grill Counter"];
        etaMinutes = 3;
        description = "Nearest food stand: Pitch-Side Grill. Take the West Concourse exit. Waiting time is 2 minutes.";
      } else if (endPoint.toLowerCase().includes("vip") || endPoint.toLowerCase().includes("gate c")) {
        path = ["Entrance Tunnel", "North-West Boulevard", "VIP Suite Entrance Gate C"];
        etaMinutes = 5;
        description = "VIP Gate C Route active. Follow North-West Boulevard and use the designated VIP elevator.";
      } else {
        path = ["Entrance Tunnel", "Main Exit Arch", "Public Transport Gate"];
        etaMinutes = 6;
        description = "Exiting to public transit: Follow the south exit towards Gate B for direct subway line connection.";
      }
    }

    return {
      purpose: navigationAgent.purpose,
      currentTask: navigationAgent.currentTask,
      confidence: accessibilityMode ? 98 : 96,
      liveReasoning: `Routing from ${startPoint} to ${endPoint}. AccessMode=${accessibilityMode}. Est. walk time: ${etaMinutes} minutes. Path nodes: ${path.join(" -> ")}.`,
      recommendation: description,
      path,
      etaMinutes,
      stats: { flw: 92, eco: 80, saf: 88, acc: 94, nvr: 99, ops: 92 }
    };
  }
};
