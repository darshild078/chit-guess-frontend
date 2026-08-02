import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuessSelectionPage() {
  const navigate = useNavigate();

  useEffect(() => { 
    navigate('/room', { replace: true }); 
  }, [navigate]);

  return (
    <div className="p-8 text-center text-white">
      <p>Redirecting...</p>
    </div>
  );
}
