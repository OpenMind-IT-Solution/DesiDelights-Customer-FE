"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { countries } from "@/data/countries";

export default function GuestLogin() {
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+32");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, guestLogin } = useAuth();
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const normalizeCountryCode = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    const digitsOnly = cleaned.replace(/\+/g, "");
    return digitsOnly ? `+${digitsOnly}` : "";
  };

  const current = countries.find((c) => c.code === countryCode) || {
    code: countryCode || "+32",
    flag: "🌍",
    name: "Custom code",
    label: "Custom",
  };

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
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (pickerOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [pickerOpen]);

  const normalizePhone = (value: string) => {
    let cleaned = value.replace(/[^+\d]/g, "").replace(/(?!^)\+/g, "");
    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }
    return cleaned;
  };

  const phoneRegex = /^(?:\+|00)?[1-9]\d{7,14}$/;

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA664D]"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullNumber = countryCode + mobile;
    const normalizedMobile = normalizePhone(fullNumber).trim();
    if (!mobile) {
      toast.error("Please enter your mobile number.");
      return;
    }

    if (!phoneRegex.test(normalizedMobile)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      await guestLogin(normalizedMobile);
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

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-6">
          Guest Login
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#1f2a44] mb-2">
            Mobile Number
          </label>

          <div className="flex mb-6 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#FA664D] focus-within:border-[#FA664D] transition">
            <div ref={pickerRef} className="relative">
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-gray-50 px-3 py-3 h-full text-sm font-semibold text-gray-700 border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap rounded-l-lg"
              >
                <span>{current.flag}</span>
                <span>{current.code}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${pickerOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {pickerOpen && (
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
                      filtered.map((c) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => {
                            setCountryCode(c.code);
                            setPickerOpen(false);
                            setSearch("");
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors ${
                            countryCode === c.code ? "bg-[#fa664d10] text-[#FA664D] font-semibold" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="font-semibold">{c.code}</span>
                          <span className="text-xs text-gray-400 truncate">{c.name}</span>
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
              value={mobile}
              onChange={(e) => setMobile(normalizePhone(e.target.value.replace(/^\+/, "")))}
              onBlur={() => {
                const nm = normalizePhone(mobile).trim().replace(/^\+/, "");
                setMobile(nm);
              }}
              required
              maxLength={10}
              className="flex-1 px-4 py-3 outline-none"
            />
          </div>

          {!phoneRegex.test(normalizePhone(countryCode + mobile).trim()) && mobile.length > 0 && (
            <p className="text-xs text-red-600 mb-3 -mt-4">Please enter a valid phone number.</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold text-lg hover:bg-[#e85a43] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} className="text-[#FA664D] cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
