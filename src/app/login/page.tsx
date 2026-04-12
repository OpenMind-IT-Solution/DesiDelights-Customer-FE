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
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const userData = {
        name: email.split("@")[0],
        email: email,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert("Login successful ✅");

      router.push("/");
      router.refresh();
    } catch (error) {
      alert("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Welcome Back
        </h2>

        <div className="mb-5 sm:mb-6">
          <label className="text-sm text-gray-500 mb-2 block">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-3 text-sm sm:text-base border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="text-sm text-gray-500 mb-2 block">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-3 text-sm sm:text-base border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm mb-6 sm:mb-8">
          <label className="flex items-center gap-2 text-gray-500">
            <input type="checkbox" className="accent-[#FA664D]" />
            Remember Me
          </label>

          <Link
            href="/forgot-password"
            className="text-[#FA664D] hover:underline text-right"
          >
            Forgot Password
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
          hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg 
          active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6 sm:mt-8">
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
