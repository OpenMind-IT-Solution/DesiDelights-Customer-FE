"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      });

      toast.success("Profile updated ✅");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:py-10">

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          Edit Profile
        </h2>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-500 mb-2 block">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
              focus:border-[#FA664D] transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
              focus:border-[#FA664D] transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={16}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
              focus:border-[#FA664D] transition"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleUpdate}
          className="mt-8 w-full py-3 sm:py-4 rounded-full bg-[#FA664D] text-white font-semibold 
          hover:bg-[#e85a43] transition shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
