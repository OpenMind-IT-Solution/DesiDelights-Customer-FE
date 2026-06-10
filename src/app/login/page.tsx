"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, guestLogin, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const normalizePhone = (value: string) => {
    let cleaned = value.replace(/[^+\d]/g, "").replace(/(?!^)\+/g, "");
    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }
    return cleaned;
  };

  const phoneRegex = /^(?:\+|00)?[1-9]\d{7,14}$/;

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);
      await login({ login: email, password });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Login successful ✅");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA664D]"></div>
      </div>
    );
  }

  const handleGuestLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const normalizedPhone = normalizePhone(guestPhoneNumber).trim();

    if (!normalizedPhone || !phoneRegex.test(normalizedPhone)) {
      toast.error("Please enter a valid phone number with country code");
      return;
    }

    try {
      setLoading(true);
      await guestLogin(normalizedPhone);
      toast.success("Guest login successful ✅");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Guest login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Welcome Back
        </h2>

        {!showGuestForm ? (
          <>
            <form onSubmit={handleLogin}>
              <div className="mb-5 sm:mb-6">
                <label className="text-sm text-gray-500 mb-2 block">
                  Email
                </label>
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
                <label className="text-sm text-gray-500 mb-2 block">
                  Password
                </label>
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
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#FA664D]"
                  />
                  Remember Me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[#FA664D] hover:underline text-right"
                >
                  Forgot Password
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
                hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg 
                active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-4 mt-4">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  Or
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowGuestForm(true);
                }}
                disabled={loading}
                className="w-full py-3 rounded-full border-2 border-[#FA664D] text-[#FA664D] font-semibold 
              hover:bg-[#fa664d10] transition-all duration-200 
              active:scale-[0.98] disabled:opacity-70"
              >
                Login as Guest
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => {
                setShowGuestForm(false);
              }}
              className="mb-6 text-sm text-gray-500 hover:text-[#FA664D] flex items-center gap-2"
            >
              ← Back to Login
            </button>

            <h3 className="text-xl font-semibold mb-2">Guest Checkout</h3>
            <p className="text-sm text-gray-500 mb-6">
              Enter your phone number to continue as a guest.
            </p>

            <form onSubmit={handleGuestLogin}>
              <div className="mb-8">
                <label className="text-sm text-gray-500 mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g., +327123456789"
                  value={guestPhoneNumber}
                  onChange={(e) => {
                    setGuestPhoneNumber(normalizePhone(e.target.value));
                  }}
                  maxLength={16}
                  className="w-full px-2 py-3 text-sm sm:text-base border-b border-gray-300 outline-none 
                  focus:border-[#FA664D] transition bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading || !phoneRegex.test(normalizePhone(guestPhoneNumber))
                }
                className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
                hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg 
                active:scale-[0.98] disabled:opacity-70 disabled:bg-gray-300 disabled:shadow-none"
              >
                {loading ? "Processing..." : "Continue as Guest"}
              </button>
            </form>
          </div>
        )}

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
