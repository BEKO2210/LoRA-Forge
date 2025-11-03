
import { GoogleGenAI, Type } from '@google/genai';
import type { TrainingConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        model: { type: Type.STRING, description: "The base model to use, e.g., 'unsloth/llama-3-8b-Instruct-bnb-4bit'." },
        dataset: { type: Type.STRING, description: "The dataset for fine-tuning, e.g., 'yahma/alpaca-cleaned'." },
        epochs: { type: Type.INTEGER, description: "Number of training epochs, typically between 1 and 5." },
        learningRate: { type: Type.NUMBER, description: "The learning rate, usually a small value like 2e-4." },
        loraRank: { type: Type.INTEGER, description: "The LoRA rank (r), often a power of 2 like 8, 16, or 32." },
        use4bit: { type: Type.BOOLEAN, description: "Whether to use 4-bit quantization. Usually true for Unsloth models." },
        maxSeqLength: { type: Type.INTEGER, description: "Maximum sequence length, e.g., 2048 or 4096." },
    },
    required: ["model", "dataset", "epochs", "learningRate", "loraRank", "use4bit", "maxSeqLength"]
};

export async function generateConfigWithGemini(prompt: string): Promise<TrainingConfig> {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                role: 'user',
                parts: [{ text: `Generate a LoRA training configuration for this goal: "${prompt}". Use sensible defaults for a consumer GPU like an RTX 3090.` }]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                systemInstruction: "You are an expert in fine-tuning LLMs with LoRA and Unsloth. Your task is to generate a valid JSON configuration based on the user's request. Prioritize models compatible with 4-bit quantization.",
            }
        });

        const jsonText = result.text.trim();
        const generatedConfig = JSON.parse(jsonText);

        // Validate and merge with defaults to ensure all keys are present
        return {
            ...DEFAULT_CONFIG,
            ...generatedConfig,
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate configuration from AI. The model may have returned an invalid format or an error occurred.");
    }
}
