import { GoogleGenAI, Type } from "@google/genai";
import { ReadingPassage, UserStats, ReadingSession, ReadingInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReadingPassage = async (topic: string = "general knowledge"): Promise<ReadingPassage> => {
  try {
    const prompt = `Generate a reading passage about "${topic}" for a speed reading test. 
    It should be approximately 200-300 words long.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            wordCount: { type: Type.INTEGER },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
          },
          required: ["title", "content", "wordCount", "difficulty"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ReadingPassage;
  } catch (error) {
    console.error("Error generating passage:", error);
    // Fallback passage
    const fallbackContent = "Reading is a complex cognitive process of decoding symbols in order to construct or derive meaning. Reading is a means of language acquisition, communication, and of sharing information and ideas. Like all languages, it is a complex interaction between the text and the reader which is shaped by the reader's prior knowledge, experiences, attitude.";
    return {
      title: "The Art of Reading (Fallback)",
      content: fallbackContent,
      wordCount: fallbackContent.split(/\s+/).length,
      difficulty: 'Medium'
    };
  }
};

export const generateReadingInsights = async (recentSessions: ReadingSession[]): Promise<ReadingInsight[]> => {
  try {
    if (recentSessions.length === 0) {
      return [{
        message: "Complete your first reading session to unlock AI-powered insights!",
        type: "encouragement"
      }];
    }

    const sessionSummary = recentSessions.map(s => 
      `Date: ${s.date}, WPM: ${s.wpm}, Duration: ${s.durationSeconds}s, Type: ${s.type}`
    ).join('\n');

    const prompt = `Analyze these reading sessions and provide 3 brief insights/tips in JSON format.
    Sessions:
    ${sessionSummary}
    
    Return a list of insights.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["encouragement", "analysis", "tip"] }
            },
            required: ["message", "type"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ReadingInsight[];
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      { message: "Consistent practice is key to improving reading speed.", type: "tip" },
      { message: "Try to reduce subvocalization to read faster.", type: "tip" }
    ];
  }
};
