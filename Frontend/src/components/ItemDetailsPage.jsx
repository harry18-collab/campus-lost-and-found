import React, { useState, useEffect } from 'react';
import ItemImage from '../assets/bgImage4.jpg.webp';

function ItemDetailsPage({ item, setCurrentPage }) {
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        // Right swipe (back gesture)
        if (diffX > 0) {
          setCurrentPage('lostItems');
        }
      }
    };

    const handleMouseDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = (e) => {
      const endX = e.clientX;
      const endY = e.clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Check if it's a horizontal drag (more horizontal than vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
        // Right drag (back gesture)
        if (diffX > 0) {
          setCurrentPage('lostItems');
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setCurrentPage]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Item not found</h2>
          <button 
            onClick={() => setCurrentPage('lostItems')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Lost Items
          </button>
        </div>
      </div>
    );
  }

  const handleFoundClaim = () => {
    setCurrentPage('postFound');
  };

  const handleSubmitClaim = () => {
    // In real app: submit claim to admin for verification
    alert('Your claim has been submitted to admin for verification. You will be contacted if approved.');
    setShowClaimForm(false);
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        


        {/* Main Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
          
          {/* Image */}
          <div className="relative">
            <img 
              src={item.image || ItemImage} 
              alt={item.name} 
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
              onError={(e) => { e.target.src = ItemImage; }}
            />
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <span className={`text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
                item.status === 'found' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {item.status === 'found' ? 'Found' : 'Lost'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            
            {/* Title & Info */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">{item.name}</h1>
              <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-4 text-sm">
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📍</span>
                  <span className="sm:hidden">At:</span>
                  <span className="hidden sm:inline">Last seen:</span>
                  <span className="ml-1">{item.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">📅</span>
                  <span className="sm:hidden">On:</span>
                  <span className="hidden sm:inline">Date lost:</span>
                  <span className="ml-1">{item.date}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>

            {/* How It Works Info - Hidden on mobile */}
            <div className="hidden sm:block bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <span className="mr-2">ℹ️</span>
                How Our System Works
              </h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• <strong>Step 1:</strong> You report that you found this item</p>
                <p>• <strong>Step 2:</strong> Our AI matches your report with this lost item</p>
                <p>• <strong>Step 3:</strong> Admin verifies the match for security</p>
                <p>• <strong>Step 4:</strong> We connect you with the owner safely</p>
              </div>
            </div>

            {/* Action Section */}
            {item.status === 'found' || (item.approved && item.matchedWith) ? (
              <div className="text-center">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2 sm:mb-3">✓ Item Already Found</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    This item has been matched and approved. The owner has been notified.
                  </p>
                </div>
              </div>
            ) : !showClaimForm ? (
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Found this item?</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  <span className="sm:hidden">Help reunite it with the owner</span>
                  <span className="hidden sm:inline">Report it as found and help reunite it with the owner</span>
                </p>
                <button 
                  onClick={handleFoundClaim}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
                >
                  ✓ I Found This Item
                </button>
              </div>
            ) : (
              <div className="bg-gray-700/50 rounded-lg p-4 sm:p-6">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Claim This Item</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Where did you find it?</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Library front desk"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <label className="block text-gray-300 text-sm mb-2">Additional details (optional)</label>
                    <textarea 
                      placeholder="Any additional information that proves you found this item"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 h-20 text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button 
                      onClick={handleSubmitClaim}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
                    >
                      Submit Claim
                    </button>
                    <button 
                      onClick={() => setShowClaimForm(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Note */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                <span className="sm:hidden">🔒 Claims verified by admin</span>
                <span className="hidden sm:inline">🔒 All claims are verified by admin before connecting users for security and privacy.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;