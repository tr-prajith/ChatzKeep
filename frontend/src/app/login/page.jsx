"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/auth";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      console.log("Login success:", res.data);
      router.push("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full h-full flex">

        {/* Left Section (Form Container) */}
        <div className="w-1/2 h-full bg-[#FAFAFA] flex flex-col items-center justify-center px-4 relative">
          <div className="w-full max-w-[460px] flex flex-col items-center">

            {/* Form Card Box */}
            <div className="w-full bg-[#FFFFFF] rounded-[32px] px-10 py-12 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-[#EEEEEE]">

              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <img
                  src="/logo.png"
                  alt="Chatzkeep Logo"
                  className="h-7 w-auto object-contain"
                />
                <h1 className="mt-6 text-[26px] font-bold text-[#111111]">
                  Login
                </h1>
                <p className="mt-1 text-xs text-[#777777] text-center tracking-wide">
                  welcome back! Sign in to your account.
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <p className="text-red-500 text-xs text-center mb-4">
                  {error}
                </p>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="w-full space-y-6">

                {/* Email Input */}
                <div className="relative w-full group">
                  <label className="absolute -top-2 left-4 bg-white px-1.5 text-[11px] text-[#A3A3A3] font-normal transition-colors group-focus-within:text-[#2F8D78]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-13 px-4 border border-[#D4E5E1] rounded-xl outline-none text-sm text-[#111111] bg-transparent focus:border-[#2F8D78] transition-colors"
                  />
                  {isValidEmail && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2F8D78]"
                    />
                  )}
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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 bg-[#2F8D78] hover:bg-[#1F6E5C] text-white rounded-xl font-medium text-sm transition-colors shadow-sm focus:outline-none"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

              {/* Redirection Footer Link */}
              <div className="mt-6 flex flex-col items-center gap-1">
                <span className="text-[11px] text-[#777777]">
                  Don't have an account?
                </span>
                <Link
                  href="/register"
                  className="text-[11px] font-semibold text-[#2F8D78] hover:underline"
                >
                  Register now
                </Link>
              </div>

            </div>

            {/* Copyright layout bar */}
            <span className="mt-10 text-[11px] text-[#A3A3A3] tracking-wide">
              ©2026 Chatzkeep. All rights reserved.
            </span>

          </div>
        </div>

        {/* Right Section Graphic Banner */}
        <div className="w-1/2 h-full">
          <img
            src="/doctor.png"
            alt="Medical Staff Banner"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;