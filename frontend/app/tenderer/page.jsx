"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TendererPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportForm, setReportForm] = useState({
    name: "",
    description: "",
    proofs: [], // Store File objects temporarily
  });
  const [previewImages, setPreviewImages] = useState([]); // For image previews
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

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
          }
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

  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm({ ...reportForm, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding new files exceeds the limit
    const totalImages = reportForm.proofs.length + files.length;
    if (totalImages > 5) {
      setFormError("You can select a maximum of 5 images.");
      e.target.value = null; // Reset file input
      return;
    }

    setFormError("");
    // Store File objects and generate previews
    setReportForm({
      ...reportForm,
      proofs: [...reportForm.proofs, ...files],
    });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
    e.target.value = null; // Reset file input
  };

  const removeImage = (index) => {
    const updatedProofs = reportForm.proofs.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setReportForm({ ...reportForm, proofs: updatedProofs });
    setPreviewImages(updatedPreviews);
  };

  const uploadImagesToCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    });

    return Promise.all(uploadPromises);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setUploading(true);

    if (!selectedProject) {
      setFormError("Please select a project.");
      setUploading(false);
      return;
    }

    if (!reportForm.name || !reportForm.description) {
      setFormError("Please fill in all required fields.");
      setUploading(false);
      return;
    }

    if (reportForm.proofs.length === 0) {
      setFormError("Please select at least one image.");
      setUploading(false);
      return;
    }

    try {
      // Upload images to Cloudinary
      const uploadedUrls = await uploadImagesToCloudinary(reportForm.proofs);

      const token = localStorage.getItem("authToken");
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const response = await fetch("http://localhost:5000/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: selectedProject._id,
          name: reportForm.name,
          description: reportForm.description,
          proofs: uploadedUrls,
          startDate: currentDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Report submitted successfully!");
        setReportForm({ name: "", description: "", proofs: [] });
        setPreviewImages([]);
        setSelectedProject(null);
      } else {
        setFormError(data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project?.name?.toLowerCase().includes(search.toLowerCase()) ||
      project?._id?.toString().includes(search)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen relative">
        {/* Loading Overlay */}
        {uploading && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="text-white text-2xl font-semibold animate-pulse">
              Uploading...
            </div>
          </div>
        )}
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

        {/* Report Submission Form */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">
            Submit a New Report
          </h2>
          {formError && <p className="text-red-500 mb-4">{formError}</p>}
          {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
          <form onSubmit={handleReportSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Select Project
                </label>
                <select
                  value={selectedProject?._id || ""}
                  onChange={(e) => {
                    const project = projects.find(
                      (p) => p._id === e.target.value
                    );
                    setSelectedProject(project || null);
                  }}
                  className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                >
                  <option value="">-- Select a Project --</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={reportForm.name}
                  onChange={handleReportFormChange}
                  placeholder="Enter report name"
                  className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={reportForm.description}
                onChange={handleReportFormChange}
                placeholder="Describe the report"
                rows="4"
                className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Select Images (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border border-gray-200 p-3 w-full rounded-lg"
                disabled={uploading || reportForm.proofs.length >= 5}
              />
              {uploading && (
                <p className="text-indigo-600 mt-2">Uploading images...</p>
              )}
              <p className="text-gray-600 mt-2">
                {reportForm.proofs.length} of 5 images selected
              </p>
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium mb-2">
                    Image Previews:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200"
              disabled={uploading}
            >
              Submit Report
            </button>
          </form>
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
