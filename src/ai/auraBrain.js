import { crowdAgent } from './crowdAgent.js';
import { navigationAgent } from './navigationAgent.js';
import { accessibilityAgent } from './accessibilityAgent.js';
import { ecoAgent } from './ecoAgent.js';
import { securityAgent } from './securityAgent.js';
import { askGemini } from '../services/gemini.js';

export const auraBrain = {
  // Aggregate status telemetry from all agents
  getSquadStatus: (stadiumData) => {
    return [
      { name: crowdAgent.name, ...crowdAgent.analyzeCrowd(stadiumData) },
      { name: navigationAgent.name, ...navigationAgent.calculateRoute("Tunnel", "Overview", false) },
      { name: accessibilityAgent.name, ...accessibilityAgent.checkAccessibility(stadiumData) },
      { name: ecoAgent.name, ...ecoAgent.regulateEnergy(stadiumData.sustainabilityActive) },
      { name: securityAgent.name, ...securityAgent.checkSecurity(stadiumData) }
    ];
  },

  // Process user chat requests using Gemini (or fallback mock)
  processMessage: async (userInput, stadiumState) => {
    // Check if user is asking for specific coordinates or services
    const lowerInput = userInput.toLowerCase();
    let detectedRoute = null;
    let detectedFocus = null;
    let isAccessibility = lowerInput.includes('wheelchair') || lowerInput.includes('disabled') || lowerInput.includes('elderly');

    if (lowerInput.includes('b21') || lowerInput.includes('c24') || lowerInput.includes('seat')) {
      detectedRoute = "Seat Block C Row 12 Seat 24";
      detectedFocus = "seating";
    } else if (lowerInput.includes('food') || lowerInput.includes('eat') || lowerInput.includes('veg') || lowerInput.includes('burger') || lowerInput.includes('pizza')) {
      detectedRoute = "Food Counter";
      detectedFocus = "food";
    } else if (lowerInput.includes('exit') || lowerInput.includes('leave') || lowerInput.includes('transit') || lowerInput.includes('subway') || lowerInput.includes('gate')) {
      detectedRoute = "Gate B";
      detectedFocus = "gate-b";
    } else if (lowerInput.includes('restroom') || lowerInput.includes('toilet') || lowerInput.includes('washroom')) {
      detectedRoute = "Restroom Area";
      detectedFocus = "restrooms";
    } else if (lowerInput.includes('medical') || lowerInput.includes('doctor') || lowerInput.includes('first aid')) {
      detectedRoute = "Medical Center";
      detectedFocus = "medical";
    }

    // Call navigation agent for routing telemetry
    const routeInfo = navigationAgent.calculateRoute(
      "Entrance Tunnel", 
      detectedRoute || "General Seating", 
      isAccessibility
    );

    // AI System Context prompt for Gemini
    const systemPrompt = `You are AURA (Autonomous Unified Real-time Arena), the intelligent GenAI stadium system for the FIFA World Cup 2026.
    Respond in a football commentator/stadium announcer style. Keep it brief, high-energy, and professional.
    
    Stadium telemetry:
    - Crowd Density: ${stadiumState.crowdRate}%
    - Power Source: ${stadiumState.sustainabilityActive ? 'Solar Roof Grid (6.8 MW)' : 'Standard Grid (4.8 MW)'}
    - Safety Rating: ${stadiumState.safetyLevel}%
    - Target Route: ${routeInfo.recommendation}
    - Walk ETA: ${routeInfo.etaMinutes} minutes.
    
    Translate or reply in English unless the user requests translation or asks in another language.
    Include a short bulleted grid layout showing:
    ⚽ Entrance Gate
    🏃 Estimated Walk Time
    📢 Comm Remarks
    `;

    const responseText = await askGemini(systemPrompt, userInput);

    return {
      text: responseText,
      route: detectedRoute,
      focus: detectedFocus,
      eta: routeInfo.etaMinutes
    };
  }
};

