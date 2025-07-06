import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_API_KEY);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const response = await hf.textGeneration({
      model: "gpt2",
      inputs: message,
      parameters: { max_length: 100 },
    });
    return NextResponse.json({ response: response.generated_text });
  } catch (error) {
    console.error("Error with AI chat:", error);
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}