"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../services/api/auth";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !phone) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await registerUser({ email, password, phone });
      console.log("Register success:", res.data);
      router.push("/register/details");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <div className="w-full bg-[#FFFFFF] rounded-[32px] px-10 py-12 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.02)]">

              {/* Logo and Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Chatzkeep Logo"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <h1 className="mt-6 text-[26px] font-bold text-[#111111]">Register</h1>
                <p className="mt-1 text-xs text-[#777777] text-center tracking-wide">
                  welcome back! Sign in to your account.
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <p className="text-red-500 text-xs text-center mb-4">
                  {error}
                </p>
              )}

              {/* Form Fields */}
              <form onSubmit={handleRegister} className="w-full space-y-6">

                {/* Email Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-13 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-13 pl-4 pr-12 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors [&::-ms-reveal]:hidden [&::-webkit-password-reveal]:hidden"
                  />

                  {password.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-13 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 bg-[#2F8D78] hover:bg-[#257261] text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </form>

              {/* Redirection Block */}
              <div className="mt-6 flex flex-col items-center gap-1">
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
            <span className="mt-8 text-[11px] text-[#A3A3A3] tracking-wide">
              ©2026 Chatzkeep. All rights reserved.
            </span>

          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 h-full relative flex items-center justify-center p-12 overflow-hidden">
          <img
            src="/reg-1.png"
            alt="Background Texture"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 w-full max-w-[440px] h-[580px] rounded-[40px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col p-10 overflow-hidden">
            <div className="mt-4 z-30 text-left w-full">
              <h2 className="text-[22px] font-normal text-white/90 leading-tight tracking-wide">
                Very good works are <br />
                waiting for you <br />
                <span className="font-bold text-white block mt-1">Login Now</span>
              </h2>
            </div>

            <img
              src="/reg-3.png"
              alt="S Shape Vector Accent"
              className="absolute top-0 right-0 w-[70%] h-auto max-h-[85%] object-contain object-right-top pointer-events-none z-10 opacity-95"
            />

            <div className="w-full h-[80%] absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center">
              <img
                src="/reg-4.png"
                alt="Medical Personnel Team"
                className="w-full h-full object-cover object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;