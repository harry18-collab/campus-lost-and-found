import React, { useState, useEffect } from 'react';
import MyPostsLostItems from './MyPostsLostItems';
import MyPostsFoundItems from './MyPostsFoundItems';

function MyPostsPage({ setCurrentPage, setSelectedItem }) {
  const [activeTab, setActiveTab] = useState('lost');
  const [lostItemsCount, setLostItemsCount] = useState(0);
  const [foundItemsCount, setFoundItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemCounts();
  }, []);

  const fetchItemCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/my-items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const lostCount = data.filter(item => item.status === 'lost').length;
      const foundCount = data.filter(item => item.status === 'found').length;
      setLostItemsCount(lostCount);
      setFoundItemsCount(foundCount);
    } catch (error) {
      console.error('Error fetching item counts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">My Posts</h1>
              <p className="text-gray-400 text-sm">
                Manage your reports
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center hover:bg-gray-800/70 transition-all">
            <div className="text-lg sm:text-2xl font-bold text-white mb-1">{lostItemsCount}</div>
            <div className="text-gray-400 text-xs">Lost</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center hover:bg-gray-800/70 transition-all">
            <div className="text-lg sm:text-2xl font-bold text-white mb-1">{foundItemsCount}</div>
            <div className="text-gray-400 text-xs">Found</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center hover:bg-gray-800/70 transition-all">
            <div className="text-lg sm:text-2xl font-bold text-white mb-1">{lostItemsCount + foundItemsCount}</div>
            <div className="text-gray-400 text-xs">Total</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button 
            onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) {
                setCurrentPage('login');
                return;
              }
              setCurrentPage('postLost');
            }}
            className="flex-1 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/30 hover:to-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all backdrop-blur-sm text-xs sm:text-sm hover:scale-105"
          >
            📢 Report Lost
          </button>
          <button 
            onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) {
                setCurrentPage('login');
                return;
              }
              setCurrentPage('postFound');
            }}
            className="flex-1 bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 border border-green-500/30 text-green-400 hover:text-green-300 font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all backdrop-blur-sm text-xs sm:text-sm hover:scale-105"
          >
            ✨ Report Found
          </button>
          <button 
            onClick={() => setCurrentPage('chat')}
            className="flex-1 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all backdrop-blur-sm text-xs sm:text-sm hover:scale-105"
          >
            💬 Chat
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('lost')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              activeTab === 'lost' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Lost ({lostItemsCount})
          </button>
          <button 
            onClick={() => setActiveTab('found')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              activeTab === 'found' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Found ({foundItemsCount})
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          {activeTab === 'lost' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Lost Items</h2>
                  <p className="text-xs text-gray-500">Items you've reported as lost</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                  {lostItemsCount} items
                </div>
              </div>
              <MyPostsLostItems setCurrentPage={setCurrentPage} setSelectedItem={setSelectedItem} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Found Items</h2>
                  <p className="text-xs text-gray-500">Items you've reported as found</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                  {foundItemsCount} items
                </div>
              </div>
              <MyPostsFoundItems setCurrentPage={setCurrentPage} setSelectedItem={setSelectedItem} />
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-r from-gray-800/20 to-gray-700/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-400 text-sm">💡</span>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2 text-sm">
                Tips for Better Results
              </h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Add detailed descriptions and photos</li>
                <li>• Update posts with new information</li>
                <li>• Check regularly for matches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPostsPage;