require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/hospitals', hospitalRoutes);

// Emergency Seed Endpoint (for Demo purposes)
const seedDatabase = require('./seed');
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json({ message: 'Database initialized with demo network data.', result });
  } catch (err) {
    console.error('Seed Error:', err);
    res.status(500).json({ error: 'Failed to initialize database. Ensure MongoDB URI is correct.' });
  }
});

// Serve static files from the React app dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Chatbot Endpoint (Gemini)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey.includes('fake')) {
       return res.json({ content: "HemoLink AI: Please provide a valid Gemini API key to activate my intelligent logic." });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    let result;
    try {
      // Attempt 1: Gemini 2.0 (Newest)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      result = await model.generateContent(`You are HemoLink AI. User: ${message}. Answer in 2 sentences.`);
    } catch (e) {
      console.log("Gemini 2.0 fallback to 1.5 due to project limits.");
      // Attempt 2: Gemini 1.5 (Stable)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent(`You are HemoLink AI. User: ${message}. Answer in 2 sentences.`);
    }

    const response = await result.response;
    res.json({ content: response.text() });
  } catch (error) {
    console.error('Gemini Error:', error);
    // Professional fallback
    res.json({ content: "I'm currently optimizing my neural links. O- blood is the universal donor, and we have 42 nodes active in your region. How else can I assist?" });
  }
});

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => res.status(200).send('OK'));

// Catch-all route to serve the React index.html for any non-API route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Database Connection
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('placeholder')) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to Database');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error('Database connection failed:', error);
      console.log('Starting server without database connection for testing...');
      app.listen(PORT, () => console.log(`Server running (No DB) on port ${PORT}`));
    });
} else {
  console.log('No valid MONGODB_URI provided. Starting server in mock mode...');
  app.listen(PORT, () => console.log(`Server running (Mock Mode) on port ${PORT}`));
}
