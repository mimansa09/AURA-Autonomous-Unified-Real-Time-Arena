const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function askGemini(systemPrompt, userQuery) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey.trim() !== '') {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, running locally simulated model logic: ", err);
    }
  }

  // Fallback realistic AI Simulation Mode
  return simulateMascotResponse(userQuery);
}

function simulateMascotResponse(query) {
  const lower = query.toLowerCase();

  // Navigation
  if (lower.includes('seat') || lower.includes('b21') || lower.includes('c24') || lower.includes('reach')) {
    return `Route mapped by **Route Playmaker** ⚽
    
- 🏟️ **Stand Area:** East Stand - Block C Row 12 Seat 24
- 🚪 **Entrance Gate:** Gate B
- 🏃 **Estimated Time:** 5 minutes (Normal walking speed)
- 🚶 **Path:** Gate B ➔ South-East Ramp ➔ Sector 12 Concourse ➔ Block C Row 12.

📢 *AURA AI Commentator:* "Playmaker finds the open gap! Keep to the right of the East Stand ramp to bypass the beverage queue. Have a great match!"`;
  }

  // Crowd exits
  if (lower.includes('exit') || lower.includes('fastest') || lower.includes('subway') || lower.includes('leave') || lower.includes('gate')) {
    return `Egress analysis completed by **Crowd Captain** 🚇
    
- 🚪 **Recommended Exit:** Gate B (South-East Gate)
- 🏃 **Walking time to transit:** 6 minutes
- 🚆 **Subway status:** Line 3 and Line 9 trains running on high-frequency 2-minute loops.
- 🚦 **Traffic status:** Gate A is currently under 85% load. Gate B is at 45% load and is the fastest egress portal.

📢 *AURA AI Commentator:* "Captain signals a quick break! Head out via Gate B to beat the peak post-game rush. Flow is moving swiftly!"`;
  }

  // Accessibility
  if (lower.includes('wheelchair') || lower.includes('access') || lower.includes('disabled') || lower.includes('elevator')) {
    return `Inclusive assistance coordinated by **Access Guardian** ♿
    
- 🚪 **Entrance Gate:** Gate B (Equipped with automated access ramps)
- 🛗 **Vertical Lift:** Elevator East Concourse (Wait time: < 1 minute)
- 🚑 **Assistant shuttle:** Golf cart #07 has been dispatched to Gate B ingress dropoff point to pick you up.

📢 *AURA AI Commentator:* "Access Guardian ensures no fan is left behind! Ramps are clear and assistant personnel are standing by."`;
  }

  // General food
  if (lower.includes('food') || lower.includes('eat') || lower.includes('burger') || lower.includes('pizza') || lower.includes('vegan') || lower.includes('healthy')) {
    return `Concessions map by **Eco Defender** 🍔
    
- 🍕 **Fastest Stand:** Pizza Corner (Wait time: 5 minutes)
- 🍔 **Popular Stand:** Burger Zone (Wait time: 25 minutes)
- 🥬 **Eco Recommendation:** Vegan Area (Wait time: 8 minutes)

📢 *AURA AI Commentator:* "Defender routes you to Pizza Corner to avoid the heavy rush at Burger Zone. Quick snack, quick return to the game!"`;
  }

  return `Stadium support provided by **AURA Assistant** 🎙️

I can coordinate navigation to seats (e.g. "How do I reach Seat C24?"), analyze stadium exits (e.g. "Which exit is fastest?"), find wheelchair accessibility guides, or locate your favorite stadium food. Ask me anything!

📢 *AURA AI Commentator:* "Welcome to the Arena! AURA is ready to assist you."`;
}
