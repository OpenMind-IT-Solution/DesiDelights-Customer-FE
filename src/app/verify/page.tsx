"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState, Suspense} from "react";

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#1f2a44] mb-3">
          Verify Email
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          Enter the verification code sent to <br />
          <span className="font-semibold text-[#1f2a44]">{email}</span>
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-4 text-center text-lg tracking-[8px] rounded-xl border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#FA664D]
          focus:border-[#FA664D] transition mb-3"
        />

        <div className="text-center mb-6">
          <span className="text-gray-400 text-sm">Didn't receive code? </span>
          <button className="text-[#FA664D] text-sm font-medium hover:underline">
            Resend
          </button>
        </div>

        <button
          onClick={() => router.push("/reset-password")}
          className="w-full py-3 rounded-full bg-[#FA664D] text-white
          font-semibold text-lg hover:bg-[#e85a43]
          active:scale-[0.98] transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
