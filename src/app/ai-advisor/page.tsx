"use client";

import AIChat from "@/components/AIChat";

export default function AIAdvisorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">WealthWise AI</h1>
      <AIChat />
    </div>
  );
}