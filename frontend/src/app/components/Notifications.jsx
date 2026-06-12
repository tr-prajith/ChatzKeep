"use client";

import React from "react";


const Notifications = ({ isOpen, onClose, notifications = [] }) => {
  
  if (!isOpen) return null;

  return (
    <div className="relative">
      
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      {/* Notification Dropdown Container Card */}
      <div className="absolute right-8 top-2 w-[360px] bg-white rounded-3xl border border-[#EEEEEE] shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#111111]">Notification</h3>
          
          
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs p-1 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 mb-2">
          <button className="flex-1 pb-2 text-[#2F8D78] border-b-2 border-[#2F8D78] text-left flex items-center gap-1">
            All <span className="w-1.5 h-1.5 bg-[#2F8D78] rounded-full"></span>
          </button>
          <button className="flex-1 pb-2 text-center hover:text-neutral-600 transition-colors">Unread</button>
          <button className="flex-1 pb-2 text-right hover:text-neutral-600 transition-colors">Archive</button>
        </div>

        {/* LIST AREA */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-50 pr-1 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.slice(0, 10).map((notif, idx) => {
              const senderInitial = notif.senderName?.charAt(0).toUpperCase() || "U";

              return (
                <div
                  key={notif._id || idx}
                  className="py-3 flex gap-3 items-start hover:bg-[#FAFAFA] rounded-xl px-2 -mx-2 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-xs font-semibold text-gray-700 overflow-hidden">
                    {notif.senderAvatar ? (
                      <img src={notif.senderAvatar} alt="Sender" className="w-full h-full object-cover" />
                    ) : (
                      senderInitial
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold text-[#111111] truncate">
                        {notif.senderName || "Admin Hospital"}
                      </h4>
                      <span className="text-[9px] text-neutral-400 ml-2 shrink-0">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-normal">
                      {notif.text || "New message received"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-neutral-400">
              No new notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;