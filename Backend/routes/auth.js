import express from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key-change-in-production';

// Register
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role || 'user'
  };
  
  users.push(newUser);
  
  const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, JWT_SECRET);
  
  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET);
  
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
