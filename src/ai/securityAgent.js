// Safety Keeper Agent
export const securityAgent = {
  id: "safety-keeper",
  name: "SAFETY KEEPER",
  number: "01",
  position: "GK",
  role: "Perimeter Security Guard",
  purpose: "Ensure stadium perimeter safety, crowd monitoring, and ticket verification security.",
  currentTask: "Conducting thermal scans at all main gates and checking fire protection systems.",
  confidence: 97,

  checkSecurity: (stadiumData) => {
    const { anomalousBehaviorReported = false } = stadiumData;
    let liveReasoning = "All entry scanners and thermal camera feeds are nominal. Crowd sentiment is positive.";
    let recommendation = "Perimeter security checks nominal. Gate sensors verifying ticket barcodes securely.";
    let confidence = 97;

    if (anomalousBehaviorReported) {
      liveReasoning = "Minor crowding congestion at Gate D outer perimeter detected.";
      recommendation = "Deploy additional security personnel to expand boundary line control gates.";
      confidence = 93;
    }

    return {
      purpose: securityAgent.purpose,
      currentTask: securityAgent.currentTask,
      confidence,
      liveReasoning,
      recommendation,
      stats: { flw: 80, eco: 75, saf: 99, acc: 88, nvr: 97, ops: 96 }
    };
  }
};
