import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = join(__dirname, 'data');
const CHAIRS_FILE = join(DATA_DIR, 'chairs-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists and initialize with existing data
async function initDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Check if chairs-data.json exists
    try {
      await fs.access(CHAIRS_FILE);
    } catch {
      // File doesn't exist, import from county-chairs.js
      try {
        const countyChairsPath = join(__dirname, 'src', 'data', 'county-chairs.js');
        const content = await fs.readFile(countyChairsPath, 'utf-8');

        // Extract the array from the export - more robust regex
        const match = content.match(/export const countyChairs = (\[[\s\S]*?\n\]);/);
        if (match) {
          let chairsData = match[1];
          // Clean up the data for JSON parsing
          chairsData = chairsData
            .replace(/\/\/.*$/gm, '') // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/,\s*\n\s*\]/g, '\n]') // Fix trailing commas
            .replace(/,\s*\n\s*\}/g, '\n}') // Fix trailing commas in objects
            .replace(/'/g, '"'); // Replace single quotes with double quotes

          const chairs = JSON.parse(chairsData);
          await fs.writeFile(CHAIRS_FILE, JSON.stringify(chairs, null, 2));
          console.log(`Initialized chairs-data.json with ${chairs.length} records`);
        } else {
          // Start with empty array
          await fs.writeFile(CHAIRS_FILE, JSON.stringify([], null, 2));
          console.log('Created empty chairs-data.json');
        }
      } catch (importError) {
        console.log('Could not import existing data, starting with empty file');
        await fs.writeFile(CHAIRS_FILE, JSON.stringify([], null, 2));
      }
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

// Helper functions
async function readChairs() {
  try {
    const data = await fs.readFile(CHAIRS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeChairs(chairs) {
  await fs.writeFile(CHAIRS_FILE, JSON.stringify(chairs, null, 2));
}

// Generate ID for a new chair
function generateChairId(stateCode, county) {
  const countyNormalized = county.toLowerCase()
    .replace(/ county| parish| borough| city/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${stateCode}-${countyNormalized}`;
}

// API Routes

// GET all chairs
app.get('/api/chairs', async (req, res) => {
  try {
    const chairs = await readChairs();
    res.json(chairs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read chairs data' });
  }
});

// GET single chair by ID
app.get('/api/chairs/:id', async (req, res) => {
  try {
    const chairs = await readChairs();
    const chair = chairs.find(c => c.id === req.params.id);
    if (!chair) {
      return res.status(404).json({ error: 'Chair not found' });
    }
    res.json(chair);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read chair data' });
  }
});

// POST create new chair
app.post('/api/chairs', async (req, res) => {
  try {
    const chairs = await readChairs();

    const newChair = {
      id: generateChairId(req.body.stateCode, req.body.county),
      ...req.body,
      lastVerified: req.body.lastVerified || new Date().toISOString().split('T')[0],
    };

    // Check if chair with this ID already exists
    const existingIndex = chairs.findIndex(c => c.id === newChair.id);
    if (existingIndex >= 0) {
      return res.status(409).json({ error: 'Chair for this county already exists', id: newChair.id });
    }

    chairs.push(newChair);
    await writeChairs(chairs);

    res.status(201).json(newChair);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chair' });
  }
});

// PUT update chair
app.put('/api/chairs/:id', async (req, res) => {
  try {
    const chairs = await readChairs();
    const index = chairs.findIndex(c => c.id === req.params.id);

    if (index < 0) {
      return res.status(404).json({ error: 'Chair not found' });
    }

    // Preserve ID and update other fields
    chairs[index] = {
      ...chairs[index],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
    };

    await writeChairs(chairs);
    res.json(chairs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chair' });
  }
});

// DELETE chair
app.delete('/api/chairs/:id', async (req, res) => {
  try {
    const chairs = await readChairs();
    const index = chairs.findIndex(c => c.id === req.params.id);

    if (index < 0) {
      return res.status(404).json({ error: 'Chair not found' });
    }

    chairs.splice(index, 1);
    await writeChairs(chairs);

    res.json({ message: 'Chair deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chair' });
  }
});

// GET states summary
app.get('/api/states', async (req, res) => {
  try {
    const chairs = await readChairs();

    const statesMap = new Map();
    chairs.forEach(chair => {
      if (!statesMap.has(chair.stateCode)) {
        statesMap.set(chair.stateCode, {
          stateCode: chair.stateCode,
          state: chair.state,
          total: 0,
          withChair: 0,
          withEmail: 0,
          withPhone: 0,
        });
      }
      const stateData = statesMap.get(chair.stateCode);
      stateData.total++;
      if (chair.chairName && chair.chairName !== 'TBD' && chair.chairName !== 'VACANT') {
        stateData.withChair++;
      }
      if (chair.email) stateData.withEmail++;
      if (chair.phone) stateData.withPhone++;
    });

    res.json(Array.from(statesMap.values()).sort((a, b) => a.stateCode.localeCompare(b.stateCode)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get states data' });
  }
});

// Export endpoint - download as JSON
app.get('/api/export', async (req, res) => {
  try {
    const chairs = await readChairs();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="county-chairs.json"');
    res.json(chairs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available:`);
    console.log(`  GET    /api/chairs - Get all chairs`);
    console.log(`  GET    /api/chairs/:id - Get single chair`);
    console.log(`  POST   /api/chairs - Create new chair`);
    console.log(`  PUT    /api/chairs/:id - Update chair`);
    console.log(`  DELETE /api/chairs/:id - Delete chair`);
    console.log(`  GET    /api/states - Get states summary`);
    console.log(`  GET    /api/export - Export data as JSON`);
  });
});
