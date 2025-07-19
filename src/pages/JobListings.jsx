import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    company: "",
    minSalary: "",
    location: "",
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, "jobs");
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobsList = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsList);
        setFilteredJobs(jobsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...jobs];

    if (filters.role) {
      result = result.filter((job) =>
        job.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.company) {
      result = result.filter((job) =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.minSalary) {
      result = result.filter(
        (job) => job.salary >= parseInt(filters.minSalary)
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleApply = (jobId) => {
    navigate(`/job-apply/${jobId}`);
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onLogout={handleLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Job Listings</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Min Salary (LPA)
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={filters.minSalary}
                    onChange={handleFilterChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. 10"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. Bangalore"
                  />
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">{job.role}</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {job.type || "Full-time"}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-600 font-medium">{job.company}</p>
                        <p className="text-gray-500">{job.location}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-700">
                          <span className="font-semibold">Salary:</span> ₹{job.salary} LPA
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Experience:</span> {job.experience} years
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills &&
                          job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleViewDetails(job.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApply(job.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No jobs found matching your criteria.
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

export default JobListings;