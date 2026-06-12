"use client";

import React from "react";

const Header = ({ title = "Message", search, setSearch, currentUser, onNotificationClick, children }) => {
  return (
    
    <header className="h-16 w-full bg-white border-b border-[#EEEEEE] px-8 flex items-center justify-between shrink-0 relative">
      <h1 className="text-xl font-bold text-[#111111]">{title}</h1>

      
      <div className="w-[320px] relative">
        <input
          type="text"
          placeholder="Search candidate, vacancy, etc..."
          value={search}
          onChange={(e) => setSearch?.(e.target.value)}
          className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl h-10 pl-4 pr-10 text-xs outline-none focus:border-[#2F8D78] transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">🔍</span>
      </div>

     
      <div className="flex items-center gap-4">
        
        
        <button 
          onClick={onNotificationClick}
          type="button"
          className="w-9 h-9 bg-[#F4FBF9] hover:bg-[#EAF7F4] rounded-full text-[#1F6E5C] flex items-center justify-center transition-colors relative focus:outline-none group shadow-sm border border-[#2F8D78]/5"
        >
          
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="2" 
            stroke="currentColor" 
            className="w-[18px] h-[18px]"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a3 3 0 11-5.714 0m5.714 0a3 3 0 11-3 3m3-3H9" 
            />
          </svg>
          
          
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white group-hover:scale-110 transition-transform"></span>
        </button>

        
        <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 bg-gray-100 flex items-center justify-center text-xs font-bold shadow-sm">
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      
      {children}
    </header>
  );
};

export default Header;