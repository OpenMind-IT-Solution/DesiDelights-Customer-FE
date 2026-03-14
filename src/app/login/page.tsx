"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white max-w-md w-full p-10 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>

          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#FA664D]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Password</label>

          <input
            type="password"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#FA664D]"
          />
        </div>

        <div className="flex justify-between items-center text-sm mb-5">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember Me
          </label>

          <span className="text-[#FA664D] cursor-pointer">Forget Password</span>
        </div>

        <button className="w-full py-3 rounded-full text-white font-semibold bg-[#FA664D] hover:bg-[#e85a43] transition">
          Login
        </button>

        <div className="flex items-center gap-3 my-6">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-sm">Or</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button className="w-full py-3 rounded-full border border-[#FA664D] text-[#FA664D] hover:bg-[#FA664D]/10 transition">
          Login As Guest
        </button>
      </div>
    </div>
  );
}
