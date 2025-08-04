import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50 text-gray-800">
      {/* Navbar */}
      <header className="w-full bg-white px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-base sm:text-xl font-bold tracking-wide text-orange-600">
          EduTrack
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-gray-900 leading-tight">
          Welcome to <span className="text-orange-500">EduTrack</span>
        </h1>

        <p className="mt-6 text-xs sm:text-lg max-w-md sm:max-w-xl md:max-w-2xl text-gray-600">
          Transform your teaching and learning experience with our comprehensive
          online classroom platform. Connect, collaborate, and excel together in
          the digital age of education.
        </p>

        {/* Features */}
        <div
          id="features"
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-8 max-w-sm sm:max-w-2xl md:max-w-4xl w-full"
        >
          <Feature
            title="Interactive Learning"
            description="Engage with live classes and real-time collaboration"
          />
          <Feature
            title="Easy Management"
            description="Streamlined course and student progress tracking"
          />
          <Feature
            title="Anywhere Access"
            description="Learn and teach from any device, anywhere"
          />
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/choose-signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold text-sm sm:text-base">
              Get Started
            </button>
          </Link>
        </div>

        {/* Sign-in prompt */}
        <p className="mt-4 text-sm text-gray-600 px-2">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white px-4 sm:px-6 py-3">
        <p className="text-center text-xs text-gray-500">© 2025 EduTrack</p>
      </footer>
    </div>
  );
}

// Reusable feature card
function Feature({ title, description }) {
  return (
    <div className="text-center px-4">
      <div className="text-orange-500 text-2xl sm:text-3xl mb-2">●</div>
      <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}

// Optional stat box (not used in current page)
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-xl sm:text-2xl font-bold text-orange-500">{value}</div>
      <div className="text-xs sm:text-sm text-gray-700">{label}</div>
    </div>
  );
}
