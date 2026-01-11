import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud } from 'react-feather';

function PostLostItemPage({ setCurrentPage }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      setCurrentPage('login');
      return;
    }
    
    // Get user info
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
        setCurrentPage('login');
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      setCurrentPage('login');
    });
  }, [setCurrentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!itemName || !description || !location || !category || !dateLost) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      let imageBase64 = null;
      if (photo) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photo);
        });
      }
      
      const itemData = {
        name: itemName,
        description,
        location,
        category,
        date: dateLost,
        status: 'lost',
        image: imageBase64,
        userId: user?.id,
        userName: user?.name
      };

      const response = await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error('Failed to post item');
      }

      const result = await response.json();
      setShowConfirmation(true);
    } catch (err) {
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if checking authentication
  if (!user) {
    return (
      <div className="flex justify-center items-center p-4 min-h-screen">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="flex justify-center items-center p-4 min-h-screen">
        <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-gray-900/50 backdrop-blur-lg border border-gray-700 text-white text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Item Reported Successfully!</h2>
          <p className="text-gray-300 mb-4">Your item has been submitted for admin approval.</p>
          <p className="text-sm text-gray-400 mb-6">
            Once approved by admin, your item will be visible to others and our system will look for matches.
          </p>
          <button 
            onClick={() => setCurrentPage('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-2 sm:p-4 max-h-screen">
      <div className="w-full max-w-2xl p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg bg-gray-900/50 backdrop-blur-lg border border-gray-700 text-white mt-2 sm:mt-10">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">Report a Lost Item</h2>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg self-start sm:self-auto"
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
          Fill in all details. Your post will need admin approval before being visible to others.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4 sm:space-y-6">

          {/* Photo Section */}
          <div>
            <p className="text-base sm:text-lg font-semibold text-white mb-2">Photo</p>
            {!photo ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center">
                <UploadCloud size={40} className="mx-auto text-gray-500 sm:w-12 sm:h-12" />
                <p className="text-gray-400 text-xs sm:text-sm mt-2">Upload a photo of the item</p>
                <p className="text-xs text-gray-500 hidden sm:block">A clear photo helps with identification and matching</p>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('photo-upload').click()} 
                  className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Choose Photo
                </button>
              </div>
            ) : (
              <div className="border-2 border-gray-600 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt="Selected item" 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-green-400 text-sm font-medium mb-1">✓ Photo Selected</p>
                    <p className="text-gray-300 text-xs mb-2 break-all">{photo.name}</p>
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('photo-upload').click()} 
                      className="text-blue-400 hover:text-blue-300 text-xs underline"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>
            )}
            <input 
              id="photo-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])} 
            />
          </div>

          {/* Item Details Section */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg font-semibold text-white mb-2">Item Details</p>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Title *"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description *"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-28 sm:h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-400"
                required
              >
                <option value="">Category *</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Card">Card</option>
                <option value="Keys">Keys</option>
                <option value="Wallet">Wallet</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="📍 Last Seen Location *"
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-white placeholder-gray-400 hover:bg-gray-800/80 transition-all"
                required
              />
            </div>
            <input
              type="date"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              placeholder="Date Lost *"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-400"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button 
              type="button" 
              onClick={() => setCurrentPage('home')} 
              className="bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 hover:bg-gray-600 w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2"
            >
              {loading ? 'Posting...' : 'Report Lost Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostLostItemPage;