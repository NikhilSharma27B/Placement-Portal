import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { collection, addDoc, getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const JobPostForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    type: "Full-time", // Full-time, Part-time, Internship, Contract
    salary: "",
    experience: "",
    description: "",
    requirements: "",
    skills: "",
    companyDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { jobId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Check if we're in edit mode (jobId exists in URL)
    if (jobId) {
      setIsEditMode(true);
      setLoading(true);
      
      // Fetch the job data
      const fetchJobData = async () => {
        try {
          const jobDoc = await getDoc(doc(db, "jobs", jobId));
          
          if (jobDoc.exists()) {
            const jobData = jobDoc.data();
            
            // Format the data for the form
            setFormData({
              role: jobData.role || "",
              company: jobData.company || "",
              location: jobData.location || "",
              type: jobData.type || "Full-time",
              salary: jobData.salary?.toString() || "",
              experience: jobData.experience?.toString() || "",
              description: jobData.description || "",
              requirements: jobData.requirements?.join("\n") || "",
              skills: jobData.skills?.join(", ") || "",
              companyDescription: jobData.companyDescription || "",
            });
          } else {
            setError("Job not found");
            setTimeout(() => {
              navigate("/manage-jobs");
            }, 2000);
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          setError("Error fetching job data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchJobData();
    }
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

      // Format the data
      const jobData = {
        role: formData.role,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: parseFloat(formData.salary),
        experience: parseFloat(formData.experience),
        description: formData.description,
        requirements: formData.requirements.split("\n").filter(req => req.trim() !== ""),
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill !== ""),
        companyDescription: formData.companyDescription,
      };

      if (isEditMode) {
        // Update existing job
        const jobRef = doc(db, "jobs", jobId);
        await updateDoc(jobRef, {
          ...jobData,
          updatedAt: serverTimestamp(),
        });
        setSuccess("Job updated successfully!");
      } else {
        // Add new job
        await addDoc(collection(db, "jobs"), {
          ...jobData,
          postedBy: user.uid,
          postedDate: serverTimestamp(),
          status: "active", // active, closed, filled
        });
        setSuccess("Job posted successfully!");
        // Reset form for new job posting
        setFormData({
          role: "",
          company: "",
          location: "",
          type: "Full-time",
          salary: "",
          experience: "",
          description: "",
          requirements: "",
          skills: "",
          companyDescription: "",
        });
      }
      
      setSubmitting(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/manage-jobs");
      }, 2000);
    } catch (error) {
      console.error(isEditMode ? "Error updating job:" : "Error posting job:", error);
      setError(isEditMode ? "Error updating job. Please try again." : "Error posting job. Please try again.");
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/manage-jobs");
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onLogout={handleLogout} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                {isEditMode ? "Edit Job" : "Post a New Job"}
              </h1>
              <button
                onClick={handleCancel}
                className="bg-gray-500 my-11 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>

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

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Job Title/Role *
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g. Google"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g. Bangalore, India"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Job Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="salary"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Salary (LPA) *
                    </label>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g. 12"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="experience"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Experience Required (years) *
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. 2"
                    min="0"
                    step="0.5"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Provide a detailed description of the job role and responsibilities..."
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="requirements"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Requirements (one per line) *
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows="5"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Bachelor's degree in Computer Science or related field\nMinimum 2 years of experience in web development\nStrong knowledge of JavaScript and React"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter each requirement on a new line
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="skills"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Required Skills (comma separated) *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate skills with commas
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="companyDescription"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    About the Company
                  </label>
                  <textarea
                    id="companyDescription"
                    name="companyDescription"
                    rows="3"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Provide a brief description of the company..."
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                      } text-white font-medium py-2 px-6 rounded-lg text-lg`}
                  >
                    {submitting ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "Update Job" : "Post Job")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobPostForm;