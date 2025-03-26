"use client";
import Link from "next/link";
import React from "react";

const Navbar = () => {
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
          <span className="text-xl font-bold block leading-tight">
            தமிழ்நாடு அரசு
          </span>
          <span className="text-xl font-semibold">
            Government of Tamil Nadu
          </span>
        </div>
      </div>

      {/* Center Section - Title */}
      <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">
        GovTrackTN
      </h1>

      {/* Right Section - Quote and Links */}
      <div className="flex items-center space-x-6">
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

        {/* Links */}
        <div className="flex space-x-6 text-indigo-700 font-semibold">
          <Link
            href="/"
            className="hover:text-indigo-900 hover:underline transition-colors duration-200"
          >
            Home
          </Link>
          <button
            className="hover:text-indigo-900 hover:underline transition-colors duration-200"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
