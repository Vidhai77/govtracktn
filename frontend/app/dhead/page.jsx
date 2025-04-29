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
  const [district, setDistrict] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const districtFromStorage =
        localStorage.getItem("district") || "Unknown District";
      const departmentFromStorage =
        localStorage.getItem("department") || "Unknown Department";
      const authToken = localStorage.getItem("authToken");

      setDistrict(districtFromStorage);
      setDepartment(departmentFromStorage);
console.log(departmentFromStorage)
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/department/${departmentFromStorage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
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
              console.log(project)
              const res = await fetch(
                `http://localhost:5000/api/users/${project.tenderer._id}`
              );
              const data = await res.json();
              console.log(data);
              tendererData[project._id] = data.name || "Unknown";
            } catch (error) {
              console.error(
                `Error fetching tenderer ${project.tenderer}:`,
                error
              );
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700">
              Department Head Dashboard
            </h1>
            <h2 className="text-lg text-indigo-500 mt-1">
              District: {district} | Department: {department}
            </h2>
          </div>
          <h1 className="text-2xl font-semibold text-indigo-600">Projects</h1>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-5 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
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
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="all">All Budgets</option>
                <option value="low">Under 100K</option>
                <option value="medium">100K - 1M</option>
                <option value="high">Over 1M</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="p-4 text-left font-semibold">Title</th>
                  <th className="p-4 text-left font-semibold">Description</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Budget</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="border-b p-4">{project?.name || "N/A"}</td>
                      <td className="border-b p-4">
                        {project?.description || "No description"}
                      </td>
                      <td className="border-b p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            project?.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : project?.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : project?.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : project?.status === "Planning"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {project?.status || "N/A"}
                        </span>
                      </td>
                      <td className="border-b p-4">
                        {project?.budget
                          ? `₹${project.budget.toLocaleString()}`
                          : "N/A"}
                      </td>
                      <td className="border-b p-4">
                        <div className="flex justify-between items-center gap-2">
                          {project.tenderer ? (
                            <span className="text-gray-600">
                              Assigned to{" "}
                              <span className="font-medium text-indigo-600">
                                {"" || "Fetching..."}
                              </span>
                            </span>
                          ) : (
                            <button
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-full shadow-sm transition-all duration-200"
                              onClick={() =>
                                router.push(`/assign_tender?id=${project._id}`)
                              }
                            >
                              Assign Tenderer
                            </button>
                          )}
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full shadow-sm transition-all duration-200"
                            onClick={() =>
                              router.push(`/reports/${project._id}`)
                            }
                          >
                            View Reports
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentHeadPage;
