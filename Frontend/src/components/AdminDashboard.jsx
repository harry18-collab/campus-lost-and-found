import React, { useState, useEffect } from 'react';
import ItemImage from '../assets/bgImage4.jpg.webp';

function AdminDashboard({ setCurrentPage, user }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/admin/items/${itemId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchAllItems(); // Refresh the list
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchAllItems(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.matchStatus === 'pending';
    if (filter === 'approved') return item.matchStatus === 'approved';
    if (filter === 'rejected') return item.matchStatus === 'rejected';
    return false;
  });

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-900/20 border-green-500/30 text-green-400';
      case 'rejected': return 'bg-red-900/20 border-red-500/30 text-red-400';
      default: return 'bg-blue-900/20 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm">Review and manage AI-generated matches</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{items.filter(item => item.matchStatus === 'pending').length}</div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-green-400">{items.filter(item => item.matchStatus === 'approved').length}</div>
            <div className="text-gray-400 text-sm">Approved</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-red-400">{items.filter(item => item.matchStatus === 'rejected').length}</div>
            <div className="text-gray-400 text-sm">Rejected</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white">{items.length}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'pending' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pending ({items.filter(item => item.matchStatus === 'pending').length})
          </button>
          <button 
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'approved' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Approved ({items.filter(item => item.matchStatus === 'approved').length})
          </button>
          <button 
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'rejected' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rejected ({items.filter(item => item.matchStatus === 'rejected').length})
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({items.length})
          </button>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading items...</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.length > 0 ? (
              filteredItems.map(lostItem => (
                <div key={lostItem.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">Lost Item #{lostItem.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lostItem.approved 
                          ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                          : 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-400'
                      }`}>
                        {lostItem.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {!lostItem.approved && (
                      <button 
                        onClick={() => handleApprove(lostItem.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        Approve Lost Item
                      </button>
                    )}
                  </div>

                  {/* Lost Item and Matches Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Lost Item Card */}
                    <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-red-400 font-semibold">🔴 LOST ITEM</span>
                      </div>
                      {lostItem.image && (
                        <img 
                          src={lostItem.image} 
                          alt={lostItem.name} 
                          className="w-full h-40 object-cover rounded-lg mb-3"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <h4 className="text-white font-semibold mb-2">{lostItem.name}</h4>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div><span className="font-medium">User ID:</span> {lostItem.userId}</div>
                        <div><span className="font-medium">Category:</span> {lostItem.category}</div>
                        <div><span className="font-medium">Location:</span> {lostItem.location}</div>
                        <div><span className="font-medium">Date:</span> {lostItem.date}</div>
                        <div><span className="font-medium">Description:</span> {lostItem.description}</div>
                      </div>
                    </div>

                    {/* Possible Matches */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        🤖 AI Suggested Matches ({lostItem.aiMatches?.length || 0})
                      </h4>
                      {lostItem.aiMatches && lostItem.aiMatches.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {lostItem.aiMatches.map((match, idx) => (
                            <div key={idx} className="bg-gray-900/50 border border-green-500/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-400 font-semibold text-xs">🟢 FOUND ITEM</span>
                                <span className={`text-lg font-bold ml-auto ${
                                  match.score >= 70 ? 'text-green-400' :
                                  match.score >= 50 ? 'text-yellow-400' : 'text-orange-400'
                                }`}>
                                  {match.score}%
                                </span>
                              </div>
                              {match.item.image && (
                                <img 
                                  src={match.item.image} 
                                  alt={match.item.name} 
                                  className="w-full h-32 object-cover rounded-lg mb-2"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <h5 className="text-white font-medium text-sm mb-2">{match.item.name}</h5>
                              <div className="text-xs text-gray-400 space-y-1 mb-3">
                                <div><span className="font-medium">User ID:</span> {match.item.userId}</div>
                                <div><span className="font-medium">Category:</span> {match.item.category}</div>
                                <div><span className="font-medium">Location:</span> {match.item.location}</div>
                                <div><span className="font-medium">Description:</span> {match.item.description}</div>
                              </div>
                              {(() => {
                                const isMatchRejected = lostItem.rejectedMatches?.includes(match.item.id);
                                const isMatchApproved = lostItem.matchedWith === match.item.id && lostItem.matchStatus === 'approved';
                                
                                if (isMatchApproved) {
                                  return (
                                    <div className="space-y-2">
                                      <div className="text-center text-green-400 text-xs font-medium">
                                        ✓ Match Approved
                                      </div>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const token = localStorage.getItem('token');
                                            await fetch(`http://localhost:3001/api/admin/items/${lostItem.id}/revert-match/${match.item.id}`, {
                                              method: 'PUT',
                                              headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            fetchAllItems();
                                          } catch (error) {
                                            console.error('Error reverting match:', error);
                                          }
                                        }}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-2 rounded transition-colors font-medium"
                                      >
                                        ↺ Revert Match
                                      </button>
                                    </div>
                                  );
                                } else if (isMatchRejected) {
                                  return (
                                    <div className="space-y-2">
                                      <div className="text-center text-red-400 text-xs font-medium">
                                        ✕ Match Rejected
                                      </div>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const token = localStorage.getItem('token');
                                            await fetch(`http://localhost:3001/api/admin/items/${lostItem.id}/revert-match/${match.item.id}`, {
                                              method: 'PUT',
                                              headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            fetchAllItems();
                                          } catch (error) {
                                            console.error('Error reverting rejected match:', error);
                                          }
                                        }}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-2 rounded transition-colors font-medium"
                                      >
                                        ↺ Revert Rejection
                                      </button>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="space-y-2">
                                      <button
                                        onClick={async () => {
                                          try {
                                            const token = localStorage.getItem('token');
                                            await fetch(`http://localhost:3001/api/admin/items/${lostItem.id}/approve-match/${match.item.id}`, {
                                              method: 'PUT',
                                              headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            fetchAllItems();
                                          } catch (error) {
                                            console.error('Error approving match:', error);
                                          }
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded transition-colors font-medium"
                                      >
                                        ✓ Approve Match
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const token = localStorage.getItem('token');
                                            await fetch(`http://localhost:3001/api/admin/items/${lostItem.id}/reject-match/${match.item.id}`, {
                                              method: 'PUT',
                                              headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            fetchAllItems();
                                          } catch (error) {
                                            console.error('Error rejecting match:', error);
                                          }
                                        }}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition-colors font-medium"
                                      >
                                        ✕ Reject Match
                                      </button>
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No matches found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reject Button */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button 
                      onClick={() => handleReject(lostItem.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      🗑️ Reject Lost Item
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
                <p className="text-gray-400">
                  {filter === 'pending' ? 'No pending items to review.' :
                   filter === 'approved' ? 'No approved items yet.' :
                   'No items available.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;