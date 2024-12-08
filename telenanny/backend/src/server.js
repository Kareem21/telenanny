const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Create a sanitized filename with timestamp
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `${Date.now()}-${fileName}`)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// In-memory storage (replace with database in production)
let nannies = [];
let employers = [];

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size is too large. Max limit is 5MB' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
// Get all nannies
app.get('/api/nannies', (req, res) => {
  res.json(nannies);
});

// Get specific nanny
app.get('/api/nannies/:id', (req, res) => {
  const nanny = nannies.find(n => n.id === req.params.id);
  if (!nanny) {
    return res.status(404).json({ error: 'Nanny not found' });
  }
  res.json(nanny);
});

// Create new nanny profile
app.post('/api/nannies', upload.single('cv'), (req, res) => {
  try {
    const nannyData = {
      id: Date.now().toString(),
      ...req.body,
      languages: typeof req.body.languages === 'string' ?
          JSON.parse(req.body.languages) : req.body.languages,
      cvPath: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    const requiredFields = ['name', 'location', 'experience', 'rate', 'email'];
    const missingFields = requiredFields.filter(field => !nannyData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    nannies.push(nannyData);
    res.status(201).json(nannyData);
  } catch (error) {
    console.error('Error creating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update nanny profile
app.put('/api/nannies/:id', upload.single('cv'), (req, res) => {
  try {
    const { id } = req.params;
    const nannyIndex = nannies.findIndex(n => n.id === id);

    if (nannyIndex === -1) {
      return res.status(404).json({ error: 'Nanny not found' });
    }

    const updatedNanny = {
      ...nannies[nannyIndex],
      ...req.body,
      languages: typeof req.body.languages === 'string' ?
          JSON.parse(req.body.languages) : req.body.languages,
      updatedAt: new Date().toISOString()
    };

    if (req.file) {
      // Delete old CV if exists
      if (nannies[nannyIndex].cvPath) {
        const oldFilePath = path.join(__dirname, '..', nannies[nannyIndex].cvPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedNanny.cvPath = `/uploads/${req.file.filename}`;
    }

    nannies[nannyIndex] = updatedNanny;
    res.json(updatedNanny);
  } catch (error) {
    console.error('Error updating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete nanny profile
app.delete('/api/nannies/:id', (req, res) => {
  const { id } = req.params;
  const nannyIndex = nannies.findIndex(n => n.id === id);

  if (nannyIndex === -1) {
    return res.status(404).json({ error: 'Nanny not found' });
  }

  // Delete CV file if exists
  if (nannies[nannyIndex].cvPath) {
    const filePath = path.join(__dirname, '..', nannies[nannyIndex].cvPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  nannies = nannies.filter(n => n.id !== id);
  res.status(204).send();
});

// Search nannies
app.get('/api/nannies/search', (req, res) => {
  let filteredNannies = [...nannies];
  const {
    location,
    languages,
    minRate,
    maxRate,
    experience
  } = req.query;

  if (location) {
    filteredNannies = filteredNannies.filter(nanny =>
        nanny.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (languages) {
    const searchLanguages = languages.toLowerCase().split(',');
    filteredNannies = filteredNannies.filter(nanny =>
        searchLanguages.every(lang =>
            nanny.languages.some(nannyLang =>
                nannyLang.toLowerCase().includes(lang.trim())
            )
        )
    );
  }

  if (minRate) {
    filteredNannies = filteredNannies.filter(nanny =>
        parseInt(nanny.rate) >= parseInt(minRate)
    );
  }

  if (maxRate) {
    filteredNannies = filteredNannies.filter(nanny =>
        parseInt(nanny.rate) <= parseInt(maxRate)
    );
  }

  if (experience) {
    filteredNannies = filteredNannies.filter(nanny =>
        parseInt(nanny.experience) >= parseInt(experience)
    );
  }

  res.json(filteredNannies);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Cleanup uploaded files on server shutdown
process.on('SIGINT', () => {
  console.log('Cleaning up uploaded files...');
  if (fs.existsSync(uploadDir)) {
    fs.rmSync(uploadDir, { recursive: true, force: true });
  }
  process.exit();
});