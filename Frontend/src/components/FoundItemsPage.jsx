import React, { useState, useEffect } from 'react';

function FoundItemsPage({ setCurrentPage }) {
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/found-items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFoundItems(data);
    } catch (error) {
      console.error('Error fetching found items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Failed to delete item');
        return;
      }
      
      fetchFoundItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Found Items</h1>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foundItems.length > 0 ? (
              foundItems.map(item => (
                <div key={item.id} className="bg-gray-800/50 border border-green-500/30 rounded-xl p-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 font-semibold text-sm">🟢 FOUND</span>
                    <span className="text-gray-400 text-xs">#{item.id}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div><span className="font-medium">Category:</span> {item.category}</div>
                    <div><span className="font-medium">Location:</span> {item.location}</div>
                    <div><span className="font-medium">Date:</span> {item.date}</div>
                    <div><span className="font-medium">Description:</span> {item.description}</div>
                    {item.matchStatus === 'approved' && (
                      <div className="text-green-400 font-medium mt-2">✓ Matched</div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={item.matchStatus === 'approved'}
                    className={`w-full mt-3 text-white text-sm px-4 py-2 rounded-lg transition-colors ${
                      item.matchStatus === 'approved' 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {item.matchStatus === 'approved' ? 'Matched (Cannot Delete)' : 'Delete'}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold text-white mb-2">No found items</h3>
                <p className="text-gray-400">No found items have been submitted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoundItemsPage;
