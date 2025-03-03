"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const AssignTenderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id"); // Extract project ID from URL

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    console.log("Project ID:", projectId); // Debugging: Check if ID is received
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      alert("Project ID is missing!");
      return;
    }

    console.log("Submitting Tenderer Details:", formData);

    try {
      // Retrieve authToken from localStorage
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authorization token is missing. Please log in.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/assign-tenderer`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Send token in headers
          },
        }
      );

      console.log("Response:", response.data);
      alert("Tenderer assigned successfully!");
      router.push("/dhead"); // Redirect after submission
    } catch (error) {
      console.error("Error assigning tenderer:", error);
      alert("Failed to assign tenderer. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Assign Tender</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Phone Number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AssignTenderPage;
