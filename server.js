import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Verify API key exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY environment variable is not set!');
  console.error('   Please set it and restart the server.');
  console.error('   Example: export GEMINI_API_KEY="your-key-here"');
  process.exit(1);
}

console.log('✅ GEMINI_API_KEY is configured (value hidden for security)');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check passed');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    // Validate input
    if (!message) {
      console.log('❌ Request rejected: No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!message.trim()) {
      console.log('❌ Request rejected: Empty message');
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    console.log(`📝 Processing message (${language || 'en'}): "${message.substring(0, 50)}..."`);

    // Create language-aware prompt
    const languageContext = language === 'pa' 
      ? 'Please respond in Roman Punjabi (using English letters to write Punjabi). Keep responses concise and natural.\n\n'
      : 'Please respond in English. Keep responses concise and natural.\n\n';

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate response
    const result = await model.generateContent(languageContext + message);
    const aiResponse = result.response.text();

    console.log(`✅ Response generated successfully (${aiResponse.length} chars)`);

    res.json({
      response: aiResponse,
      language: language || 'en',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error.message);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AI Chatbot Backend Server is RUNNING');
  console.log('='.repeat(60));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint:     POST /api/chat`);
  console.log(`❤️  Health check:     GET /health`);
  console.log('\n💡 IMPORTANT FOR EXPO APP:');
  console.log('   In GitHub Codespaces:');
  console.log('   1. Click the "Ports" tab below');
  console.log('   2. Right-click port 3001');
  console.log('   3. Select "Port Visibility" → "Public"');
  console.log('   4. Copy the forwarded URL (https://...app.github.dev)');
  console.log('   5. Update App.js with: BACKEND_URL = "https://...app.github.dev"');
  console.log('='.repeat(60) + '\n');
});
