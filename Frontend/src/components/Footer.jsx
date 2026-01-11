import { useState } from "react";

export default function Footer({ setCurrentPage }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How do I report a lost item?",
      a: "Click 'Report Lost Item' button, fill in the details including description, location, and date. Your post will be publicly visible to help others identify your item."
    },
    {
      q: "How can I claim a found item?",
      a: "Found items are private and only visible to admins. Our AI will match your lost item post with found items, and admins will verify before connecting you."
    },
    {
      q: "How long does verification take?",
      a: "Usually within 24-48 hours. Admins review all matches to ensure items are returned to rightful owners safely."
    },
    {
      q: "Is this platform secure?",
      a: "Yes, we require college email verification and all matches are admin-approved to prevent false claims and ensure security."
    },
    {
      q: "What happens if my item isn't found?",
      a: "Your post stays active and you'll be notified if a matching item is later reported. The AI continuously scans for new matches."
    }
  ];

  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        


        {/* FAQ Section */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-200">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex justify-between items-center"
                >
                  <span className="font-medium text-white pr-2 sm:pr-4 text-sm sm:text-base">{faq.q}</span>
                  <svg 
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-white/10 animate-fadeIn">
                    <p className="text-gray-300 pt-3 sm:pt-4 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-16 text-center border border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Lost something? Found something?</h3>
            <p className="text-slate-300 mb-5 sm:mb-6 text-sm sm:text-base">
              Help reunite items with their owners through our secure campus platform.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <button 
                onClick={() => setCurrentPage('postLost')}
                className="group relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500 hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
              >
                <span className="relative z-10">📍 Report Lost Item</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => setCurrentPage('postFound')}
                className="group relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500 hover:shadow-lg hover:shadow-green-500/25 text-sm sm:text-base"
              >
                <span className="relative z-10">✨ Report Found Item</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">🎯</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">Campus Lost & Found</span>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base hidden sm:block">
              AI-powered platform connecting lost items with their owners through secure campus verification. Making campus life easier, one found item at a time.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <button 
                  onClick={() => setCurrentPage('lostItems')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  Browse Lost Items
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('postLost')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  Report Lost Item
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('postFound')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  Report Found Item
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('myPosts')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  My Posts
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Support</h3>
            <ul className="space-y-1 sm:space-y-3">
              <li><a href="mailto:support@campus.edu" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block text-sm sm:text-base">📧 Contact Support</a></li>
              <li><a href="tel:+1-555-CAMPUS" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block text-sm sm:text-base">📞 Campus Security</a></li>
              <li>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-400 hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200 text-sm sm:text-base"
                >
                  🔐 Login / Sign Up
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}