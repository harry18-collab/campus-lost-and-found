import React, { useState, useEffect } from 'react';
import ItemImage from '../assets/bgImage4.jpg.webp';

function MyPostsFoundItems({ setCurrentPage, setSelectedItem }) {
  const [userFoundItems, setUserFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserFoundItems();
  }, []);

  const fetchUserFoundItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/my-items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const foundItems = data.filter(item => item.status === 'found');
      setUserFoundItems(foundItems);
    } catch (error) {
      console.error('Error fetching found items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUserFoundItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };
  const getAIStatusColor = (aiStatus) => {
    switch(aiStatus) {
      case 'match_pending': return 'text-yellow-400';
      case 'verified': return 'text-green-400';
      case 'no_matches': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getAIStatusText = (aiStatus) => {
    switch(aiStatus) {
      case 'match_pending': return 'Match Pending';
      case 'verified': return 'Verified Match';
      case 'no_matches': return 'No Matches';
      default: return 'Processing';
    }
  };

  const getAdminStatusColor = (adminStatus) => {
    switch(adminStatus) {
      case 'reviewing': return 'text-blue-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-sm">Loading your found items...</p>
        </div>
      ) : userFoundItems.length > 0 ? (
        userFoundItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => {
              setSelectedItem(item);
              setCurrentPage('itemDetails');
            }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="w-full h-32 sm:w-24 sm:h-24 flex-shrink-0">
                <img 
                  src={item.image || ItemImage} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = ItemImage; }}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 mb-1 truncate">📍 {item.location}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <div className="text-right ml-2">
                    <span className={`text-xs font-medium text-white px-2 py-1 rounded-full mb-1 sm:mb-2 inline-block ${
                      item.approved ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {item.approved ? 'Approved' : 'Pending'}
                    </span>
                    <p className="text-xs text-gray-500">#{item.id}</p>
                  </div>
                </div>
                
                {/* AI & Admin Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 pt-3 border-t border-gray-700 gap-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <div className="text-xs text-gray-400">
                      Posted on {new Date(item.date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto mt-2 sm:mt-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setCurrentPage('itemDetails');
                      }}
                      className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    >
                      View Details
                    </button>
                    {item.approved && item.matchedWith && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPage('chat');
                        }}
                        className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                      >
                        💬 Chat
                      </button>
                    )}
                    {!item.approved && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Edit functionality coming soon!');
                          }}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-sm">No found items reported yet</p>
        </div>
      )}
    </div>
  );
}

export default MyPostsFoundItems;