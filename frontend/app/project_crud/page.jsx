"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      title,
      description,
      status,
      budget,
      deadline,
      assignedDepartment,
    };
    console.log("Submitted Data:", projectData);
    alert("Project added successfully!");
    // Add API call here
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Assigned Department"
            value={assignedDepartment}
            onChange={(e) => setAssignedDepartment(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
