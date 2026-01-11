import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';
import { users } from './models/User.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found API Server', status: 'running' });
});

app.use('/api/auth', authRoutes);

let items = [];
let notifications = [];
let chats = [];
let messages = [];
const connectedUsers = new Map();

/**
 * Public list: returns only unapproved/unmatched lost items
 * Approved/matched items are hidden from public view
 * Found items are only visible to admin for AI matching
 */
app.get('/api/items', (req, res) => {
  const lostItems = items.filter(item => 
    item.status === 'lost' && 
    item.matchStatus !== 'approved'
  );
  res.json(lostItems);
});

app.post('/api/items', authMiddleware, (req, res) => {
  console.log('Creating item for user:', req.user && req.user.id, typeof (req.user && req.user.id));
  const newItem = {
    id: Date.now(),
    ...req.body,
    approved: false,
    matchStatus: 'pending',
    createdAt: new Date().toISOString(),
    userId: String(req.user && req.user.id ? req.user.id : '')
  };

  items.push(newItem);
  console.log('Item saved with userId:', newItem.userId, typeof newItem.userId);
  res.status(201).json(newItem);
});

// AI Matching Algorithm
function calculateMatchScore(lostItem, foundItem) {
  let score = 0;
  
  // Category match (40 points)
  if (lostItem.category && foundItem.category && 
      lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    score += 40;
  }
  
  // Name/Description similarity (30 points)
  const lostName = (lostItem.name || '').toLowerCase();
  const foundName = (foundItem.name || '').toLowerCase();
  const lostDesc = (lostItem.description || '').toLowerCase();
  const foundDesc = (foundItem.description || '').toLowerCase();
  
  const lostText = lostName + ' ' + lostDesc;
  const foundText = foundName + ' ' + foundDesc;
  
  if (lostText.trim() && foundText.trim()) {
    const lostWords = lostText.split(/\s+/).filter(w => w.length > 3);
    const commonWords = lostWords.filter(word => foundText.includes(word));
    score += Math.min(30, commonWords.length * 10);
  }
  
  // Location match (20 points)
  if (lostItem.location && foundItem.location && 
      lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase())) {
    score += 20;
  }
  
  // Color match (10 points)
  if (lostItem.color && foundItem.color && 
      lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) {
    score += 10;
  }
  
  return score;
}

