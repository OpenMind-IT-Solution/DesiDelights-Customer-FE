"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/authService";
import { toast } from "react-toastify";
import axios from "axios";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successSent, setSuccessSent] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.message || "Reset link sent!");
      setSuccessSent(true);
      setEmail("");
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const errorMsg = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Failed to send reset link."
        : "Failed to send reset link.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-6">
          Forgot Password
        </h1>

        {successSent ? (
          <div className="text-center">
            <div className="text-5xl mb-4 text-[#FA664D]">📬</div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 rounded-full bg-[#FA664D] text-white 
              font-semibold text-lg hover:bg-[#e85a43] 
              active:scale-[0.98] transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed text-center">
              Enter your email address below and we will send you a secure link to reset your password.
            </p>

            <label className="block text-sm font-medium text-[#1f2a44] mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
              focus:border-[#FA664D] transition mb-6"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#FA664D] text-white 
              font-semibold text-lg hover:bg-[#e85a43] 
              active:scale-[0.98] transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!successSent && (
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#FA664D] font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
