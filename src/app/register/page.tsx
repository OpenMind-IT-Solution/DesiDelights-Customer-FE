"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: {target: {name: any; value: any}}) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleRegister = async () => {
    const {name, email, phone, password, confirmPassword} = form;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return alert("All fields are required");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          {/* <p className="text-gray-500 text-sm mt-1">Join us</p> */}
        </div>

        {/* Name + Phone Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter Name"
              onChange={handleChange}
              className="w-full px-2 py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="+32 4xx xx xx xx"
              onChange={handleChange}
              className="w-full px-2 py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-2 block">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={handleChange}
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-2 block">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-2 block">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            onChange={handleChange}
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
          hover:bg-[#e85a43] transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-8">
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
