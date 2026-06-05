import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import Message from '../models/Message.js';

const router = express.Router();

// 1. GET /api/profile
router.get('/profile', (req, res) => {
  const birthYear = 2005;
  const currentYear = new Date().getFullYear();
  const presentAge = currentYear - birthYear;

  res.json({
    name: 'Tautik Venkata Siva Sai Penumudi',
    birthYear,
    presentAge,
    homeplace: 'Vijayawada',
    college: 'Prasad V Potluri Siddhartha Institute of Technology',
    interests: [
      {
        name: 'Video Editing',
        description: 'Crafting visually stunning narratives, pacing, and editing engaging content.',
        proof: {
          platform: 'Instagram',
          handle: '@siva.cc_',
          url: 'https://instagram.com/siva.cc_'
        }
      },
      {
        name: 'Story Writing',
        description: 'Developing worlds, screenplays, character-driven narratives, and fiction.',
        proof: {
          platform: 'Twitter / X',
          handle: '@TautikPenumudi',
          url: 'https://twitter.com/TautikPenumudi'
        }
      }
    ],
    languages: ['Java', 'Python', 'C'],
    framework: 'MERN'
  });
});

// Helper for local file fallback
const getLocalMessagesPath = (dataDir) => path.join(dataDir, 'messages.json');

const readLocalMessages = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

const saveLocalMessages = async (filePath, messages) => {
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8');
};

// 2. POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide all fields: name, email, and message.' });
  }

  try {
    if (req.isMongoConnected) {
      // Save to MongoDB
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      return res.status(201).json({
        success: true,
        message: 'Message saved successfully to MongoDB!',
        data: newMessage
      });
    } else {
      // Save to JSON fallback
      const filePath = getLocalMessagesPath(req.dataDir);
      const messages = await readLocalMessages(filePath);
      
      const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };

      messages.unshift(newMessage); // add to beginning
      await saveLocalMessages(filePath, messages);

      return res.status(201).json({
        success: true,
        message: 'Message saved successfully to local file storage!',
        data: newMessage
      });
    }
  } catch (error) {
    console.error('Error handling contact message:', error);
    res.status(500).json({ error: 'Failed to process message. Please try again.' });
  }
});

// 3. GET /api/messages
router.get('/messages', async (req, res) => {
  try {
    if (req.isMongoConnected) {
      // Fetch from MongoDB
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json(messages);
    } else {
      // Fetch from JSON fallback
      const filePath = getLocalMessagesPath(req.dataDir);
      const messages = await readLocalMessages(filePath);
      return res.json(messages);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

export default router;
