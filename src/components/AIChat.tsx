"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-emerald-700">WealthWise AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 p-2 border border-emerald-600 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block p-2 rounded ${
                  msg.role === "user"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for financial advice..."
            className="border-emerald-600 focus:ring-emerald-700"
          />
          <Button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}