"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DepartmentHeadPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetRange, setBudgetRange] = useState("all");
  const [tenderers, setTenderers] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      const district = localStorage.getItem("district");
      const department = localStorage.getItem("department");
      const authToken = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/department/${department}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
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
              const res = await fetch(
                `http://localhost:5000/api/users/${project.tenderer}`,
              );
              const data = await res.json();
              tendererData[project._id] = data.name || "Unknown";
            } catch (error) {
              console.error(
                `Error fetching tenderer ${project.tenderer}:`,
                error,
              );
              tendererData[project._id] = "Error fetching";
            }
          }
        }),
      );
      setTenderers(tendererData);
    };

    if (projects.length > 0) {
      fetchTenderers();
    }
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.includes(search);

    const matchesStatus =
      statusFilter === "all" || project?.status === statusFilter;

    const matchesBudget =
      budgetRange === "all" ||
      (budgetRange === "low"
        ? project?.budget < 100000
        : budgetRange === "medium"
          ? project?.budget >= 100000 && project?.budget < 1000000
          : project?.budget >= 1000000);

    return matchesSearch && matchesStatus && matchesBudget;
  });

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Department Projects</h1>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Budgets</option>
                <option value="low">Under 100K</option>
                <option value="medium">100K - 1M</option>
                <option value="high">Over 1M</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Budget</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="border p-2">{project?.name}</td>
                  <td className="border p-2">{project?.description}</td>
                  <td className="border p-2">{project?.status}</td>
                  <td className="border p-2">{project?.budget}</td>
                  <td className="border p-2">
                    {project.tenderer ? (
                      <span className="text-gray-600">
                        Assigned to {project?.tenderer?.name}
                      </span>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        onClick={() =>
                          router.push(`/assign_tender?id=${project._id}`)
                        }
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
      </div>
    </>
  );
};

export default DepartmentHeadPage;
