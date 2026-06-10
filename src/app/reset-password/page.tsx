"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { authService } from "@/api/services/authService";
import { toast } from "react-toastify";
import axios from "axios";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate the reset token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setErrorMessage("No password reset token was provided.");
        setIsValidating(false);
        return;
      }

      try {
        await authService.validateResetToken(token);
        setTokenValid(true);
      } catch (err: unknown) {
        console.error("Token validation error:", err);
        const errorMsg = axios.isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message || "Invalid or expired password reset link."
          : "Invalid or expired password reset link.";
        setErrorMessage(errorMsg);
        setTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePasswordStrength = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9\s]/.test(pass);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Password must contain at least 1 uppercase letter.";
    if (!hasLower) return "Password must contain at least 1 lowercase letter.";
    if (!hasNumber) return "Password must contain at least 1 number.";
    if (!hasSpecial) return "Password must contain at least 1 special character.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or expired password reset link.");
      return;
    }

    if (!password || !confirm) {
      toast.error("Please fill all fields.");
      return;
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      toast.error(strengthError);
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        password,
        confirmPassword: confirm,
      });

      toast.success(response.message || "Password updated successfully!");
      router.push("/login");
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      const errorMsg = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || "Failed to update password."
        : "Failed to update password.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FA664D] mx-auto mb-4"></div>
        <p className="text-gray-500">Validating your reset token...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-3">
          Invalid Reset Link
        </h1>
        <p className="text-red-500 text-center mb-6 leading-relaxed">
          {errorMessage}
        </p>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          Please request a new reset link. Reset links expire after 15 minutes.
        </p>
        <button
          onClick={() => router.push("/forgot-password")}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white 
          font-semibold text-lg hover:bg-[#e85a43] 
          active:scale-[0.98] transition"
        >
          Request New Link
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-2">
        Reset Password
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        Please enter your new password below.
      </p>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 
        focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
        focus:border-[#FA664D] transition"
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 
        focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
        focus:border-[#FA664D] transition"
        required
      />

      <div className="mb-6 p-4 bg-[#f8fafc] rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-[#1f2a44] mb-1">Password Requirements:</p>
        <p className={password.length >= 8 ? "text-green-600 font-medium" : ""}>✓ Minimum 8 characters</p>
        <p className={/[A-Z]/.test(password) ? "text-green-600 font-medium" : ""}>✓ At least 1 uppercase letter</p>
        <p className={/[a-z]/.test(password) ? "text-green-600 font-medium" : ""}>✓ At least 1 lowercase letter</p>
        <p className={/[0-9]/.test(password) ? "text-green-600 font-medium" : ""}>✓ At least 1 number</p>
        <p className={/[^A-Za-z0-9\s]/.test(password) ? "text-green-600 font-medium" : ""}>✓ At least 1 special character</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-full bg-[#FA664D] text-white 
        font-semibold text-lg hover:bg-[#e85a43] 
        active:scale-[0.98] transition disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FA664D] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading page...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
