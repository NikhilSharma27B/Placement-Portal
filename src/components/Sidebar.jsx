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
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <span className="text-2xl font-extrabold">Placement Portal</span>
      </div>

      <nav>
        {userType === "student" ? (
          <>
            <Link
              to="/student-dashboard"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/student-dashboard")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/resume-upload"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/resume-upload")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Resume Upload
            </Link>
            <Link
              to="/job-listings"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/job-listings")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Job Listings
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/tpo-dashboard"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/tpo-dashboard")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/manage-jobs"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/manage-jobs")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Manage Jobs
            </Link>
            <Link
              to="/post-job"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/post-job")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Post Job
            </Link>
            <Link
              to="/company-profiles"
              className={`block py-2.5 px-4 rounded transition duration-200 ${isActive("/company-profiles")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"}`}
            >
              Companies
            </Link>
          </>
        )}
        <Link
          to="/"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;