// Admin-only: Get lost items with their found item matches
app.get('/api/admin/items', authMiddleware, adminMiddleware, (req, res) => {
  const lostItems = items.filter(item => item.status === 'lost');
  const foundItems = items.filter(item => item.status === 'found');
  
  const lostItemsWithMatches = lostItems.map(lostItem => {
    const matches = foundItems
    .map(foundItem => ({
      item: foundItem,
      score: calculateMatchScore(lostItem, foundItem)
    }))
    .filter(match => match.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
    
    return { ...lostItem, aiMatches: matches };
  });
  
  res.json(lostItemsWithMatches);
});

// Admin-only: Get all found items
app.get('/api/admin/found-items', authMiddleware, adminMiddleware, (req, res) => {
  const foundItems = items.filter(item => item.status === 'found');
  res.json(foundItems);
});

// Admin-only: Approve item
app.put('/api/admin/items/:id/approve', authMiddleware, adminMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(item => item.id === itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  item.approved = true;
  res.json(item);
});

// Admin-only: Approve matched pair (both lost and found items)
app.put('/api/admin/items/:id/approve-match/:matchId', authMiddleware, adminMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const matchId = parseInt(req.params.matchId);
  
  const item = items.find(item => item.id === itemId);
  const matchedItem = items.find(item => item.id === matchId);
  
  if (!item || !matchedItem) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  // Approve both items and store match info
  item.approved = true;
  item.matchStatus = 'approved';
  item.matchedWith = matchId;
  item.matchedUserId = matchedItem.userId;
  
  matchedItem.approved = true;
  matchedItem.matchStatus = 'approved';
  matchedItem.matchedWith = itemId;
  matchedItem.matchedUserId = item.userId;
  
  // Create notifications for both users
  const notification1 = {
    id: Date.now(),
    userId: item.userId,
    message: `Your ${item.status} item "${item.name}" has been matched!`,
    itemId: item.id,
    matchedItemId: matchId,
    matchedUserId: matchedItem.userId,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  const notification2 = {
    id: Date.now() + 1,
    userId: matchedItem.userId,
    message: `Your ${matchedItem.status} item "${matchedItem.name}" has been matched!`,
    itemId: matchedItem.id,
    matchedItemId: itemId,
    matchedUserId: item.userId,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(notification1, notification2);
  
  // Create chat between matched users
  const existingChat = chats.find(chat => 
    (chat.user1Id === item.userId && chat.user2Id === matchedItem.userId) ||
    (chat.user2Id === item.userId && chat.user1Id === matchedItem.userId)
  );
  
  if (!existingChat) {
    const user1 = users.find(u => String(u.id) === String(item.userId));
    const user2 = users.find(u => String(u.id) === String(matchedItem.userId));
    const newChat = {
      id: Date.now() + 2,
      user1Id: item.userId,
      user2Id: matchedItem.userId,
      user1Name: user1 ? user1.name : `User ${item.userId}`,
      user2Name: user2 ? user2.name : `User ${matchedItem.userId}`,
      itemId: item.id,
      createdAt: new Date().toISOString()
    };
    chats.push(newChat);
  }
  
  // Send real-time notifications via Socket.IO
  const client1SocketId = connectedUsers.get(String(item.userId));
  if (client1SocketId) {
    io.to(client1SocketId).emit('notification', notification1);
  }
  
  const client2SocketId = connectedUsers.get(String(matchedItem.userId));
  if (client2SocketId) {
    io.to(client2SocketId).emit('notification', notification2);
  }
  
  res.json({ item, matchedItem });
});

// Admin-only: Reject matched pair
app.put('/api/admin/items/:id/reject-match/:matchId', authMiddleware, adminMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const matchId = parseInt(req.params.matchId);
  
  const item = items.find(item => item.id === itemId);
  const matchedItem = items.find(item => item.id === matchId);
  
  if (!item || !matchedItem) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  // Track rejected matches separately (don't change matchStatus)
  if (!item.rejectedMatches) item.rejectedMatches = [];
  if (!item.rejectedMatches.includes(matchId)) {
    item.rejectedMatches.push(matchId);
  }
  
  if (!matchedItem.rejectedMatches) matchedItem.rejectedMatches = [];
  if (!matchedItem.rejectedMatches.includes(itemId)) {
    matchedItem.rejectedMatches.push(itemId);
  }
  
  res.json({ item, matchedItem });
});

// Admin-only: Revert matched pair (unapprove both items)
app.put('/api/admin/items/:id/revert-match/:matchId', authMiddleware, adminMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const matchId = parseInt(req.params.matchId);
  
  const item = items.find(item => item.id === itemId);
  const matchedItem = items.find(item => item.id === matchId);
  
  if (!item || !matchedItem) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  // If items are approved and matched, unapprove them
  if (item.matchStatus === 'approved' && item.matchedWith === matchId) {
    item.approved = false;
    item.matchStatus = 'pending';
    delete item.matchedWith;
    delete item.matchedUserId;
    
    matchedItem.approved = false;
    matchedItem.matchStatus = 'pending';
    delete matchedItem.matchedWith;
    delete matchedItem.matchedUserId;
  }
  
  // Remove from rejected matches if present
  if (item.rejectedMatches) {
    item.rejectedMatches = item.rejectedMatches.filter(id => id !== matchId);
  }
  if (matchedItem.rejectedMatches) {
    matchedItem.rejectedMatches = matchedItem.rejectedMatches.filter(id => id !== itemId);
  }
  
  res.json({ item, matchedItem });
});

// Admin-only: Reject/Delete item
app.delete('/api/admin/items/:id', authMiddleware, adminMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(item => item.id === itemId);
  
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  if (item.matchStatus === 'approved') {
    return res.status(400).json({ message: 'Cannot delete matched items. Revert the match first.' });
  }
  
  items = items.filter(item => item.id !== itemId);
  res.status(204).send();
});



// Get chats for current user
app.get('/api/chats', authMiddleware, (req, res) => {
  const userId = String(req.user.id);
  const userChats = chats.filter(chat => 
    chat.user1Id === userId || chat.user2Id === userId
  );
  
  // Use stored usernames directly from chat objects
  const enhancedChats = userChats.map(chat => {
    const isUser1 = chat.user1Id === userId;
    return {
      ...chat,
      otherUserId: isUser1 ? chat.user2Id : chat.user1Id,
      otherUserName: isUser1 ? chat.user2Name : chat.user1Name
    };
  });
  
  res.json(enhancedChats);
});

// Get messages for a specific chat
app.get('/api/chats/:chatId/messages', authMiddleware, (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const userId = String(req.user.id);
  
  // Verify user is part of this chat
  const chat = chats.find(c => c.id === chatId);
  if (!chat || (chat.user1Id !== userId && chat.user2Id !== userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const chatMessages = messages.filter(msg => msg.chatId === chatId);
  res.json(chatMessages);
});

// Send message to a chat
app.post('/api/chats/:chatId/messages', authMiddleware, (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const userId = String(req.user.id);
  const { message } = req.body;
  
  // Verify user is part of this chat
  const chat = chats.find(c => c.id === chatId);
  if (!chat || (chat.user1Id !== userId && chat.user2Id !== userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const newMessage = {
    id: Date.now(),
    chatId,
    senderId: userId,
    message,
    createdAt: new Date().toISOString()
  };
  
  messages.push(newMessage);
  
  // Send real-time message via Socket.IO
  const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
  const otherUserSocketId = connectedUsers.get(otherUserId);
  if (otherUserSocketId) {
    io.to(otherUserSocketId).emit('message', newMessage);
  }
  
  // Create notification for message recipient
  const senderName = req.user.name || 'Someone';
  const messageNotification = {
    id: Date.now() + Math.random(),
    userId: otherUserId,
    message: `New message from ${senderName}`,
    chatId: chatId,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(messageNotification);
  
  // Send notification via Socket.IO
  if (otherUserSocketId) {
    io.to(otherUserSocketId).emit('notification', messageNotification);
  }
  
  res.status(201).json(newMessage);
});

/**
 * User: Get their own items (approved and unapproved)
 * — returns only items that belong to the logged-in user.
 */
app.get('/api/my-items', authMiddleware, (req, res) => {
  const userItems = items.filter(item => String(item.userId) === String(req.user.id));
  console.log('my-items endpoint called for user:', req.user.id, 'found items:', userItems.length);
  res.json(userItems);
});

// User: Update their own unapproved item
app.put('/api/items/:id', authMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(item => item.id === itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (String(item.userId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized to update this item' });
  }

  if (item.approved) {
    return res.status(400).json({ message: 'Cannot update approved items' });
  }

  // Update item — keep id, userId, and keep approved false
  Object.assign(item, req.body, { id: itemId, userId: item.userId, approved: false });
  res.json(item);
});

// User: Delete their own unapproved item (Admin can delete any item)
app.delete('/api/items/:id', authMiddleware, (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(item => item.id === itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Admin can delete any item
  if (req.user.role === 'admin') {
    items = items.filter(item => item.id !== itemId);
    return res.status(204).send();
  }

  // Regular users can only delete their own unapproved items
  if (String(item.userId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized to delete this item' });
  }

  if (item.approved) {
    return res.status(400).json({ message: 'Cannot delete approved items' });
  }

  items = items.filter(item => item.id !== itemId);
  res.status(204).send();
});

// Create new chat
app.post('/api/chats', authMiddleware, (req, res) => {
  const { otherUserId, itemId, otherUserName } = req.body;
  const user1Id = String(req.user.id);
  const user2Id = String(otherUserId);
  
  const existingChat = chats.find(chat => 
    (chat.user1Id === user1Id && chat.user2Id === user2Id) ||
    (chat.user2Id === user1Id && chat.user1Id === user2Id)
  );
  
  if (existingChat) {
    return res.json(existingChat);
  }
  
  const newChat = {
    id: Date.now(),
    user1Id,
    user2Id,
    user1Name: req.user.name || 'User',
    user2Name: otherUserName || 'User',
    itemId,
    createdAt: new Date().toISOString()
  };
  
  chats.push(newChat);
  res.status(201).json(newChat);
});

// Get user notifications
app.get('/api/notifications', authMiddleware, (req, res) => {
  const userNotifications = notifications.filter(n => String(n.userId) === String(req.user.id));
  res.json(userNotifications);
});

// Mark notification as read
app.put('/api/notifications/:id/read', authMiddleware, (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  if (String(notification.userId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  notification.read = true;
  res.json(notification);
});

// Mark all notifications as read
app.put('/api/notifications/mark-all-read', authMiddleware, (req, res) => {
  const userNotifications = notifications.filter(n => String(n.userId) === String(req.user.id));
  userNotifications.forEach(n => n.read = true);
  res.json({ message: 'All notifications marked as read', count: userNotifications.length });
});

// Debug endpoint to inspect items and user data
app.get('/__debug/items', (req, res) => {
  res.json({
    totalItems: items.length,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      userId: item.userId,
      userIdType: typeof item.userId,
      approved: item.approved,
      status: item.status
    }))
  });
});

// Debug endpoint for Socket.IO
app.get('/__debug/sockets', (req, res) => {
  res.json({
    connectedUsers: Array.from(connectedUsers.entries()),
    totalChats: chats.length,
    totalMessages: messages.length,
    chats: chats,
    messages: messages
  });
});

// Simple debug endpoint for chats
app.get('/__debug/chats/:userId', (req, res) => {
  const userId = req.params.userId;
  const userChats = chats.filter(chat => 
    chat.user1Id === userId || chat.user2Id === userId
  );
  res.json({
    userId,
    userChats,
    allChats: chats
  });
});

// Socket.IO connection handling
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('Socket.IO auth attempt with token:', token ? 'present' : 'missing');
  
  if (!token) {
    return next(new Error('Authentication error - no token'));
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    socket.userId = String(decoded.id);
    console.log('Socket.IO auth successful for user:', socket.userId);
    next();
  } catch (err) {
    console.error('Socket.IO auth failed:', err.message);
    next(new Error('Authentication error - invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected via Socket.IO`);
  connectedUsers.set(socket.userId, socket.id);
  console.log('Connected users now:', Array.from(connectedUsers.keys()));
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    connectedUsers.delete(socket.userId);
    console.log('Connected users after disconnect:', Array.from(connectedUsers.keys()));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on:`);
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`  Network: http://<your-ip>:${PORT}`);
  console.log('Socket.IO server ready');
});
