
import { GoogleGenAI, Type } from "@google/genai";
import { RiskItem } from "../types";

const SYSTEM_INSTRUCTION = `You are an expert IT Project Risk Analyzer. 
Your goal is to perform a deep analysis of project concerns and output a structured risk assessment.

Rules for analysis:
1. Summarize: Provide a professional, concise summary of the risk.
2. Categorize: You MUST use exactly one of these categories: "Technical", "Resource", "Timeline", or "Budget".
3. Mitigation: Suggest a realistic, actionable, and enterprise-grade mitigation strategy.
4. Priority: Assign "High", "Medium", or "Low" based on typical impact on software project success.

You must return the results as a JSON array of objects.`;

export const analyzeRisks = async (userInput: string): Promise<RiskItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userInput,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Professional summary of the risk" },
            category: { type: Type.STRING, enum: ["Technical", "Resource", "Timeline", "Budget"], description: "Risk category" },
            mitigation: { type: Type.STRING, description: "Detailed mitigation strategy" },
            priority: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Priority level" }
          },
          required: ["summary", "category", "mitigation", "priority"]
        }
      }
    }
  });

  const jsonStr = response.text || '[]';
  const parsed = JSON.parse(jsonStr);
  
  return parsed.map((item: any, index: number) => ({
    ...item,
    id: `risk-${Date.now()}-${index}`
  }));
};
