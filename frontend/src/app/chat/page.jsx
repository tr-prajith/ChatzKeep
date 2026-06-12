"use client";

import { useEffect, useState, useRef } from "react";
import { connectSocket } from "../socket/socket";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Notifications from "../components/Notifications"; 

import {
  accessChat,
  getChats,
  getCurrentUser,
  getMessages,
  getUsers,
  uploadFile,
} from "../api/auth";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const messagesEndRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUsers();
  }, []);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error verifying authentication profile:", err);
      }
    };
    loadUser();
  }, []);

  // Socket connection & real-time message stream handling
  useEffect(() => {
    const sock = connectSocket();
    setSocket(sock);

    sock.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);

      const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
      
      if (senderId && currentUser && senderId !== currentUser._id) {
        const senderProfile = users.find((u) => u._id === senderId);
        
        const freshAlert = {
          _id: msg._id || Date.now().toString(),
          senderName: senderProfile?.firstName || msg.senderName || "New Message",
          senderAvatar: senderProfile?.avatar || null,
          text: msg.text || "Sent an attachment.",
          createdAt: msg.createdAt || new Date().toISOString()
        };

        setLiveAlerts((prev) => [freshAlert, ...prev]);
      }
    });

    return () => {
      sock.off("receiveMessage");
      sock.disconnect();
    };
  }, [currentUser, users]);

  // Join room
  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("joinChat", chatId);
  }, [socket, chatId]);

  // Open chat from user directory list
  const handleUserClick = async (userId) => {
    try {
      const clickedUser = users.find((user) => user._id === userId);
      setSelectedUser(clickedUser);

      const chat = await accessChat(userId);
      setChatId(chat._id);

      const msgs = await getMessages(chat._id);
      setMessages(msgs || []);
    } catch (error) {
      console.error("Error setting conversational active path:", error);
    }
  };

  // Open chat from conversation list history panel
  const handleChatClick = async (chat) => {
    try {
      setChatId(chat._id);
      const otherUser = getOtherUser(chat);
      setSelectedUser(otherUser || null);

      const msgs = await getMessages(chat._id);
      setMessages(msgs || []);
    } catch (error) {
      console.error("Error indexing historical conversation payload grids:", error);
    }
  };

  // Send message
  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!socket || !chatId || !text || !currentUser) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: currentUser._id,
      text,
      file: uploadedFile,
    });

    setText("");
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const data = await uploadFile(formData);
      setUploadedFile(data?.file || null);
    } catch (error) {
      console.error("Failed pipeline media multiform attachment uploads:", error);
    }
  };

  
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getChats();
        setChats(data || []);

        
        if (currentUser && data) {
          const processedAlerts = data
            .map((chat) => {
              const otherUser = chat.participants?.find((user) => user._id !== currentUser?._id);
              if (!otherUser) return null;

              return {
                _id: chat._id,
                senderName: otherUser?.firstName || otherUser?.email?.split("@")[0] || "User Thread",
                senderAvatar: otherUser?.avatar || null,
                text: chat.latestMessage?.text || "Click to view conversation thread history...",
                createdAt: chat.updatedAt || chat.latestMessage?.createdAt || null,
              };
            })
            .filter(Boolean);

          setLiveAlerts(processedAlerts);
        }
      } catch (err) {
        console.error("Failed structural processing constraints layout parameters:", err);
      }
    };
    
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const getOtherUser = (chat) => {
    return chat?.participants?.find((user) => user._id !== currentUser?._id);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex font-sans overflow-hidden text-[#111111]">
      
      <Sidebar />

      <div className="flex-1 h-full flex flex-col overflow-hidden">

        <Header 
          title="Message" 
          search={search} 
          setSearch={setSearch} 
          currentUser={currentUser} 
          onNotificationClick={() => setShowNotifPanel(!showNotifPanel)}
        >
          <Notifications 
            isOpen={showNotifPanel}
            onClose={() => setShowNotifPanel(false)}
            notifications={liveAlerts}
          />
        </Header>

        <main className="flex-1 p-6 overflow-hidden bg-[#FAFAFA]">
          <div className="w-full h-full bg-white border border-[#2F8D78] rounded-[24px] flex overflow-hidden shadow-sm">

            
            <div className="w-[340px] h-full border-r border-[#EEEEEE] flex flex-col shrink-0">
              <div className="p-4 border-b border-[#EEEEEE] space-y-3">
                <div className="flex border-b border-neutral-100 text-xs font-medium text-neutral-400">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 pb-2 text-center transition-all ${activeTab === "all" ? "text-[#2F8D78] border-b-2 border-[#2F8D78]" : "hover:text-neutral-600"}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("unread")}
                    className={`flex-1 pb-2 text-center transition-all ${activeTab === "unread" ? "text-[#2F8D78] border-b-2 border-[#2F8D78]" : "hover:text-neutral-600"}`}
                  >
                    Unread
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 pb-2 text-center transition-all ${activeTab === "general" ? "text-[#2F8D78] border-b-2 border-[#2F8D78]" : "hover:text-neutral-600"}`}
                  >
                    General
                  </button>
                </div>
              </div>

              
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-50">
                {search ? (
                  users
                    .filter((u) => u._id !== currentUser?._id)
                    .filter((u) => {
                      const query = search.toLowerCase();
                      return u.email?.toLowerCase().includes(query) || u.phone?.includes(query);
                    })
                    .map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className={`p-4 flex gap-3 items-center cursor-pointer transition-all ${selectedUser?._id === user._id ? "bg-[#FAFAFA] border-l-4 border-[#2F8D78]" : "hover:bg-neutral-50/70"}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-[#111111] truncate">{user.firstName || user.email}</h4>
                          <p className="text-[11px] text-neutral-400 truncate">{user.phone || "Click to open chat"}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  chats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    const isActive = chatId === chat._id;
                    if (!otherUser) return null;

                    return (
                      <div
                        key={chat._id}
                        onClick={() => handleChatClick(chat)}
                        className={`p-4 flex gap-3 items-center cursor-pointer transition-all ${isActive ? "bg-[#FAFAFA] border-l-4 border-[#2F8D78]" : "hover:bg-neutral-50/70"}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {otherUser.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-xs font-semibold text-[#111111] truncate">
                              {otherUser.firstName || otherUser.email?.split('@')[0]}
                            </h4>
                            <span className="text-[10px] text-neutral-400 shrink-0">Active</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">{otherUser.email}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

           
            <div className="flex-1 h-full flex flex-col bg-white">
              {selectedUser ? (
                <>
                  <div className="h-14 w-full border-b border-[#EEEEEE] px-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                        {selectedUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#111111]">{selectedUser.firstName || selectedUser.email}</h3>
                        <span className="text-[10px] text-emerald-500 font-medium block">● Online</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="text-xs font-medium text-[#2F8D78] border border-[#2F8D78]/20 px-3 py-1.5 rounded-lg hover:bg-[#2F8D78]/5 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Messages Scroll Feed */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
                    {messages.map((m) => {
                      const senderId = typeof m.sender === "object" ? m.sender?._id : m.sender;
                      const isMe = senderId === currentUser?._id;
                      return (
                        <div key={m._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full space-y-1`}>
                          <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                            <div className={`text-xs p-3 rounded-2xl leading-relaxed ${isMe ? "bg-[#2F8D78] text-white rounded-tr-none shadow-sm" : "bg-[#FAFAFA] border border-[#EEEEEE] text-[#111111] rounded-tl-none"}`}>
                              {m.text}
                            </div>
                            <span className="text-[10px] text-neutral-400 mt-1 px-1">
                              {formatTime(m.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef}></div>
                  </div>

                  
                  <form onSubmit={sendMessage} className="h-16 w-full border-t border-[#EEEEEE] px-4 flex items-center gap-3 shrink-0 bg-white">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type message..."
                      className="flex-1 h-10 px-4 text-xs bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl outline-none focus:bg-transparent focus:border-[#2F8D78] transition-all"
                    />
                    <input
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="text-xs"
                    />
                    <button
                      type="submit"
                      className="w-10 h-10 bg-[#2F8D78] hover:bg-[#257261] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                    >
                      ➔
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400">
                  <span className="text-3xl mb-2">💬</span>
                  <p className="text-sm font-medium">Select a user or conversation thread to begin messaging</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;