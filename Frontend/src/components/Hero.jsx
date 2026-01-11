import React from "react";

function Hero({ setCurrentPage }) {
  const handlePostItem = (type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(type);
  };
  return (
    <div className="flex justify-center w-[95%] sm:w-[90%] max-w-9xl mx-auto mt-2 sm:mt-4 text-gray-300">
      <section className="flex flex-col items-center justify-center text-center
        py-8 sm:py-12 px-4 sm:px-6 mt-6 sm:mt-10 w-full
         rounded-xl sm:rounded-2xl shadow-lg gap-6 sm:gap-8 md:gap-12">
        
        {/* Main Text Content */}
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-3 leading-tight">
            Lost Something?
            <br />
            <span className="text-2xl sm:text-3xl md:text-5xl">We'll Help You Find It</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl mb-1 sm:mb-4 leading-relaxed px-2">
            <span className="hidden sm:inline">The easiest way to reunite with your lost items on campus.</span> 
            Post what you've lost or found, and let our smart matching help connect you.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <button 
              onClick={() => handlePostItem('postLost')}
              className="bg-gray-300 text-gray-800 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition transform hover:scale-105 hover:bg-gray-400 text-sm sm:text-base"
            >
              Report Lost Item
            </button>
            <button 
              onClick={() => handlePostItem('postFound')}
              className="bg-blue-500/80 border border-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition transform hover:scale-105 hover:bg-blue-800 text-sm sm:text-base text-white"
            >
              Report Found Item
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-8 w-full gap-4 sm:gap-0">
          <div className="flex-1 text-center py-2 sm:py-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-300">1,247</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">Items Reunited</p>
          </div>
          <div className="flex-1 text-center py-2 sm:py-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-300">89%</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">Success Rate</p>
          </div>
          <div className="flex-1 text-center py-2 sm:py-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-300">3,456</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">Students Helped</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;