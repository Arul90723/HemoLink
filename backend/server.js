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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSy_fake_key');

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('fake')) {
       return res.json({ content: "HemoLink AI: Please provide a valid Gemini API key to activate my intelligent logic." });
    }

    const prompt = `You are HemoLink AI, a medical logistics assistant. User: ${message}. Answer in 2 sentences.`;

    // Dynamic Failover System: Try multiple models if one is overloaded
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const listData = await listRes.json();
    
    const candidates = listData.models
      ?.filter(m => m.supportedGenerationMethods.includes('generateContent'))
      ?.map(m => m.name) || ['models/gemini-1.5-flash', 'models/gemini-pro', 'models/gemini-1.5-flash-8b'];

    let lastError = null;
    // Try top 3 available models
    for (const modelName of candidates.slice(0, 3)) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const aiText = data.candidates[0].content.parts[0].text;
        return res.json({ content: aiText });
      } catch (err) {
        lastError = err;
        console.log(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('Gemini Final Error:', error);
    res.json({ content: `HemoLink AI: I am currently in high-security coordination mode due to heavy network demand. O- is the universal donor. How else can I assist?` });
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
