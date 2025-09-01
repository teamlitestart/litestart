// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://litestart-backend.onrender.com');

// Force log to see if this file is being loaded
console.log('🚀 API CONFIG FILE LOADED - API_BASE_URL:', API_BASE_URL);

// Debug logging for production
if (import.meta.env.MODE === 'production') {
  console.log('=== API CONFIG DEBUG ===');
  console.log('Production mode detected');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('MODE:', import.meta.env.MODE);
  console.log('API_ENDPOINTS.USERS:', API_ENDPOINTS.USERS);
  console.log('========================');
}

// Fallback function for when backend is not available
const fallbackSignup = async (userData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Store in localStorage as fallback
  const existingUsers = JSON.parse(localStorage.getItem('litestart_users') || '[]');
  const newUser = {
    _id: Date.now().toString(),
    ...userData,
    isEmailVerified: true,
    signupDate: new Date().toISOString()
  };
  existingUsers.push(newUser);
  localStorage.setItem('litestart_users', JSON.stringify(existingUsers));
  
  return {
    message: 'Thank you for signing up! You have been added to the waitlist.',
    user: newUser
  };
};

const fallbackGetUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(localStorage.getItem('litestart_users') || '[]');
};

export const API_ENDPOINTS = {
  SIGNUP: API_BASE_URL ? `${API_BASE_URL}/api/signup` : null,
  USERS: API_BASE_URL ? `${API_BASE_URL}/api/users` : null,
  VERIFY_EMAIL: API_BASE_URL ? `${API_BASE_URL}/api/verify-email` : null,
  HEALTH: API_BASE_URL ? `${API_BASE_URL}/health` : null,
};

// Check backend health
const checkBackendHealth = async () => {
  if (!API_BASE_URL) return { status: 'offline', mongoConnected: false };
  
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH!, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return { 
        status: 'online', 
        mongoConnected: data.mongoConnected,
        timestamp: data.timestamp
      };
    } else {
      return { status: 'offline', mongoConnected: false };
    }
  } catch (error) {
    return { status: 'offline', mongoConnected: false };
  }
};

// API wrapper functions that handle fallbacks
export const apiCall = {
  signup: async (userData: any) => {
    if (API_BASE_URL) {
      try {
        const response = await fetch(API_ENDPOINTS.SIGNUP!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (response.status === 503) {
          // Backend is waking up, use fallback
          console.log('Backend temporarily unavailable, using fallback signup');
          return fallbackSignup(userData);
        }
        
        return response.json();
      } catch (error) {
        console.log('Backend unavailable, using fallback signup');
        return fallbackSignup(userData);
      }
    } else {
      return fallbackSignup(userData);
    }
  },
  
  getUsers: async () => {
    console.log('getUsers called - API_BASE_URL:', API_BASE_URL);
    console.log('getUsers called - API_ENDPOINTS.USERS:', API_ENDPOINTS.USERS);
    
    if (API_BASE_URL) {
      try {
        console.log('Making request to:', API_ENDPOINTS.USERS);
        const response = await fetch(API_ENDPOINTS.USERS!, {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.status === 503) {
          // Backend is waking up, use fallback
          console.log('Backend temporarily unavailable, using fallback getUsers');
          return fallbackGetUsers();
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched users:', data.length);
        return data;
      } catch (error) {
        console.error('Error in getUsers:', error);
        console.log('Backend unavailable, using fallback getUsers');
        return fallbackGetUsers();
      }
    } else {
      console.log('No API_BASE_URL, using fallback getUsers');
      return fallbackGetUsers();
    }
  },
  
  deleteUser: async (id: string) => {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_ENDPOINTS.USERS}/${id}`, {
          method: 'DELETE',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (response.status === 503) {
          throw new Error('Backend temporarily unavailable. Please try again.');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        throw error;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('litestart_users') || '[]');
      const filteredUsers = users.filter((user: any) => user._id !== id);
      localStorage.setItem('litestart_users', JSON.stringify(filteredUsers));
      return { message: 'User deleted successfully' };
    }
  },
  
  checkHealth: checkBackendHealth
};

export default API_BASE_URL; 