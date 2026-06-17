import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, contextData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "Gemini API Key is currently missing. Please add your GEMINI_API_KEY in the Secrets panel under Settings to run live AI audits." 
        }, 
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Structure prompt specifically for Botswanan / general educational report context mapping
    const fullPrompt = `
You are a senior UI/UX consultant and lead educational planning auditor for the Edu-VISION (Vital Information System for Institutional & Operational Needs) system.
Analyze the school statistics database provided below:

--- SCHOOL DATABASE START ---
${JSON.stringify(contextData, null, 2)}
--- SCHOOL DATABASE END ---

USER COMMAND:
${prompt}

Formatting guidelines:
1. Return your analysis in clear, exquisite Markdown.
2. Formulate bullet lists, short bold callouts, and clean educational summaries.
3. Be professional, highly constructive, precise, and authoritative.
4. Avoid any system debugging details or colloquial conversational pleasantries; begin the analysis or narrative report immediately.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during report generation." },
      { status: 500 }
    );
  }
}
