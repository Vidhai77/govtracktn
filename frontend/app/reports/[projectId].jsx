"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const ReportsPage = () => {
  const router = useRouter();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/report/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setProject(data.project);
          setReports(data.project.reports || []);
        } else {
          setError(data.message || "Failed to fetch reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchReports();
    }
  }, [projectId, router]);

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
            Reports for Project: {project?.name || "Loading..."}
          </h1>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
            onClick={() => router.push("/department_head")}
          >
            Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        )}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!loading && reports.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No reports found for this project.
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-100"
              >
                <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                  {report.name || "Untitled Report"}
                </h2>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {report.description || "No description"}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Submitted on: {formatDate(report.startDate)}
                </p>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Proofs:
                  </p>
                  {report.proofs && report.proofs.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {report.proofs.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No images available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
