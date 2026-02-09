import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, tone, length, type, context, userApiKey, image } = await req.json();

        if (!topic && type !== 'prompt-enhancer') {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: "No API Key found. Please provide your Gemini API Key in the tool settings."
            }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = "";

        if (type === 'meta-optimizer') {
            prompt = `As an SEO Expert, optimize the Meta Title and Meta Description for the following:
            URL: ${context?.url || 'N/A'}
            Target Keyword/Topic: ${context?.keyword || topic}
            
            Requirements:
            1. Meta Title: Max 60 characters, high CTR, includes keyword.
            2. Meta Description: Max 160 characters, compelling call to action, includes keyword.
            3. Provide a list of 5 relevant secondary keywords.
            4. Format as JSON with keys: "title", "description", "keywords" (string), "score" (number out of 100).
            
            Output ONLY the JSON object.`;
        } else if (type === 'prompt-enhancer') {
            prompt = `You are an expert Prompt Engineer. Your task is to take the following raw prompt and enhance it to be more effective, specific, and structured for better AI responses.

            Original Prompt: "${topic || context?.prompt}"
            
            Instructions:
            1. Clarify the objective.
            2. Add necessary context or constraints.
            3. Suggest a persona if applicable.
            4. Structure the output format if needed.
            5. Make it concise yet descriptive.
            
            Provide two versions:
            1. An "Optimized Prompt" (Ready to use).
            2. "Why it's better" (Brief explanation of improvements).
            
            Format your response clearly with Markdown.`;
        } else if (type === 'keyword-suggester') {
            prompt = `As an SEO Keyword Research Expert, generate 10-15 keyword suggestions related to: "${topic}"
            
            Difficulty preference: ${context?.difficulty || 'All'}
            
            For each keyword, provide:
            1. The keyword phrase
            2. Estimated monthly search volume (e.g., "5.2k", "12k")
            3. Difficulty level (Easy, Medium, or Hard)
            4. Estimated CPC in USD (e.g., "$1.20")
            
            Format your response as a markdown table with columns: Keyword | Volume | Difficulty | CPC
            
            | seo tools | 12k | Hard | $3.50 |
            
            Provide realistic, data-driven estimates based on current SEO trends.`;
        } else if (type === 'color-palette') {
            prompt = `As an expert Color Theorist and Designer, generate a beautiful 5-color palette based on the theme/description: "${topic}".
            
            Requirements:
            1. Provide 5 distinct colors.
            2. For each color, provide the HEX code and a generic name (e.g. "Deep Blue").
            3. Explain briefly why this palette works for the theme.
            4. Format as JSON with:
               - "colors": Array of objects { "hex": "#RRGGBB", "name": "Name" }
               - "description": "Short explanation..."

            Output ONLY the JSON object.`;
        } else if (type === 'image-caption') {
            prompt = `Generate 5 creative, catchy, and SEO-friendly captions for this image. 
            Also provide 20 relevant hashtags.
            Format the output clearly with Markdown headers for "Captions" and "Hashtags".`;
        } else if (type === 'humanizer') {
            prompt = `Rewrite the following text to sound more human-like, conversational, and less engagingly predictable. 
            Vary sentence length, use simpler vocabulary where appropriate, and insert natural emotional nuance. 
            Do not change the core meaning.
            
            Text: "${context?.prompt || topic}"`;
        } else {
            prompt = `Write a high-quality, SEO-optimized blog post about "${topic}". 
            The tone should be ${tone}. 
            The length should be approximately ${length}.
            Use professional markdown formatting with headers (# and ##). 
            Ensure it includes an introduction, key points, and a conclusion.`;
        }

        let result;
        if (type === 'image-caption' && image) {
            // image is likely B64: data:image/png;base64,xxxx
            const [metadata, data] = image.split(',');
            const mimeType = metadata.match(/:(.*?);/)?.[1] || 'image/jpeg';

            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType,
                        data
                    }
                }
            ]);
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        if (type === 'meta-optimizer' || type === 'color-palette') {
            try {
                // Clean markdown from AI response if present
                const cleanJson = text.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleanJson);
                return NextResponse.json(parsed);
            } catch (pErr) {
                return NextResponse.json({ text });
            }
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
