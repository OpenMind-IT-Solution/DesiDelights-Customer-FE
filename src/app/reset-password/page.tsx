"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!password || !confirm) {
      alert("Please fill all fields");
      return;
    }

    if (password != confirm) {
      alert("password do not match");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      alert("Password updated successfully!");

      router.push("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
          focus:border-[#FA664D]"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-[#FA664D] 
          focus:border-[#FA664D]"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white 
          font-semibold text-lg hover:bg-[#e85a43] 
          active:scale-[0.98] transition disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
