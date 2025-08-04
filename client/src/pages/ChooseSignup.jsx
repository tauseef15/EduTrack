import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function ChooseSignup() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    if (selected) navigate(`/signup/${selected}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-5 left-6 flex items-center text-orange-600 font-bold text-lg">
        EduTrack
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
        Join as a student or teacher
      </h1>
      <p className="mt-2 text-gray-500 text-center">
        Choose your role to get started with EduTrack
      </p>

      {/* Role Cards */}
      <div className="mt-8 flex flex-col sm:flex-row gap-6 w-full max-w-3xl justify-center">
        {/* Student Card */}
        <RoleCard
          title="I'm a student"
          subtitle="Ready to learn and grow"
          description="Access courses, submit assignments, track your progress, and connect with teachers."
          icon={<GraduationCap className="text-white w-5 h-5" />}
          selected={selected === 'student'}
          onClick={() => setSelected('student')}
        />

        {/* Teacher Card */}
        <RoleCard
          title="I'm a teacher"
          subtitle="Ready to teach and inspire"
          description="Create courses, manage students, grade assignments, and share knowledge."
          // icon={<ChalkboardTeacher className="text-white w-5 h-5" />}
          selected={selected === 'teacher'}
          onClick={() => setSelected('teacher')}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleCreateAccount}
        disabled={!selected}
        className={`mt-8 w-full max-w-xs py-2 rounded font-semibold text-white transition 
          ${selected ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-100 text-orange-300 cursor-not-allowed'}`}
      >
        {selected ? 'Continue' : 'Select a role to continue'}
      </button>

      {/* Login Link */}
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <span
          className="text-orange-600 hover:underline cursor-pointer font-medium"
          onClick={() => navigate('/login')}
        >
          Log in
        </span>
      </p>
    </div>
  );
}

// Reusable role card
function RoleCard({ title, subtitle, description, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-3 text-left border rounded-lg p-5 shadow-sm w-full sm:w-[300px] transition 
        ${selected ? 'border-orange-500 ring-2 ring-orange-300 bg-orange-50' : 'border-gray-200 hover:shadow-md'}`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-orange-100 rounded-full p-2">{icon}</div>
        <div>
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
