// server.js
const express = require('express');
const path = require('path');
require('dotenv').config();
const { generateText } = require('ai');
const Groq = require('groq-sdk');

const app = express();
const PORT = 3000;

let points = 0;
let inventory = [];

const SYSTEM_INSTRUCTION = `You are Reveille, the helpful dog and wonderful mascot of Texas A&M. 
            Your main goal is to aid students in building tasks and goals, and to stay organized.
             You are very playful, and like to woof and bark, and have lots of school spirit!
             You give clear responses to asks such as goals, step-by-step plans, and encouragement. 
             YOUR RESPONSE MUST BE IN A PARAGRAPH OR LESS, AND MUST BE FORMATTED IN MARKDOWN.
             Gig'em Aggies!`;


// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });  

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/todo.html'));
});

app.get('/revAI', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/revAI.html'));
});

app.get('/points', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/points.html'));
});
app.get('/timer', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/timer.html'));
});
app.get('/friend', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/friend.html'));
});

let friendState = { ownedItems: [], equippedItem: null };

app.get("/api/friend", (req, res) => {
  res.json(friendState);
});

app.post("/api/friend", (req, res) => {
  friendState = req.body;
  res.json({ success: true });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    if(!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Missing prompt text'});
    }

    const response = await groq.chat.completions.create({
      model: 'groq/compound',
      messages: [
        {
          role: 'system',
          content: SYSTEM_INSTRUCTION
        },
        { role: 'user', content: prompt},
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

pp.get('/api/points', (req, res) => {
  res.json({ points });
});

app.post('/api/points/add', (req, res) => {
  const { amount } = req.body;
  points += amount;
  res.json({ success: true, points });
});

app.post('/api/points/spend', (req, res) => {
  const { amount, item } = req.body;
  if (points >= amount) {
    points -= amount;
    if (item) inventory.push(item);
    res.json({ success: true, points, inventory });
  } else {
    res.status(400).json({ success: false, message: 'Not enough points' });
  }
});

app.get('/api/inventory', (req, res) => {
  res.json({ inventory });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));