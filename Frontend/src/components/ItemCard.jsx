import React from 'react';
import ItemImage from '../assets/bgImage4.jpg.webp'; // Placeholder image

function ItemCard({ setCurrentPage, setSelectedItem, itemData }) {
  
  const statusText = itemData.status === 'found' ? 'Found' : 'Lost';

  const handleClick = () => {
    setSelectedItem(itemData);
    setCurrentPage('itemDetails');
  };

  return (
    <div onClick={handleClick} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg">
      
      {/* Item Image */}
      <div className="relative">
        <img 
          src={itemData.image || ItemImage} 
          alt={itemData.name} 
          className="w-full h-28 sm:h-40 object-cover"
          onError={(e) => { e.target.src = ItemImage; }}
        />
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <span className={`text-xs font-medium text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ${
            itemData.status === 'found' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Item Details */}
      <div className="p-2 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2 truncate">
          {itemData.name}
        </h3>
        <div className="flex items-center text-gray-300 mb-1 sm:mb-2">
          <span className="mr-1 sm:mr-1.5 text-xs sm:text-sm">📍</span>
          <span className="text-xs sm:text-sm truncate">{itemData.location}</span>
        </div>
        <p className="text-xs text-gray-400 mb-1 sm:mb-2 hidden sm:block">
          {itemData.date}
        </p>
        <p className="text-xs text-gray-400 line-clamp-2 hidden sm:block">
          {itemData.description}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;