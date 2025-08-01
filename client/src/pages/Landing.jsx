import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-2xl">Welcome</h1>
      <button onClick={() => navigate('/login')} className="btn">Login</button>
      <button onClick={() => navigate('/choose-signup')} className="btn">Signup</button>
    </div>
  );
}

export default Landing;
