"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DepartmentHeadPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [tenderers, setTenderers] = useState({}); // Store tenderer details

  useEffect(() => {
    const fetchProjects = async () => {
        const district = localStorage.getItem("district")
      try {
        const res = await fetch(`http://localhost:5000/api/projects/department/${district}`);
        const data = await res.json();
        console.log("Fetched Projects:", data);
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTenderers = async () => {
      const tendererData = {};
      await Promise.all(
        projects.map(async (project) => {
          if (project.tenderer) {
            try {
              const res = await fetch(`http://localhost:5000/api/users/${project.tenderer}`);
              const data = await res.json();
              tendererData[project._id] = data.name || "Unknown"; // Store name
            } catch (error) {
              console.error(`Error fetching tenderer ${project.tenderer}:`, error);
              tendererData[project._id] = "Error fetching";
            }
          }
        })
      );
      setTenderers(tendererData);
    };

    if (projects.length > 0) {
      fetchTenderers();
    }
  }, [projects]);

  const filteredProjects = projects.filter(
    (project) =>
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.includes(search)
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Department Projects</h1>
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
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} className="text-center">
                <td className="border p-2">{project?.name}</td>
                <td className="border p-2">{project?.description}</td>
                <td className="border p-2">{project?.status}</td>
                <td className="border p-2">
                  {tenderers[project._id] ? (
                    <span>{tenderers[project._id]}</span>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => router.push(`/assign_tender?id=${project._id}`)}
                    >
                      Assign Tenderer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DepartmentHeadPage;
