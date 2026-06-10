"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function GuestLogin() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, guestLogin } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

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

    const normalizedMobile = normalizePhone(mobile).trim();
    if (!normalizedMobile) {
      toast.error("Please enter your mobile number.");
      return;
    }

    if (!phoneRegex.test(normalizedMobile)) {
      toast.error("Please enter a valid phone number with country code.");
      return;
    }

    try {
      setLoading(true);
      await guestLogin(normalizedMobile);
      toast.success("Guest login successful ✅");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Guest login failed ❌");
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

          <input
            type="tel"
            placeholder="+91 9876543210"
            value={mobile}
            onChange={(e) => {
              setMobile(normalizePhone(e.target.value));
            }}
            onBlur={() => {
              const nm = normalizePhone(mobile).trim();
              setMobile(nm);
            }}
            required
            maxLength={16}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
            focus:border-[#FA664D] transition mb-6"
          />
          {!phoneRegex.test(normalizePhone(mobile).trim()) &&
            mobile.length > 0 && (
              <p className="text-xs text-red-600 mb-3">
                Please enter a valid phone number (include country code).
              </p>
            )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#FA664D] text-white 
            font-semibold text-lg hover:bg-[#e85a43] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#FA664D] cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
