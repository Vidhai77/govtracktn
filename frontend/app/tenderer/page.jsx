"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TendererPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("authToken");
      const tendererId = localStorage.getItem("userId"); // Assuming user ID is stored after login

      if (!token) {
        console.error("No auth token found");
        router.push("/login");
        return;
      }

      if (!tendererId) {
        console.error("No tenderer ID found");
        router.push("/");
        return;
      }

      try {
        // Fetch projects with tenderer ID in the URL
        const projectsResponse = await fetch(
          `http://localhost:5000/api/projects/tenderer/${authToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        console.log("Fetched Tenderer Projects:", projectsData);

        // Since the backend returns an array directly, no need for .projects
        const projectsArray = Array.isArray(projectsData) ? projectsData : [];
        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
        router.push("/"); // Redirect to home on error
      }
    };

    fetchProjects();
  }, [router]);

  const filteredProjects = projects.filter(
    (project) =>
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.toString().includes(search) // Convert ObjectId to string
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">My Tender Projects</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id.toString()} // Convert ObjectId to string
              className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold mb-2">{project?.name}</h2>
              <p className="text-gray-600 mb-2">{project?.description}</p>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Status:</span> {project?.status}
                </p>
                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(project?.deadline).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Budget:</span>{" "}
                  {project?.budget.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No projects found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TendererPage;
