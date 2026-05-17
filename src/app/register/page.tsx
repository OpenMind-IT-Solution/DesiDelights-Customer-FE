"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA664D]"></div>
      </div>
    );
  }

  const phoneRegex = /^\+?[1-9]\d{11,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const { name, email, phone, password, confirmPassword } = form;

    // ✅ Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number with country code (e.g., +32...)");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await signup({
        fullName: name,
        email,
        phoneNumber: phone,
        password
      });

      toast.success("Account created successfully ✅");

      // ✅ Clear form
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // ✅ Redirect to home page (signup usually logs the user in)
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
        </div>

        <form onSubmit={handleRegister}>
          {/* Name + Phone - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 sm:mb-6">
            <div>
              <label className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 block">Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full px-2 py-2 sm:py-3 border-b border-gray-300 outline-none 
                focus:border-[#FA664D] transition bg-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 block">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +327123456789"
                maxLength={16}
                className="w-full px-2 py-2 sm:py-3 border-b border-gray-300 outline-none 
                focus:border-[#FA664D] transition bg-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5 sm:mb-6">
            <label className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 block">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-2 py-2 sm:py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div className="mb-5 sm:mb-6">
            <label className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-2 py-2 sm:py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6 sm:mb-8">
            <label className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 block">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-2 py-2 sm:py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
            hover:bg-[#e85a43] transition-all duration-200 shadow-lg 
            hover:shadow-xl active:scale-[0.98] disabled:opacity-70 text-sm sm:text-base"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#FA664D] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
