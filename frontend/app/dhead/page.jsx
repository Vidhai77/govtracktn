"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DepartmentHeadPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]); // Ensure projects is an array
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        console.log("Fetched Projects:", data); // Debugging: Ensure correct data format
        setProjects(Array.isArray(data) ? data : []); // Prevents issues if response is not an array
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project?.name?.toLowerCase().includes(search.toLowerCase()) ||
          project?._id?.includes(search)
      )
    : [];

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Department Projects</h1>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Assign Tenderer
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} className="text-center">
                <td className="border p-2">{project?.name}</td>
                <td className="border p-2">{project?.description}</td>
                <td className="border p-2">{project?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DepartmentHeadPage;
