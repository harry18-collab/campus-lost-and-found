import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import LostItemsList from './components/LostItemsList';
import Footer from './components/Footer';
import ItemDetailsPage from './components/ItemDetailsPage';
import MyPostsPage from './components/MyPostsPage';
import LoginPage from './components/LoginPage';
import PostLostItemPage from './components/PostLostItemPage';
import PostFoundItemPage from './components/PostFoundItemPage';
import ChatPage from './components/ChatPage';
import NotificationsPage from './components/NotificationsPage';
import FoundItemsPage from './components/FoundItemsPage';
import AdminDashboard from './components/AdminDashboard';
import bgImage from './assets/bgImage4.jpg.webp';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser(data);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  // Handle browser history
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.selectedItem) {
          setSelectedItem(event.state.selectedItem);
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    window.history.replaceState({ page: 'home' }, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Enhanced setCurrentPage that manages browser history
  const handlePageChange = (page, item = null) => {
    setCurrentPage(page);
    if (item) {
      setSelectedItem(item);
    }
    
    // Push state to browser history
    const state = { page };
    if (item) {
      state.selectedItem = item;
    }
    
    window.history.pushState(state, '', window.location.pathname);
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <main>
          <div className="p-2 pt-14 sm:p-8 sm:pt-28">
            <Hero setCurrentPage={handlePageChange} />
          </div>
          <HowItWorks />
          <Footer setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'lostItems') {
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <LostItemsList setCurrentPage={handlePageChange} setSelectedItem={(item) => handlePageChange('itemDetails', item)} />
        </main>
      );
    } else if (currentPage === 'itemDetails') {
        return (
          <main className="p-2 pt-16 sm:p-8 sm:pt-28">
            <ItemDetailsPage item={selectedItem} setCurrentPage={handlePageChange} />
          </main>
        );
    } else if (currentPage === 'myPosts') {
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <MyPostsPage setCurrentPage={handlePageChange} setSelectedItem={(item) => handlePageChange('itemDetails', item)} />
        </main>
      );
    } else if (currentPage === 'login') {
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <LoginPage setCurrentPage={handlePageChange} setUser={setUser} />
        </main>
      );
    } else if (currentPage === 'postLost') {
      return (
        <main>
          <PostLostItemPage setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'postFound') {
      return (
        <main>
          <PostFoundItemPage setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'chat') {
      return (
        <main>
          <ChatPage setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'notifications') {
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <NotificationsPage setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'foundItems') {
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <FoundItemsPage setCurrentPage={handlePageChange} />
        </main>
      );
    } else if (currentPage === 'admin') {
      if (!user || user.role !== 'admin') {
        return (
          <main className="p-2 pt-16 sm:p-8 sm:pt-28">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
                <button 
                  onClick={() => handlePageChange('home')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </main>
        );
      }
      return (
        <main className="p-2 pt-16 sm:p-8 sm:pt-28">
          <AdminDashboard setCurrentPage={handlePageChange} user={user} />
        </main>
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      
      {/* Background Image Container */}
      <div className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}>
      </div>

      {/* Semi-transparent Overlay */}
      <div className="fixed inset-0 z-10 bg-gray-950/80"></div>
      
      {/* Main Content */}
      <div className="relative z-20">
        {(currentPage !== 'login' && currentPage !== 'postLost' && currentPage !== 'postFound' && currentPage !== 'chat') &&
          <Header setCurrentPage={handlePageChange} user={user} setUser={setUser} />
        }
        {renderPage()}
      </div>

    </div>
  );
}

export default App;