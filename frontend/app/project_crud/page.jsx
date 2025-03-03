"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import axios from "axios";

const Page = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      name,
      description,
      status,
      budget,
      startingDate,
      deadline,
      assignedDepartment,
    };

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"projects/", projectData);


      console.log("Response:", response.data);
      alert("Project added successfully!");
      
      // Reset the form fields
      setName("");
      setDescription("");
      setStatus("");
      setBudget("");
      setStartingDate("");
      setDeadline("");
      setAssignedDepartment("");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-gray-600 mb-1">
              Project name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Smart City Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-600 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="e.g., Infrastructure upgrade to enhance urban living..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          <div>
            <div>
              <label htmlFor="status" className="block text-gray-600 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="Not Started">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-gray-600 mb-1">
              Budget (in INR)
            </label>
            <input
              id="budget"
              type="number"
              placeholder="e.g., 50000000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="startingDate" className="block text-gray-600 mb-1">
              Starting Date
            </label>
            <input
              id="startingDate"
              type="date"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-gray-600 mb-1">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <div>
              <label htmlFor="status" className="block text-gray-600 mb-1">
                Department
              </label>
              <select
                id="status"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select Department</option>
                <option value="Rev">Revenue</option>
                <option value="PW">Public Works</option>
                <option value="Edu">Education</option>
                <option value="Agri">Agriculture</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
