import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
        } else {
          setError("Job not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Error loading job details");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApply = () => {
    navigate(`/job-apply/${jobId}`);
  };

  const handleBack = () => {
    navigate("/job-listings");
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onLogout={handleLogout} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="container mx-auto text-center py-10">
              <h1 className="text-2xl font-semibold text-red-600 mb-4">{error}</h1>
              <button
                onClick={handleBack}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Back to Job Listings
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onLogout={handleLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
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
              Back to Job Listings
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.role}</h1>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium text-lg">{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                    {job.type || "Full-time"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Salary</h3>
                    <p className="text-lg font-semibold">₹{job.salary} LPA</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                    <p className="text-lg font-semibold">{job.experience} years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Posted On</h3>
                    <p className="text-lg font-semibold">
                      {job.postedDate ? new Date(job.postedDate.toDate()).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  {job.requirements ? (
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specific requirements listed.</p>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.length > 0 ? (
                      job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No specific skills listed.</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">About the Company</h2>
                  <p className="text-gray-700">{job.companyDescription || "No company description available."}</p>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleApply}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg text-lg"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetails;