import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function NotificationsPage({ setCurrentPage }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch existing notifications
    fetch('http://localhost:3001/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setNotifications(data.map(n => ({
      id: n.id,
      type: 'match_found',
      title: 'Match Found!',
      message: n.message,
      timestamp: new Date(n.createdAt).toLocaleString(),
      read: n.read,
      actionRequired: true, // Always show buttons
      itemId: n.itemId,
      matchedUserId: n.matchedUserId // Fix: Include matchedUserId
    }))));

    // Connect to Socket.IO for notifications
    const socket = io('http://localhost:3001', {
      auth: { token }
    });
    
    socket.on('notification', (data) => {
      setNotifications(prev => [{
        id: data.id,
        type: 'match_found',
        title: 'Match Found!',
        message: data.message,
        timestamp: new Date(data.createdAt).toLocaleString(),
        read: false,
        actionRequired: true,
        itemId: data.itemId,
        matchedUserId: data.matchedUserId
      }, ...prev]);
    });

    return () => socket.disconnect();
  }, []);
  const [filter, setFilter] = useState('all');



  const getNotificationColor = (type) => {
    switch(type) {
      case 'match_found': return 'border-l-blue-500 bg-blue-900/10';
      case 'admin_approved': return 'border-l-green-500 bg-green-900/10';
      case 'admin_rejected': return 'border-l-red-500 bg-red-900/10';
      case 'new_message': return 'border-l-purple-500 bg-purple-900/10';
      case 'item_returned': return 'border-l-yellow-500 bg-yellow-900/10';
      default: return 'border-l-gray-500 bg-gray-900/10';
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'action') return notif.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">Stay updated on your lost and found items</p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({notifications.length})
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button 
            onClick={() => setFilter('action')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'action' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Action Required ({notifications.filter(n => n.actionRequired).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`border-l-4 ${getNotificationColor(notification.type)} bg-gray-800/50 rounded-r-lg p-4 cursor-pointer transition-all hover:bg-gray-800/70 ${
                  !notification.read ? 'ring-1 ring-blue-500/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        !notification.read ? 'text-white' : 'text-gray-300'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">#{notification.itemId}</span>
                      
                      {notification.actionRequired && (
                        <div className="flex gap-2">
                          {notification.type === 'match_found' && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPage('myPosts');
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                View Match
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const token = localStorage.getItem('token');
                                    await fetch('http://localhost:3001/api/chats', {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify({
                                        otherUserId: notification.matchedUserId, // Fix: Use actual matchedUserId
                                        itemId: notification.itemId
                                      })
                                    });
                                    setCurrentPage('chat');
                                  } catch (error) {
                                    console.error('Error starting chat:', error);
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Start Chat
                              </button>
                            </>
                          )}
                          {notification.type === 'new_message' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPage('chat');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Open Chat
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                {filter === 'unread' ? 'All caught up! No unread notifications.' : 
                 filter === 'action' ? 'No actions required at the moment.' :
                 'You\'ll see notifications here when there are updates.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;