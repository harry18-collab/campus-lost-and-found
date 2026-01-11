import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

function ChatPage({ setCurrentPage }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token && token.includes('.')) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return String(payload.id || '');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  };

  const refreshChats = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Refresh chat list
      const response = await fetch('http://localhost:3001/api/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const enhancedChats = (data || []).map(chat => ({
        ...chat,
        otherUserId: chat.otherUserId || 'Unknown',
        otherUserName: chat.otherUserName || 'Unknown User',
        lastMessage: 'Click to start chatting...',
        lastMessageTime: chat.createdAt
      }));
      setChats(enhancedChats);
      
      // Refresh messages for selected chat
      if (selectedChat) {
        const messagesResponse = await fetch(`http://localhost:3001/api/chats/${selectedChat.id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error refreshing chats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch chats
    fetch('http://localhost:3001/api/chats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const enhancedChats = (data || []).map(chat => ({
        ...chat,
        otherUserId: chat.otherUserId || 'Unknown',
        otherUserName: chat.otherUserName || 'Unknown User',
        lastMessage: 'Click to start chatting...',
        lastMessageTime: chat.createdAt
      }));
      setChats(enhancedChats);
      if (enhancedChats.length > 0) {
        setSelectedChat(enhancedChats[0]);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching chats:', error);
      setLoading(false);
    });

    // Setup Socket.IO
    const socket = io('http://localhost:3001', {
      auth: { token }
    });
    
    socket.on('message', (data) => {
      setMessages(prev => {
        if (!prev.find(msg => msg.id === data.id)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on('newChat', (data) => {
      // Refresh chats when new chat is created
      fetch('http://localhost:3001/api/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const enhancedChats = (data || []).map(chat => ({
          ...chat,
          otherUserId: chat.otherUserId || 'Unknown',
          otherUserName: chat.otherUserName || 'Unknown User',
          lastMessage: 'Click to start chatting...',
          lastMessageTime: chat.createdAt
        }));
        setChats(enhancedChats);
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:3001/api/chats/${selectedChat.id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMessages(data));
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/chats/${selectedChat.id}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Chats...</h2>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Chats Yet</h2>
          <p className="text-gray-400 mb-6">Start chatting when your items get matched!</p>
          <button 
            onClick={() => setCurrentPage('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Chat List */}
      <div className="w-80 bg-gray-800/50 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Chats</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshChats}
                disabled={refreshing}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
                title="Refresh chats"
              >
                {refreshing ? '⏳' : '🔄'}
              </button>
              <button 
                onClick={() => setCurrentPage('myPosts')}
                className="text-gray-400 hover:text-white text-sm"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-700/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {chat.otherUserName ? chat.otherUserName.slice(0, 2).toUpperCase() : '??'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{chat.otherUserName || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-800/50 border-b border-gray-700 p-4">
              <h3 className="text-white font-medium">{selectedChat.otherUserName || 'Unknown User'}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const currentUserId = getCurrentUserId();
                return (
                <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs sm:max-w-md ${msg.senderId === currentUserId ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg p-3`}>
                    <p className="text-white text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === currentUserId ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-gray-800/50 border-t border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a Chat</h3>
              <p className="text-gray-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;