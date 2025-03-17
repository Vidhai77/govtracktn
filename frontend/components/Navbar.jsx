"use client";

// components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white text-black p-4 flex items-center justify-around top-0 sticky shadow-sm shadow-green-300">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg" // Ensure the image is in the public folder
          alt="TN Govt Logo"
          className="size-16"
        />
        <div className="text-blue-700">
          <span className="text-lg font-bold block">தமிழ்நாடு அரசு</span>
          <span className="text-lg font-bold">Government of Tamil Nadu</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-green-600">GovTrackTN</h1>

      {/* Center Section */}
      <div className="flex gap-10 items-center text-center">
        <img
          src="/Thiruvalluvar.png" // Ensure the image is in the public folder
          alt="Thiruvalluvar"
          className="size-20 mb-1"
        />
        <span className="text-orange-700 font-semibold">
          உள்ளவை தெல்லாம் உயர் விள்ளல் மற்று
          <br />
          தள்ளினுஞ் தள்ளாமை நீர்த்து
        </span>
      </div>

      {/* Right Section - Links */}
      <div className="space-x-4 text-blue-700 font-semibold">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <button href="/#about" className="hover:underline">
          Logout
        </button>
        <button
          className="hover:underline"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/"; // Redirect to home page
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
