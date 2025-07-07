"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="FinFlow Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <Link href="/" className="ml-3 text-xl font-bold tracking-tight">
              FinFlow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">           
            <Link href="/transactions" className="relative text-white hover:text-gold-300 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-300 after:transition-all after:duration-300 hover:after:w-full">
              Transactions
            </Link>
            <Link href="/analytics" className="relative text-white hover:text-gold-300 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-300 after:transition-all after:duration-300 hover:after:w-full">
              Analytics
            </Link>
            <Link href="/ai-advisor" className="relative text-white hover:text-gold-300 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-300 after:transition-all after:duration-300 hover:after:w-full">
              WealthWise AI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}