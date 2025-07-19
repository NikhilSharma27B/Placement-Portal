import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudentProfile from "../components/StudentProfile";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    cgpa: "",
    branch: "",
    skills: [],
    isPlaced: false,
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }

        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setStudentData(studentSnap.data());
        } else {
          // If student data doesn't exist, create a placeholder
          setStudentData({
            name: user.displayName || "New Student",
            email: user.email,
            cgpa: "",
            branch: "",
            skills: [],
            isPlaced: false,
            resumeUrl: "",
          });
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Resume upload is now handled in the StudentProfile component

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Navbar onLogout={handleLogout} />

        <main className="flex-1  my-20 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 pl-4">
          <div className="container mx-auto">

            <StudentProfile studentData={studentData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
