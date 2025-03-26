"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetRange, setBudgetRange] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/projects/district/" +
            localStorage.getItem("district"),
        );
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleUpdate = (id) => {
    router.push(`/project_edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== id),
        );
        alert("Project deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to delete project"}`);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("An error occurred while deleting the project. Please try again.");
    }
  };

  // Get unique departments for filter dropdown
  const departments = ["all", ...new Set(projects.map((p) => p.department))];

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.includes(search);

    const matchesDepartment =
      departmentFilter === "all" || project?.department === departmentFilter;

    const matchesStatus =
      statusFilter === "all" || project?.status === statusFilter;

    const matchesBudget =
      budgetRange === "all" ||
      (budgetRange === "low"
        ? project?.budget < 100000
        : budgetRange === "medium"
          ? project?.budget >= 100000 && project?.budget < 1000000
          : project?.budget >= 1000000);

    return matchesSearch && matchesDepartment && matchesStatus && matchesBudget;
  });

  const addProject = () => {
    router.push("/project_crud");
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Projects</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            onClick={addProject}
          >
            Add Project
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
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
                <option value="Pending">Pending</option>
                <option value="Planning">Planning</option>
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
                <th className="border p-2 text-left">Start Date</th>
                <th className="border p-2 text-left">Deadline</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Assigned Tenderer</th>
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
                    {formatDate(project?.startDate)}
                  </td>
                  <td className="border p-2">
                    {formatDate(project?.deadline)}
                  </td>
                  <td className="border p-2">{project?.department}</td>
                  <td className="border p-2">
                    {project?.tenderer?.name || "Not assigned yet"}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleUpdate(project._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
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

export default Page;
