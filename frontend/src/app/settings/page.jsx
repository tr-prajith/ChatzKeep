"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Notifications from "../components/Notifications";
import { connectSocket } from "../socket/socket";
import { getCurrentUser, updateProfile, getChats } from "../services/api/auth"; // Imported getChats
const MapPreview = dynamic(() => import("../components/MapPreview"), { ssr: false });

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setBio(user.bio || "");
        setAddress(user.address || "");
        setCity(user.city || "");
        setState(user.state || "");
        setPincode(user.pincode || "");
      } catch (error) {
        console.error("Error loading user profile data:", error);
      }
    };

    loadUser();
  }, []);

  
  useEffect(() => {
    const loadNotificationChats = async () => {
      try {
        const data = await getChats();
        if (currentUser && data) {
          const processedAlerts = data
            .map((chat) => {
              const otherUser = chat.participants?.find((user) => user._id !== currentUser?._id);
              if (!otherUser) return null;

              return {
                _id: chat._id,
                senderName: otherUser.firstName || otherUser.email?.split("@")[0],
                senderAvatar: otherUser.avatar || null,
                text: chat.latestMessage?.text || "Click to view conversation thread history...",
                createdAt: chat.updatedAt || chat.latestMessage?.createdAt || null,
              };
            })
            .filter(Boolean);

          setLiveAlerts(processedAlerts);
        }
      } catch (err) {
        console.log("Error binding data onto settings notification array:", err);
      }
    };

    if (currentUser) {
      loadNotificationChats();
    }
  }, [currentUser]);


  useEffect(() => {
    const sock = connectSocket();

    sock.on("receiveMessage", (msg) => {
      const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
      
      if (senderId && currentUser && senderId !== currentUser._id) {
        const freshAlert = {
          _id: msg._id || Date.now().toString(),
          senderName: msg.senderName || "Admin Hospital",
          senderAvatar: msg.senderAvatar || null,
          text: msg.text || "Sent a file attachment.",
          createdAt: msg.createdAt || new Date().toISOString()
        };
        setLiveAlerts((prev) => [freshAlert, ...prev]);
      }
    });

    return () => {
      sock.off("receiveMessage");
      sock.disconnect();
    };
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      const res = await updateProfile({
        firstName,
        lastName,
        bio,
        address,
        city,
        state,
        pincode,
      });

      const updatedUser = res?.user || await getCurrentUser();
      setCurrentUser(updatedUser);

      setIsEditing(false);
      alert("Profile Updated Successfully");
    } catch (error) {
      console.error("Failed to execute data state patch:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex font-sans overflow-hidden text-[#111111]">
      <Sidebar />

      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <Header 
          title="Settings" 
          currentUser={currentUser} 
          onNotificationClick={() => setShowNotifPanel(!showNotifPanel)}
        >
          <Notifications 
            isOpen={showNotifPanel}
            onClose={() => setShowNotifPanel(false)}
            notifications={liveAlerts}
          />
        </Header>

        <main className="flex-1 p-6 flex gap-6 overflow-hidden bg-[#FAFAFA]">
          
          <div className="w-[200px] h-full bg-white border border-[#EEEEEE] rounded-[24px] p-4 shrink-0 shadow-sm">
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-[#F4FBF9] text-[#1F6E5C] font-medium text-xs rounded-xl transition-all">
              <span>📋</span>
              General
            </button>
          </div>

          <div className="flex-1 h-full bg-white border border-[#EEEEEE] rounded-[24px] p-8 overflow-y-auto shadow-sm flex flex-col justify-between custom-scrollbar">
            <div className="space-y-8 w-full">
              {/* PERSONAL INFORMATION CARD CONTAINER */}
              <div className="w-full border border-neutral-100 rounded-[20px] p-6 space-y-6 relative">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider absolute -top-2.5 left-5 bg-white px-2">
                  Personal information
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 w-full">
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">First name</h4>
                    {isEditing ? (
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-sm font-medium text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-sm font-medium text-[#111111]">{currentUser?.firstName || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">Last name</h4>
                    {isEditing ? (
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-sm font-medium text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-sm font-medium text-[#111111]">{currentUser?.lastName || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">Email address</h4>
                    <p className="text-sm font-medium text-[#111111] break-all">{currentUser?.email || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">Phone number</h4>
                    <p className="text-sm font-medium text-[#111111]">{currentUser?.phone || "-"}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <h4 className="text-[11px] text-neutral-400 mb-1">Bio</h4>
                  {isEditing ? (
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="text-xs text-[#555555] leading-relaxed max-w-3xl w-full bg-transparent border border-neutral-200 p-2 rounded-lg outline-none focus:border-[#2F8D78]" />
                  ) : (
                    <p className="text-xs text-[#555555] leading-relaxed max-w-3xl whitespace-pre-line">{currentUser?.bio || "No biography details available yet."}</p>
                  )}
                </div>
              </div>

              {/* ADDRESS DETAILS SECTIONS */}
              <div className="w-full border border-neutral-100 rounded-[20px] p-6 space-y-6 relative">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider absolute -top-2.5 left-5 bg-white px-2">Address</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 w-full">
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">City</h4>
                    {isEditing ? (
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="text-sm font-medium text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-sm font-medium text-[#111111]">{currentUser?.city || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">State</h4>
                    {isEditing ? (
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="text-sm font-medium text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-sm font-medium text-[#111111]">{currentUser?.state || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">Postal code</h4>
                    {isEditing ? (
                      <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="text-sm font-medium text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-sm font-medium text-[#111111]">{currentUser?.pincode || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-1">Area / Address</h4>
                    {isEditing ? (
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="text-xs text-[#111111] bg-transparent border-b border-[#2F8D78] outline-none w-full py-0.5" />
                    ) : (
                      <p className="text-xs text-[#111111] leading-relaxed">{currentUser?.address || "-"}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-2.5 w-full">
                  <div>
                    <h4 className="text-[11px] text-neutral-400 mb-0.5">Detective map</h4>
                    <button className="text-[11px] text-[#2F8D78] font-medium hover:underline">Choose on map</button>
                  </div>
                  <div className="w-full h-[180px] rounded-2xl overflow-hidden relative border border-neutral-100 bg-neutral-100 z-0">
                    <MapPreview lat={11.0168} lng={76.9558} />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end pt-6 shrink-0 gap-3">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="h-11 px-5 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 text-xs font-semibold rounded-xl transition-all">Cancel</button>
                  <button onClick={handleUpdate} className="h-11 px-6 bg-[#2F8D78] hover:bg-[#257261] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"><span>💾</span>Save Profile</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="h-11 px-6 bg-[#1F6E5C] hover:bg-[#185547] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"><span>📝</span>Edit profile</button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;