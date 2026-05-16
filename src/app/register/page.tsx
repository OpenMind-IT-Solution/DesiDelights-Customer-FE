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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleRegister = async () => {
    const {name, email, phone, password, confirmPassword} = form;

    // ✅ Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 👉 If backend exists, call API here
      // Example:
      // const res = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

      // if (!res.ok) throw new Error("Registration failed");

      // 👉 Temporary fake delay (remove later)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Account created successfully ✅");

      // ✅ Clear form
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // ✅ Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full px-2 py-3 border-b border-gray-300 outline-none 
              focus:border-[#FA664D] transition bg-transparent"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
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
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
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
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
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
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            className="w-full px-2 py-3 border-b border-gray-300 outline-none 
            focus:border-[#FA664D] transition bg-transparent"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white font-semibold 
          hover:bg-[#e85a43] transition-all duration-200 shadow-lg 
          hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
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
