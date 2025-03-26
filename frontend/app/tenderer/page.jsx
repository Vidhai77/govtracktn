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
      const tendererId = localStorage.getItem("userId");

      if (!token) {
        console.error("No auth token found");
        router.push("/login");
        return;
      }

      try {
        const projectsResponse = await fetch(
          "http://localhost:5000/api/users/auth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        console.log("Fetched Tenderer Projects:", projectsData?.projects);

        const projectsArray = Array.isArray(projectsData?.projects)
          ? projectsData.projects
          : [];
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
      project?._id?.toString().includes(search),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            My Tender Projects
          </h1>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-white p-5 rounded-xl shadow-lg">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project._id.toString()}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-100 hover:border-indigo-200"
              >
                <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                  {project?.name || "Untitled Project"}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project?.description || "No description available"}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ml-2 ${
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
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    <span className="text-indigo-600">
                      {formatDate(project?.deadline)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Budget:</span>{" "}
                    <span className="text-indigo-600">
                      {project?.budget
                        ? `₹${project.budget.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TendererPage;
