import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const JobApply = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        setJob({ id: jobSnap.id, ...jobSnap.data() });

        // Fetch student data
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setStudentData({ id: studentSnap.id, ...studentSnap.data() });
        } else {
          setError("Student profile not found. Please complete your profile first.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data");
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      // Check if resume is uploaded
      if (!studentData.resumeUrl) {
        setError("Please upload your resume before applying.");
        setSubmitting(false);
        return;
      }

      // Create application document
      const applicationData = {
        jobId: jobId,
        jobTitle: job.role,
        company: job.company,
        studentId: user.uid,
        studentName: studentData.name,
        studentEmail: studentData.email,
        resumeUrl: studentData.resumeUrl,
        coverLetter: coverLetter,
        status: "applied", // applied, reviewing, rejected, accepted
        appliedAt: serverTimestamp(),
        cgpa: studentData.cgpa,
        skills: studentData.skills,
        branch: studentData.branch,
      };

      // Add to applications collection
      await addDoc(collection(db, "applications"), applicationData);

      setSuccess("Application submitted successfully!");
      setCoverLetter("");
      setSubmitting(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/job-listings");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Error submitting application. Please try again.");
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/job-details/${jobId}`);
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

  if (error && !studentData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onLogout={handleLogout} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="container mx-auto text-center py-10">
              <h1 className="text-2xl font-semibold text-red-600 mb-4">{error}</h1>
              <button
                onClick={() => navigate("/resume-upload")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mr-4"
              >
                Complete Profile
              </button>
              <button
                onClick={() => navigate("/job-listings")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
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
          <div className="container mx-auto max-w-4xl">
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
              Back to Job Details
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Apply for {job.role}</h1>

                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                    <p>{success}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Job Details</h2>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-medium">Position</p>
                        <p className="text-gray-800">{job.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Company</p>
                        <p className="text-gray-800">{job.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Location</p>
                        <p className="text-gray-800">{job.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Salary</p>
                        <p className="text-gray-800">₹{job.salary} LPA</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-medium">Name</p>
                        <p className="text-gray-800">{studentData.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Email</p>
                        <p className="text-gray-800">{studentData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">CGPA</p>
                        <p className="text-gray-800">{studentData.cgpa}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Branch</p>
                        <p className="text-gray-800">{studentData.branch}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 font-medium">Skills</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {studentData.skills && studentData.skills.length > 0 ? (
                          studentData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 font-medium">Resume</p>
                      {studentData.resumeUrl ? (
                        <div className="flex items-center mt-1">
                          <a
                            href={studentData.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              ></path>
                            </svg>
                            View Resume
                          </a>
                        </div>
                      ) : (
                        <p className="text-red-500 mt-1">
                          No resume uploaded. Please upload your resume before applying.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label
                      htmlFor="coverLetter"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      rows="6"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={submitting || !studentData.resumeUrl}
                      className={`${submitting || !studentData.resumeUrl
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        } text-white font-medium py-2 px-6 rounded-lg text-lg`}
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobApply;