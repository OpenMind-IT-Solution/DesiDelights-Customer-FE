"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("All fields required");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        {/* Email */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-2 block">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-500 mb-2 block">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center text-sm mb-8">
          <label className="flex items-center gap-2 text-gray-500">
            <input type="checkbox" className="accent-[#FA664D]" />
            Remember Me
          </label>

          <Link
            href="/forgot-password"
            className="text-[#FA664D] hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
          hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-[#FA664D] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
