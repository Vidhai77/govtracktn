"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("loginId") || "User"; // Get login ID from local storage

    if (pathname.includes("collector")) {
      setUserRole("Collector");
    } else if (pathname.includes("dhead")) {
      setUserRole("District Head");
    } else if (pathname.includes("tenderer")) {
      setUserRole("Tenderer");
    } else {
      setUserRole(storedUser); // Default fallback
    }
  }, [pathname]);

  return (
    <nav className="bg-white text-black p-4 flex items-center justify-between sticky top-0 z-50 shadow-md shadow-indigo-200">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg"
          alt="TN Govt Logo"
          className="w-14 h-14 transition-transform duration-300 hover:scale-105"
        />
        <div className="text-indigo-700">
          <span className="text-xl font-bold block leading-tight">தமிழ்நாடு அரசு</span>
          <span className="text-xl font-semibold">Government of Tamil Nadu</span>
        </div>
      </div>

      {/* Center Section - Title */}
      <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">GovTrackTN</h1>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Quote */}
        <div className="flex items-center gap-4">
          <img
            src="/Thiruvalluvar.png"
            alt="Thiruvalluvar"
            className="w-16 h-16 transition-transform duration-300 hover:scale-105"
          />
          <span className="text-orange-600 font-semibold text-sm leading-tight hidden md:block">
            உள்ளவை தெல்லாம் உயர் விள்ளல் மற்று
            <br />
            தள்ளினுஞ் தள்ளாமை நீர்த்து
          </span>
        </div>

        {/* Role-based Button with Logout */}
        <div className="relative group">
          <button className="bg-indigo-700 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
            <span>{userRole}</span>
          </button>
          <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg py-2">
            <button
              className="block px-4 py-2 text-indigo-700 hover:bg-gray-200 transition-colors w-full text-left"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;