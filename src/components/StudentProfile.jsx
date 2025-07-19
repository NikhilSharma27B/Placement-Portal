import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = ({ studentData }) => {
  const navigate = useNavigate();

  const handleResumeUpload = () => {
    navigate('/resume-upload');
  };

  return (
    <div className="space-y-8">
      {/* Profile Header with Status Badge */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
          <div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                studentData.isPlaced
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              {studentData.isPlaced ? "Placed" : "Not Placed"}
            </span>
          </div>
        </div>

        {/* Profile Avatar and Name Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {studentData.name ? studentData.name.charAt(0).toUpperCase() : "S"}
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
              {studentData.name || "Not provided"}
            </h3>
            <p className="text-gray-600 mb-4 text-center md:text-left">{studentData.email}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {studentData.cgpa && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">CGPA: {studentData.cgpa}</span>
                </div>
              )}
              
              {studentData.branch && (
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Branch: {studentData.branch}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Skills & Expertise</span>
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {studentData.skills && studentData.skills.length > 0 ? (
            studentData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                {skill}
              </span>
            ))
          ) : (
            <div className="w-full text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-gray-500 font-medium">No skills added yet</p>
              <p className="text-gray-400 text-sm mt-2">Update your profile to add skills</p>
            </div>
          )}
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">Resume</span>
        </h2>
        
        {studentData.resumeUrl ? (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6 shadow-inner">
            <div className="flex items-center mb-4 text-blue-600">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-800">Resume Uploaded</h3>
                <p className="text-blue-600 text-sm">Your resume is ready for job applications</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a
                href={studentData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Resume
              </a>
              <button
                onClick={handleResumeUpload}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 shadow-inner">
            <div className="flex items-center mb-4 text-yellow-600">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-yellow-800">No Resume Found</h3>
                <p className="text-yellow-600 text-sm">Upload your resume to apply for jobs</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleResumeUpload}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Upload Resume Now
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                A professional resume increases your chances of getting noticed by recruiters
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;