const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const WISHES_FILE = path.join(__dirname, 'wishes.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize wishes file if it doesn't exist
async function initializeWishesFile() {
  try {
    await fs.ensureFile(WISHES_FILE);
    const wishesData = await fs.readJson(WISHES_FILE).catch(() => []);
    if (!Array.isArray(wishesData)) {
      await fs.writeJson(WISHES_FILE, []);
    }
  } catch (error) {
    console.error('Error initializing wishes file:', error);
    await fs.writeJson(WISHES_FILE, []);
  }
}

// API Routes

// Get all wishes
app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await fs.readJson(WISHES_FILE).catch(() => []);
    res.json(wishes);
  } catch (error) {
    console.error('Error reading wishes:', error);
    res.status(500).json({ error: 'Failed to read wishes' });
  }
});

// Add a new wish
app.post('/api/wishes', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    
    if (name.trim().length === 0 || message.trim().length === 0) {
      return res.status(400).json({ error: 'Name and message cannot be empty' });
    }
    
    // Read existing wishes
    let wishes = await fs.readJson(WISHES_FILE).catch(() => []);
    if (!Array.isArray(wishes)) {
      wishes = [];
    }
    
    // Create new wish
    const newWish = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email ? email.trim() : '',
      message: message.trim(),
      timestamp: Date.now()
    };
    
    // Add to beginning of array
    wishes.unshift(newWish);
    
    // Keep only latest 50 wishes
    if (wishes.length > 50) {
      wishes = wishes.slice(0, 50);
    }
    
    // Save to file
    await fs.writeJson(WISHES_FILE, wishes, { spaces: 2 });
    
    res.json({ success: true, wish: newWish });
  } catch (error) {
    console.error('Error saving wish:', error);
    res.status(500).json({ error: 'Failed to save wish' });
  }
});

// Delete a wish (optional admin functionality)
app.delete('/api/wishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let wishes = await fs.readJson(WISHES_FILE).catch(() => []);
    if (!Array.isArray(wishes)) {
      wishes = [];
    }
    
    const initialLength = wishes.length;
    wishes = wishes.filter(wish => wish.id !== id);
    
    if (wishes.length === initialLength) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    
    await fs.writeJson(WISHES_FILE, wishes, { spaces: 2 });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting wish:', error);
    res.status(500).json({ error: 'Failed to delete wish' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize and start server
async function startServer() {
  await initializeWishesFile();
  
  app.listen(PORT, () => {
    console.log(`🎉 Wedding server running on http://localhost:${PORT}`);
    console.log(`💝 Wishes API available at /api/wishes`);
    console.log(`📁 Static files served from current directory`);
  });
}

startServer().catch(console.error);
