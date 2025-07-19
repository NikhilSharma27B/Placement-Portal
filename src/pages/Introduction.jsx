import React from "react";
import { Link } from "react-router-dom";

const IntroductionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-800 to-blue-600 py-20 px-6 text-white shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
              Welcome to <span className="text-yellow-300">Placement Portal</span>
            </h1>
            <p className="text-lg text-blue-100">
              Streamline your campus placements with a secure, smart, and intuitive platform built for institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
              <Link to="/login">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 font-semibold rounded-full transition-all shadow-md">
                  🚀 Get Started
                </button>
              </Link>
             
            </div>
          </div>
          <div className="md:w-1/2 text-center">
            <img
              src="image.png"
              alt="Placement Illustration"
              className="w-full max-w-md animate-fade-in-up drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-800 text-center mb-12">
            🔑 Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Student Dashboard", desc: "Students can register, upload resumes, apply for jobs, and track placement status.", color: "bg-blue-100 text-blue-800" },
              { title: "Recruiter Portal", desc: "Companies can post jobs, view applications, and manage the interview process.", color: "bg-yellow-100 text-yellow-800" },
              { title: "TPO Tools", desc: "Placement officers can manage drives and generate analytics in real-time.", color: "bg-purple-100 text-purple-800" },
              { title: "Secure Logins", desc: "Role-based login for Students, Admins, TPOs, and Recruiters.", color: "bg-green-100 text-green-800" },
              { title: "Analytics Dashboard", desc: "Monitor placement metrics and performance across departments.", color: "bg-pink-100 text-pink-800" },
              { title: "Drive Management", desc: "Easily create and manage placement drives digitally.", color: "bg-sky-100 text-sky-800" },
            ].map((feature, index) => (
              <div key={index} className={`${feature.color} p-6 rounded-2xl shadow-md hover:shadow-xl transition`}>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-100 via-white to-blue-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          🚀 Ready to Simplify Your Placement Process?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Join top colleges in transforming their placement operations with ease.
        </p>
       
      </section>

      {/* Footer */}
      <footer className="bg-white text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} TCET | Department of AI & DS | All rights reserved.
      </footer>
    </div>
  );
};

export default IntroductionPage;
