"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const EditProject = () => {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
    status: "",
    budget: "",
    startDate: "",
    deadline: "",
    department: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value || project[e.target.name] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        alert("Project updated successfully!");
        router.push("/collector");
      } else {
        alert("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("An error occurred.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={project.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="budget"
            type="number"
            value={project.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="status"
            value={project.status}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Status</option>
            <option value="Not Started">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <input
            name="startDate"
            type="date"
            value={project.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="deadline"
            type="date"
            value={project.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="department"
            value={project.department}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Department</option>
            <option value="Rev">Revenue</option>
            <option value="PW">Public Works</option>
            <option value="Edu">Education</option>
            <option value="Agri">Agriculture</option>
            <option value="Health">Health</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Update Project
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProject;