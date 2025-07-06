import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FinFlow</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Empowering individuals to take control of their financial future 
              through intelligent tracking, insightful analytics, and AI-powered advice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/ai-advisor" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  AI Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-emerald-300 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 FinFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}