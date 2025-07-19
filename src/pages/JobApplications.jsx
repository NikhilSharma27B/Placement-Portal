import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, approved, rejected
  });
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }

        // Fetch job details
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
          setError("Job not found");
          setLoading(false);
          return;
        }

        const jobData = {
          id: jobSnap.id,
          ...jobSnap.data(),
          postedDate: jobSnap.data().postedDate?.toDate() || new Date(),
        };

        // Verify that the current user is the one who posted this job
        if (jobData.postedBy !== user.uid) {
          setError("You don't have permission to view these applications");
          setLoading(false);
          return;
        }

        setJob(jobData);

        // Fetch applications for this job
        const applicationsQuery = query(
          collection(db, "applications"),
          where("jobId", "==", jobId)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);

        // For each application, get the student details
        const applicationsWithStudentDetails = await Promise.all(
          applicationsSnapshot.docs.map(async (appDoc) => {
            const appData = appDoc.data();
            const studentRef = doc(db, "students", appData.studentId);
            const studentSnap = await getDoc(studentRef);

            return {
              id: appDoc.id,
              ...appData,
              appliedDate: appData.appliedDate?.toDate() || new Date(),
              student: studentSnap.exists()
                ? { id: studentSnap.id, ...studentSnap.data() }
                : { id: appData.studentId, name: "Unknown Student" },
            };
          })
        );

        setApplications(applicationsWithStudentDetails);
        setFilteredApplications(applicationsWithStudentDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job applications:", err);
        setError("Failed to load applications. Please try again.");
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [jobId, navigate]);

  useEffect(() => {
    // Apply filters
    let result = [...applications];

    if (filters.status !== "all") {
      result = result.filter((app) => app.status === filters.status);
    }

    setFilteredApplications(result);
  }, [filters, applications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, "applications", applicationId);
      await updateDoc(applicationRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status. Please try again.");
    }
  };

  const handleViewResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume available for this applicant.");
    }
  };

  const handleBackToJobs = () => {
    navigate("/manage-jobs");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={handleBackToJobs}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToJobs}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                Back to Jobs
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Applications for {job?.role}
              </h1>
              <div className="text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Company:</span> {job?.company}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {job?.location}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      job?.status
                    )}`}
                  >
                    {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
                  </span>
                </p>
              </div>

              <div className="flex items-center">
                <label className="mr-2 text-gray-700 font-medium">Filter by Status:</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="shadow border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {filteredApplications.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applied Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.student.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                Branch: {application.student.branch || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                CGPA: {application.student.cgpa || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.appliedDate.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              application.status
                            )}`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {application.student.resumeUrl && (
                              <button
                                onClick={() => handleViewResume(application.student.resumeUrl)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Resume"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  ></path>
                                </svg>
                              </button>
                            )}
                            <div className="relative inline-block text-left">
                              <select
                                value={application.status}
                                onChange={(e) =>
                                  handleStatusChange(application.id, e.target.value)
                                }
                                className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-2 py-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-xs"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No applications found for this job posting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobApplications;