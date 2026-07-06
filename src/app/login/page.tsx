"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { countries } from "@/data/countries";

export default function LoginPage() {
  const router = useRouter();
  const { login, guestLogin, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [guestCountryCode, setGuestCountryCode] = useState("+32");
  const [loading, setLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const countryPickerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search) || c.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target as Node)) {
        setShowCountryPicker(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showCountryPicker && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showCountryPicker]);

  const normalizePhone = (value: string) => {
    let cleaned = value.replace(/[^+\d]/g, "").replace(/(?!^)\+/g, "");
    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }
    return cleaned;
  };

  const phoneRegex = /^(?:\+|00)?[1-9]\d{7,14}$/;

  const normalizeCountryCode = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    const digitsOnly = cleaned.replace(/\+/g, "");
    return digitsOnly ? `+${digitsOnly}` : "";
  };

  const selectedGuestCountry = countries.find((c) => c.code === guestCountryCode) || {
    code: guestCountryCode || "+32",
    flag: "🌍",
    name: "Custom code",
    label: "Custom",
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email field is required.";
    }

    if (!password) {
      newErrors.password = "Password field is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await login({ login: email, password });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Login successful ✅");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Login failed ❌";

      setErrors({ general: errorMessage });
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

    const fullNumber = guestCountryCode + guestPhoneNumber;
    const normalizedPhone = normalizePhone(fullNumber).trim();
    const newErrors: Record<string, string> = {};

    if (!guestPhoneNumber) {
      newErrors.guestPhone = "Phone field is required.";
    } else if (!phoneRegex.test(normalizedPhone)) {
      newErrors.guestPhone = "Please enter a valid phone number with country code.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await guestLogin(normalizedPhone);
      toast.success("Guest login successful ✅");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Guest login failed ❌";

      setErrors({ general: errorMessage });
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
            {errors.general && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-5 sm:mb-6">
                <label className="text-sm text-gray-500 mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "", general: "" }));
                  }}
                  className="w-full px-2 py-3 text-sm sm:text-base border-b border-gray-300 outline-none focus:border-[#FA664D] transition bg-transparent"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="text-sm text-gray-500 mb-2 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "", general: "" }));
                  }}
                  className="w-full px-2 py-3 text-sm sm:text-base border-b border-gray-300 outline-none focus:border-[#FA664D] transition bg-transparent"
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
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
                <Link href="/forgot-password" className="text-[#FA664D] hover:underline text-right">
                  Forgot Password
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-4 mt-4">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuestForm(true)}
                disabled={loading}
                className="w-full py-3 rounded-full border-2 border-[#FA664D] text-[#FA664D] font-semibold hover:bg-[#fa664d10] transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
              >
                Login as Guest
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setShowGuestForm(false)}
              className="mb-6 text-sm text-gray-500 hover:text-[#FA664D] flex items-center gap-2"
            >
              ← Back to Login
            </button>

            <h3 className="text-xl font-semibold mb-2">Guest Checkout</h3>
            <p className="text-sm text-gray-500 mb-6">Enter your phone number to continue as a guest.</p>

            {errors.general && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleGuestLogin}>
              <div className="mb-8">
                <label className="text-sm text-gray-500 mb-2 block">Phone Number</label>
                <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#FA664D] focus-within:border-[#FA664D] transition">
                  <div ref={countryPickerRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryPicker((value) => !value)}
                      className="flex items-center gap-1.5 bg-gray-50 px-3 py-3 h-full text-sm font-semibold text-gray-700 border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap rounded-l-lg"
                    >
                      <span>{selectedGuestCountry.flag}</span>
                      <span>{selectedGuestCountry.code}</span>
                      <svg className={`w-3 h-3 text-gray-400 transition-transform ${showCountryPicker ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showCountryPicker && (
                      <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none focus:border-[#FA664D]"
                          />
                        </div>
                        <div className="max-h-[13rem] overflow-y-auto py-1">
                          {filtered.length > 0 ? (
                            filtered.map((country) => (
                              <button
                                key={country.label}
                                type="button"
                                onClick={() => {
                                  setGuestCountryCode(country.code);
                                  setShowCountryPicker(false);
                                  setSearch("");
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors ${
                                  guestCountryCode === country.code ? "bg-[#fa664d10] text-[#FA664D] font-semibold" : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-semibold">{country.code}</span>
                                <span className="text-xs text-gray-400 truncate">{country.name}</span>
                              </button>
                            ))
                          ) : (
                            <p className="px-4 py-3 text-xs text-gray-400">No countries found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    placeholder="123 456 7890"
                    value={guestPhoneNumber}
                    onChange={(e) => {
                      setGuestPhoneNumber(normalizePhone(e.target.value.replace(/^\+/, "")));
                      setErrors((prev) => ({ ...prev, guestPhone: "", general: "" }));
                    }}
                    maxLength={10}
                    className="flex-1 px-4 py-3 outline-none"
                  />
                </div>
                {errors.guestPhone && <p className="mt-2 text-sm text-red-600">{errors.guestPhone}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !guestPhoneNumber}
                className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold hover:bg-[#e85a43] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:bg-gray-300 disabled:shadow-none"
              >
                {loading ? "Processing..." : "Continue as Guest"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6 sm:mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#FA664D] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
