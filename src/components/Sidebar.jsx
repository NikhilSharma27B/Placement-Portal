import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const [userType, setUserType] = useState("student");
  const location = useLocation();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Check if user is TPO
        const tpoRef = doc(db, "tpo", user.uid);
        const tpoSnap = await getDoc(tpoRef);

        if (tpoSnap.exists()) {
          setUserType("tpo");
        } else {
          setUserType("student");
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-[#1F2937] text-white w-64 space-y-6 py-7 px-4 shadow-xl absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-300 ease-in-out rounded-r-xl">
  <div className="flex items-center space-x-3 px-2">
    <span className="text-3xl font-bold tracking-wide">🎓 Placement Portal</span>
  </div>

  <nav className="mt-6 space-y-2">
    {userType === "student" ? (
      <>
        <Link
          to="/student-dashboard"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/student-dashboard")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/resume-upload"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/resume-upload")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          📁 Resume Upload
        </Link>
        <Link
          to="/job-listings"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/job-listings")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          💼 Job Listings
        </Link>
      </>
    ) : (
      <>
        <Link
          to="/tpo-dashboard"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/tpo-dashboard")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/manage-jobs"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/manage-jobs")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          🛠 Manage Jobs
        </Link>
        <Link
          to="/post-job"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/post-job")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          📝 Post Job
        </Link>
        <Link
          to="/company-profiles"
          className={`block py-2 px-4 rounded-lg transition duration-200 font-medium ${
            isActive("/company-profiles")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-blue-300"
          }`}
        >
          🏢 Companies
        </Link>
      </>
    )}
    <Link
      to="/"
      className="block py-2 px-4 rounded-lg transition duration-200 font-medium hover:bg-gray-700 hover:text-red-400"
    >
      🚪 Logout
    </Link>
  </nav>
</div>

  );
};

export default Sidebar;