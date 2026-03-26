"use client";
import {useState} from "react";

export default function GuestLogin() {
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("OTP sent to " + mobile);
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
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
            focus:border-[#FA664D] transition mb-6"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#FA664D] text-white 
            font-semibold text-lg hover:bg-[#e85a43] transition"
          >
            Next
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-[#FA664D] cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
