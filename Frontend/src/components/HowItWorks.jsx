import React from 'react';
import { Search, Compass, Truck } from 'react-feather';

function HowItWorks() {
  return (
    <div className="flex justify-center w-full bg-gray-900/90 rounded-xl py-8 sm:py-12 border border-b-white/20 mt-6 sm:mt-10 sm:mx-0">
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 text-white">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-2 sm:mb-4">
          How It Works
        </h2>
        <p className="text-gray-300 text-sm sm:text-md md:text-xl text-center max-w-2xl mb-6 sm:mb-10 px-2">
          Our smart platform makes it easy to post lost and found items with intelligent matching suggestions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
          {/* Step 1: Smart Matching */}
          <div className="flex flex-col items-center text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 sm:p-5 md:p-6 transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            <div className="bg-gray-700 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-200 text-sm sm:text-base">
              AI-powered suggestions help match lost items with found items based on description, location, and time.
            </p>
          </div>

          {/* Step 2: Campus Community */}
          <div className="flex flex-col items-center text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 sm:p-5 md:p-6 transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            <div className="bg-gray-700 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Campus Community</h3>
            <p className="text-gray-200 text-sm sm:text-base">
              Connect with fellow students and staff to help each other find lost belongings across campus.
            </p>
          </div>

          {/* Step 3: Secure Process */}
          <div className="flex flex-col items-center text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 sm:p-5 md:p-6 transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            <div className="bg-gray-700 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure Process</h3>
            <p className="text-gray-200 text-sm sm:text-base">
              Verified claims and admin oversight ensure items are returned to their rightful owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;