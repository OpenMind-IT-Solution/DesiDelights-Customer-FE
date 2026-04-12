"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      const nameParts = user.name ? user.name.split(" ") : ["", ""];

      setForm({
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleUpdate = () => {
    const updatedUser = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      phone: form.phone,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated ✅");

    router.push("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:py-10">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="text-[#FA664D] font-medium mb-6"
      >
        ← Back to Home
      </button>

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          Edit Profile
        </h2>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              First Name
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none 
              focus:border-[#FA664D] transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Last Name
            </label>
            <input
              name="lastName"
              value={form.lastName}
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
