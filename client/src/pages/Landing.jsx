import React from "react";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-orange-50 text-gray-800">
      {/* Navbar */}
      <header className="w-full bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-lg sm:text-xl font-bold tracking-wide text-orange-600">
          EduTrack
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-8xl font-bold text-gray-900">
          Welcome to <span className="text-orange-500">EduTrack</span>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-600 text-lg">
          Transform your teaching and learning experience with our comprehensive
          online classroom platform. Connect, collaborate, and excel together in
          the digital age of education.
        </p>

        {/* Features */}
        <div
          id="features"
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
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
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold">
              Get Started
            </button>
          </Link>
        </div>

        {/* Sign-in prompt */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white px-6 py-2">
        <p className="text-center text-xs text-gray-500">© 2025 EduTrack</p>
      </footer>
    </div>
  );
}

// Reusable feature card
function Feature({ title, description }) {
  return (
    <div className="text-center">
      <div className="text-orange-500 text-3xl mb-2">●</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}

// Reusable stat box
function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-orange-500">{value}</div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
}
