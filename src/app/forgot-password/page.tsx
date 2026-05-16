"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // ✅ ADD THIS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      router.push(`/verify?email=${email}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#1f2a44] mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            {isLoading ? "Sending..." : "Next"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#FA664D] font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
