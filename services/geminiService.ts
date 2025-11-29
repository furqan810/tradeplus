import { GoogleGenAI } from "@google/genai";
import { TradeResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTradeAnalysis = async (result: TradeResult, symbol: string = "Asset"): Promise<string> => {
  try {
    const prompt = `
      You are a senior financial analyst. Analyze this short-term trade result:
      
      - Asset Type: ${symbol}
      - Initial Investment: $${result.initialInvestment.toFixed(2)}
      - Net Profit/Loss: $${result.netProfit.toFixed(2)}
      - ROI: ${result.roi.toFixed(2)}%
      - Break-even Price: $${result.breakEvenPrice.toFixed(2)}

      Provide a 2-3 sentence insight. 
      If profitable, mention the risk-reward efficiency. 
      If loss, mention a psychological tip for risk management. 
      Keep it professional but conversational. Do not use markdown formatting like bolding.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response
        maxOutputTokens: 150,
      }
    });

    return response.text || "Analysis unavailable at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch AI analysis.");
  }
};