import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate('/login');
      return;
    }

    // Redirect to appropriate dashboard based on user type
    if (user?.userType === 'startup') {
      navigate('/dashboard/startup');
    } else {
      // Default to student dashboard
      navigate('/dashboard/student');
    }
  }, [user, isAuthenticated, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect; 