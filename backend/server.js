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
    
    // Check if API key is provided and not a placeholder
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('fake')) {
       // High-quality mock response for demo
       let mockResponse = "HemoLink AI: Based on medical protocols, blood donation requires a 56-day wait between whole blood donations. Donors must be 18+ and weigh over 50kg. How else can I assist you with your logistics query?";
       if (message.toLowerCase().includes('o-')) mockResponse = "O- is the universal donor type and is critical for emergency trauma cases. It can be given to patients of any blood type.";
       if (message.toLowerCase().includes('inventory')) mockResponse = "You can update your hospital's stock by clicking the 'MANAGE INVENTORY' button on the dashboard.";
       return res.json({ content: mockResponse });
    }

    // Debug: Check if key is loaded (Safe: only prints first 4 chars)
    if (process.env.GEMINI_API_KEY) {
      console.log(`Using Gemini Key starting with: ${process.env.GEMINI_API_KEY.substring(0, 4)}...`);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are HemoLink AI, a helpful medical assistant for a blood logistics platform. 
    A user asks: "${message}". 
    Provide a concise, professional answer (max 3 sentences) about blood donation, blood types, or how to use HemoLink.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ content: response.text() });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.json({ content: "I'm currently in high-security offline mode. O- blood is the universal donor, and A+ is the most common. How can I help with your specific request?" });
  }
});

// Public Inventory Update (for Demo)
app.post('/api/hospitals/update-inventory-public', async (req, res) => {
  try {
    const { inventory } = req.body;
    const Hospital = require('./models/Hospital');
    // For demo, we just update the first hospital in the DB
    const hospital = await Hospital.findOne();
    if (!hospital) return res.status(404).json({ error: 'No hospital found to update.' });
    
    hospital.inventory = inventory;
    await hospital.save();
    res.json({ message: 'Inventory synced successfully!', inventory: hospital.inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
