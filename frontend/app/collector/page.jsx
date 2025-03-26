"use client";
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
  const [district, setDistrict] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const districtFromStorage =
          localStorage.getItem("district") || "Unknown District";
        setDistrict(districtFromStorage);
        const res = await fetch(
          `http://localhost:5000/api/projects/district/${districtFromStorage}`,
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
      <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700">
              Collector Dashboard
            </h1>
            <h2 className="text-lg text-indigo-500 mt-1">
              District: {district}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-indigo-600">Projects</h1>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out"
              onClick={addProject}
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-5 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
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
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
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
                  <th className="p-4 text-left font-semibold">Start Date</th>
                  <th className="p-4 text-left font-semibold">Deadline</th>
                  <th className="p-4 text-left font-semibold">Department</th>
                  <th className="p-4 text-left font-semibold">
                    Assigned Tenderer
                  </th>
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
                        {formatDate(project?.startDate)}
                      </td>
                      <td className="border-b p-4">
                        {formatDate(project?.deadline)}
                      </td>
                      <td className="border-b p-4">
                        {project?.department || "N/A"}
                      </td>
                      <td className="border-b p-4">
                        {project?.tenderer?.name || "Not assigned yet"}
                      </td>
                      <td className="border-b p-4 flex gap-3">
                        <button
                          onClick={() => handleUpdate(project._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-full shadow-sm transition-all duration-200"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-full shadow-sm transition-all duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-500">
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

export default Page;
