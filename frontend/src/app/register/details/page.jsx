"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completeProfile } from '../../api/auth';

const Details = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !address.trim() ||
      !city.trim() ||
      !stateVal.trim() ||
      !pincode.trim()
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await completeProfile({
        address,
        city,
        state: stateVal,
        pincode,
      });

      console.log(res);
      router.push("/chat");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Profile completion failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full h-full flex">

        {/* Left Section (Form Container) */}
        <div className="w-1/2 h-full bg-[#FAFAFA] flex flex-col items-center justify-center px-4 relative">

          {/* Main Wrapper */}
          <div className="w-full max-w-[460px] flex flex-col items-center">

            {/* Form Card Box */}
            <div className="w-full bg-[#FFFFFF] rounded-[32px] px-10 py-10 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-[#EEEEEE]">

              {/* Logo and Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Chatzkeep Logo"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <h1 className="mt-6 text-[26px] font-bold text-[#111111]">Profile Details</h1>
                <p className="mt-1 text-xs text-[#777777] text-center tracking-wide">
                  Complete your registration info to connect to your workspace.
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <p className="text-red-500 text-xs text-center mb-4">
                  {error}
                </p>
              )}

              {/* Form Fields */}
              <form onSubmit={handleRegister} className="w-full space-y-5">

                {/* Address Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* City Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* State Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    State
                  </label>
                  <input
                    type="text"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* Pincode Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full h-12 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 bg-[#2F8D78] hover:bg-[#1F6E5C] text-white rounded-xl font-medium text-sm transition-colors shadow-sm mt-2 focus:outline-none"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>

              {/* Redirection Block */}
              <div className="mt-5 flex flex-col items-center gap-1">
                <span className="text-[11px] text-[#777777]">Do you have an account?</span>
                <Link
                  href="/login"
                  className="text-[11px] font-semibold text-[#2F8D78] hover:underline"
                >
                  Login
                </Link>
              </div>

            </div>

            {/* Footer Copyright Text */}
            <span className="mt-6 text-[11px] text-[#A3A3A3] tracking-wide">
              ©2026 Chatzkeep. All rights reserved.
            </span>

          </div>
        </div>

        {/* Right Section (Layered Image Stack with Single Doctor Asset) */}
        <div className="w-1/2 h-full relative flex items-center justify-center p-12 overflow-hidden">

          {/* Base Background Gradient Texture */}
          <img
            src="/reg-1.png"
            alt="Background Texture"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Glass Card Containment Container */}
          <div className="relative z-10 w-full max-w-[440px] h-[580px] rounded-[40px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col p-10 overflow-hidden">

            {/* 1. Left-Aligned Marketing Text Overlay */}
            <div className="mt-4 z-30 text-left w-full">
              <h2 className="text-[22px] font-normal text-white/90 leading-tight tracking-wide">
                Very good works are <br />
                waiting for you <br />
                <span className="font-bold text-white block mt-1">Register Now</span>
              </h2>
            </div>

            {/* 2. S-Curve Background Shape Vector Line */}
            <img
              src="/reg-3.png"
              alt="S Shape Vector Accent"
              className="absolute top-0 right-0 w-[70%] h-auto max-h-[85%] object-contain object-right-top pointer-events-none z-10 opacity-95"
            />

            {/* 3. New Single Doctor Asset (Hand pointing upward, fully contained) */}
            <div className="w-full h-[100%] absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center">
              <img
                src="/single-doctor.png"
                alt="Medical Practitioner pointing up"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Details;