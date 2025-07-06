import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; // Imported for navigation

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            💰 Smart Finance Management
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Master Your <span className="text-emerald-600">Financial</span> <span className="text-blue-600">Future</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            "Every dollar you save is a step toward financial freedom. Every expense you track is a 
            lesson in mindful spending. Your money flows where your attention goes."
          </p>
          <div>
            <Link href="/transactions">
              <button className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors duration-200 mx-auto block">
                Start Your Journey →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Financial Journey Simplified</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow our intuitive roadmap to financial mastery. Each step builds upon the 
            last, creating a comprehensive view of your financial health.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Roadway Path */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 via-purple-500 to-orange-500 h-full z-0"></div>
          
          {/* Step 1: Track Every Transaction */}
          <div className="relative flex items-center mb-16">
            <div className="w-1/2 pr-8">
              <Card className="bg-emerald-500 text-white overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white text-emerald-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Track Every Transaction</h3>
                      <p className="text-emerald-100 text-sm mb-3">
                        Effortlessly record your income and expenses with our intuitive system.
                      </p>
                      <div className="bg-emerald-400 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">✓ Interactive Demo</h4>
                        <p className="text-xs text-emerald-100">
                          Add and categorize transactions easily.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            <div className="w-1/2 pl-8">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm">
                    ☕
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">Coffee Shop</p>
                        <p className="text-xs text-gray-500">Food & Dining · Today</p>
                      </div>
                      <p className="font-bold text-red-500 text-sm">-$4.50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Visualize Your Spending */}
          <div className="relative flex items-center mb-16">
            <div className="w-1/2 pr-8">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow-md">
                <h4 className="font-semibold mb-3 text-sm">Monthly Overview</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs">Food & Dining - 35%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Transportation - 25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs">Entertainment - 15%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            <div className="w-1/2 pl-8">
              <Card className="bg-blue-500 text-white overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Visualize Your Spending</h3>
                      <p className="text-blue-100 text-sm mb-3">
                        Transform your data into beautiful, actionable insights.
                      </p>
                      <div className="bg-blue-400 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">📊 Analytics Preview</h4>
                        <p className="text-xs text-blue-100">
                          Interactive charts and patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 3: Command Center */}
          <div className="relative flex items-center mb-16">
            <div className="w-1/2 pr-8">
              <Card className="bg-purple-500 text-white overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white text-purple-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Command Center</h3>
                      <p className="text-purple-100 text-sm mb-3">
                        Your financial command center with real-time insights and tracking.
                      </p>
                      <div className="bg-purple-400 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">📊 Dashboard Tour</h4>
                        <p className="text-xs text-purple-100">
                          Complete financial health overview.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            <div className="w-1/2 pl-8">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total Balance</p>
                    <p className="text-lg font-bold text-emerald-600">$2,450</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Monthly Savings</p>
                    <p className="text-lg font-bold text-blue-600">$1,200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: SmartAdvisor AI */}
          <div className="relative flex items-center">
            <div className="w-1/2 pr-8">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-500 text-sm">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      "Based on your spending patterns, I recommend reducing dining out by 20% to meet your savings goal."
                    </p>
                    <p className="text-xs text-gray-400 mt-2">AI Financial Advisor</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            <div className="w-1/2 pl-8">
              <Card className="bg-gradient-to-r from-orange-400 to-orange-500 text-white overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white text-orange-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">SmartAdvisor AI</h3>
                      <p className="text-orange-100 text-sm mb-3">
                        Get personalized financial advice powered by AI technology.
                      </p>
                      <div className="bg-orange-400 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">🤖 AI Demo</h4>
                        <p className="text-xs text-orange-100">
                          Interactive AI financial assistant.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-blue-600 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Life?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already taken control of their finances with FinFlow.
          </p>
          <button className="bg-white text-emerald-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            Get Started Today →
          </button>
        </div>
      </section>
    </div>
  );
}