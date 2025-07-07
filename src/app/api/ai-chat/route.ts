import { NextRequest, NextResponse } from "next/server";

const HF_MODEL = "google/flan-t5-small"; // fallback working model

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const prompt = `Question: ${message}\nAnswer:`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const raw = await response.text();
    console.log("🧠 Hugging Face raw response:", raw);

    try {
      const data = JSON.parse(raw);
      const reply = Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.generated_text || "⚠️ Model returned empty or unexpected response.";

      return NextResponse.json({ reply });
    } catch (err) {
      console.error("❌ Failed to parse HF JSON:", raw);
      return NextResponse.json({ reply: "Model response unreadable." }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API route error:", error);
    return NextResponse.json({ reply: "Internal server error." }, { status: 500 });
  }
}
