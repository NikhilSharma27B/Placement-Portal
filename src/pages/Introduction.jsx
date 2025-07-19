import React from "react";
import { Link } from "react-router-dom";

const IntroductionPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f9f8] text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-[#ffffff] py-16 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-700 leading-tight">
              Welcome to Placement Portal
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Empowering institutions with a digital platform to manage all placement activities effortlessly. Built for students, recruiters, and training & placement officers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow-md transition">
                  Get Started
                </button>
              </Link>
              <Link to="/about">
                <button className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg transition">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 text-center">
            {/* Placeholder for image */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Placement Illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#fefefe]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-600 text-center mb-10">
            🔍 Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-orange-700 mb-2">Student Dashboard</h3>
              <p>Students can register, upload resumes, apply for jobs, and track their placement status easily.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Recruiter Portal</h3>
              <p>Companies can post jobs, review student applications, and manage interview processes efficiently.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">TPO Tools</h3>
              <p>Placement officers can monitor drives, filter students, and generate reports with real-time data.</p>
            </div>
            <div className="bg-lime-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-lime-700 mb-2">Secure Logins</h3>
              <p>Role-based secure login access for Admin, Students, TPOs, and Recruiters with JWT/session auth.</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-pink-700 mb-2">Analytics Dashboard</h3>
              <p>Real-time analytics for tracking student placements, company participation, and department stats.</p>
            </div>
            <div className="bg-sky-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-sky-700 mb-2">Drive Management</h3>
              <p>All placement drives, results, eligibility criteria, and schedules are handled digitally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-100 via-teal-100 to-orange-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Simplify Your Placement Process?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Join top institutes in transforming their placement operations with our seamless platform.
        </p>
        <Link to="/register">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg shadow-lg transition">
            Register Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t mt-12">
        © {new Date().getFullYear()} TCET | Department of AI & DS | All rights reserved.
      </footer>
    </div>
  );
};

export default IntroductionPage;
