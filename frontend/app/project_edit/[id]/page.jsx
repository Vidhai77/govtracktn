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
    setProject({ ...project, [e.target.name]: e.target.value });
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
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={project.name} onChange={handleChange} placeholder="Name" required />
          <textarea name="description" value={project.description} onChange={handleChange} placeholder="Description" required />
          <input name="budget" type="number" value={project.budget} onChange={handleChange} placeholder="Budget" required />
          <select name="status" value={project.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Not Started">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <input name="startDate" type="date" value={project.startDate} onChange={handleChange} required />
          <input name="deadline" type="date" value={project.deadline} onChange={handleChange} required />
          <select name="department" value={project.department} onChange={handleChange} required>
            <option value="Rev">Revenue</option>
            <option value="PW">Public Works</option>
            <option value="Edu">Education</option>
            <option value="Agri">Agriculture</option>
            <option value="Health">Health</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Update Project</button>
        </form>
      </div>
    </>
  );
};

export default EditProject;
