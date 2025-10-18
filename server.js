// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');

dotenv.config();

const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/todo.html'));
});

app.get('/revAI', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/ai-helper.html'));
});

app.get('/points', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/points.html'));
});

app.post('/api/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = groq('llama-3.1-8b-instant');

        const result = await generateText({
            model,
            prompt,
            providerOptions: { groq: { apiKey: process.env.GROQ_API_KEY}}
        });

        res.json({ response: result.text });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Failed to generate text' });
    }
    });

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
