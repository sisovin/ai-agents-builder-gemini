
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available. In a real app, you might want to handle this more gracefully.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Runs the Gemini agent for a single, non-streamed response.
 * Ideal for tasks that require a complete response before proceeding.
 * @param {string} prompt The user's prompt to the AI agent.
 * @returns {Promise<string>} The text response from the AI model.
 */
export const runAgent = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use Flash for quick, efficient tasks
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Error in runAgent:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error) {
        return `An error occurred while communicating with the AI: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the AI.";
  }
};

/**
 * Runs the Gemini agent for a streaming response.
 * Useful for real-time conversations or displaying long-form content as it's generated.
 * @param {string} prompt The user's prompt to the AI agent.
 * @returns {AsyncGenerator<string, void, unknown>} An async generator that yields text chunks.
 */
export async function* streamAgent(prompt: string): AsyncGenerator<string, void, unknown> {
    try {
        const stream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });

        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in streamAgent:", error);
        if (error instanceof Error) {
            yield `\n\n**Error:** ${error.message}`;
        } else {
            yield "\n\n**An unknown error occurred.**";
        }
    }
}
