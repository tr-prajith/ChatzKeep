"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

 
  const isActive = (path) => pathname === path;

  return (
    <div className="w-[240px] h-full bg-white border-r border-[#EEEEEE] flex flex-col justify-between p-5 shrink-0">
      <div className="w-full">
        
        
        <div className="flex items-center gap-3 mb-8 px-2">
          
          <button 
            type="button" 
            className="text-neutral-600 hover:text-[#2F8D78] transition-colors p-1 -ml-1 focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2.5" 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
              />
            </svg>
          </button>

          
          <img src="/logo.png" alt="Chatzkeep Logo" className="h-6 w-auto object-contain" />
        </div>

    
        <nav className="space-y-2">
          <Link 
            href="/chat" 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive("/chat") 
                ? "bg-[#2F8D78] text-white" 
                : "text-[#777777] hover:bg-[#FAFAFA]"
            }`}
          >
            <span className={`w-4 h-4 border rounded-sm flex items-center justify-center text-[10px] ${
              isActive("/chat") ? "border-white" : "border-current"
            }`}>
              M
            </span>
            Message
          </Link>

          <Link 
            href="/settings" 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive("/settings") 
                ? "bg-[#2F8D78] text-white" 
                : "text-[#777777] hover:bg-[#FAFAFA]"
            }`}
          >
            <span className={`w-4 h-4 border rounded-sm flex items-center justify-center text-[10px] ${
              isActive("/settings") ? "border-white" : "border-current"
            }`}>
              S
            </span>
            Settings
          </Link>
        </nav>
      </div>

      {/* Bottom Promotion Card Component */}
      <div className="w-full bg-[#2F8D78] rounded-2xl p-4 text-white relative overflow-hidden flex flex-col items-center text-center">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <span className="text-xs">✦</span>
        </div>
        <p className="text-xs font-semibold leading-snug">Get Unlimited Access and feel free.</p>
        <p className="text-[10px] text-white/70 mt-1 leading-normal max-w-[130px]">Subscription Keeps Going...</p>
        <button className="mt-4 w-full bg-white text-[#2F8D78] font-semibold text-xs py-2 rounded-lg hover:bg-neutral-100 transition-colors">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default Sidebar;