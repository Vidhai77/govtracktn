"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/projects/district/" +
            localStorage.getItem("district"),
        );
        console.log(res);
        const data = await res.json();
        console.log(data);
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
    return date.toLocaleDateString("en-GB"); // Formats to DD-MM-YYYY
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

  const filteredProjects = projects?.filter(
    (project) =>
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.includes(search),
  );

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
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addProject}
          >
            Add Project
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
              <th className="border p-2">Budget</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">Deadline</th>
              <th className="border p-2">Assigned Department</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} className="text-center">
                <td className="border p-2">{project?.name}</td>
                <td className="border p-2">{project?.description}</td>
                <td className="border p-2">{project?.status}</td>
                <td className="border p-2">{project?.budget}</td>
                <td className="border p-2">{formatDate(project?.startDate)}</td>
                <td className="border p-2">{formatDate(project?.deadline)}</td>
                <td className="border p-2">{project?.department}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdate(project._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
