import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';

function LostItemsList({ setCurrentPage, setSelectedItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const locations = ['all', ...new Set(items.map(item => item.location).filter(Boolean))];
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Lost Items
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {filteredItems.length} items waiting to be found
          </p>
          
          {/* Search & Actions */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for your item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
              >
                {locations.map(location => (
                  <option key={location} value={location} className="bg-gray-800">
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) {
                  setCurrentPage('login');
                  return;
                }
                setCurrentPage('postLost');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-500/25"
            >
               Report Lost Item
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{filteredItems.length}</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-green-400">89%</div>
            <div className="text-gray-400 text-sm">Found</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-purple-400">24h</div>
            <div className="text-gray-400 text-sm">Avg Time</div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading items...</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  itemData={item}
                  setCurrentPage={setCurrentPage}
                  setSelectedItem={setSelectedItem}
                />
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">{items.length === 0 ? '📝' : '🔍'}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {items.length === 0 ? 'No items posted yet' : 'No items found'}
                </h3>
                <p className="text-gray-400">
                  {items.length === 0 ? 'Be the first to report a lost item!' : 'Try adjusting your search terms'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LostItemsList;