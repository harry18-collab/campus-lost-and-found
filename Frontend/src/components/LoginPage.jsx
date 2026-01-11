import React, { useState } from 'react';
import { User, Shield, ArrowLeft } from 'react-feather';

function LoginPage({ setCurrentPage, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!isLogin) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { name: fullName, email, password, confirmPassword, role: userType };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Store token and set user state
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Redirect to home
      setCurrentPage('home');
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-h-screen px-3 py-4 sm:p-4">
      <div className="w-full max-w-[340px] sm:max-w-md p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-gray-900/50 backdrop-blur-lg border border-gray-700 text-white">
        
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
            {isLogin ? 'Sign in to CampusFind to find your items' : 'Join CampusFind to help reunite lost items with their owners'}
          </p>
        </div>

        <div className="flex items-center p-1 mb-4 sm:mb-6 rounded-lg bg-gray-800">
          <button
            type="button"
            onClick={() => setUserType('student')}
            className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              userType === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <User size={16} className="sm:w-[18px] sm:h-[18px]" /> <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              userType === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Shield size={16} className="sm:w-[18px] sm:h-[18px]" /> <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 sm:space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              required
              minLength={6}
            />
            {!isLogin && <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>}
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : `Create ${userType === 'student' ? 'Student' : 'Admin'} Account`)}
          </button>
        </form>

        {isLogin && (
          <button 
            type="button" 
            className="text-xs sm:text-sm text-center text-blue-400 hover:underline transition-colors mt-3 sm:mt-4" 
            onClick={() => console.log('Forgot password')}
          >
            Forgot your password?
          </button>
        )}
        
        <div className="flex items-center justify-center mt-3 sm:mt-4">
          <div className="border-b border-gray-700 w-full"></div>
        </div>
        <div className="w-full text-center mt-2">
          <p className="px-2 sm:px-4 text-xs sm:text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3 sm:mt-4 text-xs sm:text-sm"
        >
          {isLogin ? 'Create an account' : 'Sign in'}
        </button>
      </div>

      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center space-x-1.5 sm:space-x-2 mt-4 sm:mt-6 text-gray-400 hover:text-white transition-colors text-sm sm:text-lg"
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> <span>Back to Home</span>
      </button>
    </div>
  );
}

export default LoginPage;