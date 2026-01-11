import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Header({ setCurrentPage, user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('home');
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { 
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Setup Socket.IO for real-time notifications
      const token = localStorage.getItem('token');
      const socket = io('http://localhost:3001', {
        auth: { token }
      });
      
      socket.on('notification', () => {
        fetchNotifications(); // Refresh notifications when new one arrives
      });
      
      const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds as backup
      
      return () => {
        socket.disconnect();
        clearInterval(interval);
      };
    }
  }, [user]);

  // Refresh notifications when page changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [window.location.pathname]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const notifications = await response.json();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className={`fixed z-50 w-full flex justify-center transition-all duration-300 ${scrolled ? 'top-0' : 'top-2 sm:top-6'}`}>
      
      <div className={`mx-auto ${scrolled ? 'w-full max-w-full rounded-b-lg border-b border-b-black/20' : 'w-[95%] sm:w-[90%] max-w-9xl rounded-xl sm:rounded-2xl shadow-lg  border-b-white/20'} 
        px-4 sm:px-6 py-3 sm:py-4 md:py-6 flex justify-between items-center transition-all duration-300 backdrop-blur-lg bg-white/10 border`}>
        
        <div className="text-base sm:text-lg md:text-xl font-bold text-white cursor-pointer" onClick={() => setCurrentPage('home')}>
          <span className="hidden sm:inline">Lost & Found Campus</span>
          <span className="sm:hidden">L&F Campus</span>
        </div>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <button 
            className="text-gray-200 hover:text-blue-400 transition-colors" 
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className="text-gray-200 hover:text-blue-400 transition-colors" 
            onClick={() => setCurrentPage('lostItems')}
          >
            Lost Items
          </button>
          {user && user.role !== 'admin' && (
            <>
              <button 
                className="text-gray-200 hover:text-blue-400 transition-colors" 
                onClick={() => setCurrentPage('myPosts')}
              >
                My Posts
              </button>
              <button 
                className="relative text-gray-200 hover:text-blue-400 transition-colors" 
                onClick={() => {
                  setCurrentPage('notifications');
                  setTimeout(fetchNotifications, 100); // Refresh after navigation
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </>
          )}
          {user && user.role === 'admin' && (
            <button 
              className="text-gray-200 hover:text-blue-400 transition-colors" 
              onClick={() => setCurrentPage('foundItems')}
            >
              Found Items
            </button>
          )}
          {user && user.role === 'admin' && (
            <button 
              className="text-gray-200 hover:text-blue-400 transition-colors" 
              onClick={() => setCurrentPage('admin')}
            >
              Admin
            </button>
          )}
          {user ? (
            <div className="relative">
              <button 
                className="text-gray-200 hover:text-blue-400 transition-colors flex items-center gap-2" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span>Hi, {user.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                  <button 
                    className="w-full text-left px-4 py-2 text-gray-200 hover:text-blue-400 hover:bg-white/10 transition-colors rounded-t-lg"
                    onClick={() => { setCurrentPage('myPosts'); setUserMenuOpen(false); }}
                  >
                    My Profile
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-gray-200 hover:text-red-400 hover:bg-white/10 transition-colors rounded-b-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="text-gray-200 hover:text-blue-400 transition-colors" 
              onClick={() => setCurrentPage('login')}
            >
              Login
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-white focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full mt-1 flex w-full justify-center rounded-lg right-0 left-0 sm:left-0 sm:right-0 p-4 bg-gray-900/95 shadow-lg border border-white/20 backdrop-blur-lg">
            <div className="flex flex-col space-y-3">
              <button 
                className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
              >
                Home
              </button>
              <button 
                className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                onClick={() => { setCurrentPage('lostItems'); setMenuOpen(false); }}
              >
                Lost Items
              </button>
              {user && user.role !== 'admin' && (
                <>
                  <button 
                    className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                    onClick={() => { setCurrentPage('myPosts'); setMenuOpen(false); }}
                  >
                    My Posts
                  </button>
                  <button 
                    className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2 flex items-center gap-2" 
                    onClick={() => { 
                      setCurrentPage('notifications'); 
                      setMenuOpen(false);
                      setTimeout(fetchNotifications, 100);
                    }}
                  >
                    <div className="relative">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    Notifications
                  </button>
                </>
              )}
              {user && user.role === 'admin' && (
                <button 
                  className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                  onClick={() => { setCurrentPage('foundItems'); setMenuOpen(false); }}
                >
                  Found Items
                </button>
              )}
              {user && user.role === 'admin' && (
                <button 
                  className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                  onClick={() => { setCurrentPage('admin'); setMenuOpen(false); }}
                >
                  Admin
                </button>
              )}
              {user ? (
                <>
                  <div className="text-gray-200 py-2 border-b border-white/20">
                    Hi, {user.name}
                  </div>
                  <button 
                    className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                    onClick={() => { setCurrentPage('myPosts'); setMenuOpen(false); }}
                  >
                    My Profile
                  </button>
                  <button 
                    className="text-gray-200 hover:text-red-400 transition-colors text-left py-2" 
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  className="text-gray-200 hover:text-blue-400 transition-colors text-left py-2" 
                  onClick={() => { setCurrentPage('login'); setMenuOpen(false); }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;