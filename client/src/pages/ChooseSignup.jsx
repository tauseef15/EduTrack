import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseSignup() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    if (selected) {
      navigate(`/signup/${selected}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <div className="absolute top-4 left-4 text-xl font-bold text-gray-800">yourLogo</div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
        Join as a student or teacher
      </h1>

      {/* Role Options */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-2xl">
        {/* Student Card */}
        <button
          onClick={() => setSelected('student')}
          className={`flex-1 border rounded-lg p-4 text-left hover:shadow transition 
            ${selected === 'student' ? 'border-orange-500 ring-2 ring-orange-300' : 'border-gray-300'}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <div className="font-medium">I'm a student</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Signing up to learn and submit work</p>
        </button>

        {/* Teacher Card */}
        <button
          onClick={() => setSelected('teacher')}
          className={`flex-1 border rounded-lg p-4 text-left hover:shadow transition 
            ${selected === 'teacher' ? 'border-orange-500 ring-2 ring-orange-300' : 'border-gray-300'}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🏫</span>
            <div className="font-medium">I'm a teacher</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Signing up to teach or upload content</p>
        </button>
      </div>

      {/* Create Account Button */}
      <button
        onClick={handleCreateAccount}
        disabled={!selected}
        className={`w-full max-w-md py-2 rounded text-white font-semibold 
          ${selected ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-200 cursor-not-allowed'}`}
      >
        Create Account
      </button>

      {/* Login Link */}
      <p className="mt-4 text-sm text-gray-700">
        Already have an account?{' '}
        <span
          className="text-orange-600 hover:underline cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Log In
        </span>
      </p>
    </div>
  );
}

export default ChooseSignup;
