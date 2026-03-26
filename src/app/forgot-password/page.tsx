"use client";
import {useState} from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Reset link sent!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit}>
          {/* LABEL */}
          <label className="block text-sm font-medium text-[#1f2a44] mb-2">
            Email
          </label>

          {/* INPUT */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
            focus:border-[#FA664D] transition mb-6"
          />

          {/* BUTTON (YOUR THEME) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#FA664D] text-white 
            font-semibold text-lg hover:bg-[#e85a43] 
            active:scale-[0.98] transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Next"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-[#FA664D] font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
