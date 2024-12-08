const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true
}));

// MIME type mappings
const mimeTypeToEnum = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Configure multer for temporary file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'cv') {
      if (!Object.keys(mimeTypeToEnum).includes(file.mimetype)) {
        return cb(new Error('Only PDF and Word documents are allowed!'), false);
      }
    } else if (file.fieldname === 'profilePic') {
      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPEG, PNG, WebP, and HEIC images are allowed!'), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function for file upload
async function uploadFileToSupabase(file, bucket, folder) {
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

  return { filePath, publicUrl };
}

// Helper function to delete file from Supabase storage
async function deleteFileFromSupabase(filePath, bucket) {
  if (!filePath) return;

  try {
    const path = filePath.split('/').slice(-2).join('/');
    await supabase.storage
        .from(bucket)
        .remove([path]);
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
  }
}

// Helper function to parse JSON safely
function safeJSONParse(str, fallback = null) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

// Routes
// Get all nannies
app.get('/api/nannies', async (req, res) => {
  try {
    const { data, error } = await supabase
        .from('nannies')
        .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific nanny
app.get('/api/nannies/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
        .from('nannies')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Nanny not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching nanny:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new nanny profile
app.post('/api/nannies', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 }
]), async (req, res) => {
  try {
    // Parse and transform form data
    const nannyData = {
      name: req.body.name,
      location: req.body.location,
      nationality: req.body.nationality,
      experience: parseInt(req.body.experience),
      languages: safeJSONParse(req.body.languages, []),
      rate: parseFloat(req.body.rate),
      email: req.body.email,
      phone: req.body.phone,
      visa_status: req.body.visa_status,
      age: parseInt(req.body.age),
      accommodation_preference: req.body.accommodation_preference,
      can_travel: req.body.can_travel === 'true',
      education: req.body.education,
      special_skills: safeJSONParse(req.body.specialSkills, []),
      working_hours: safeJSONParse(req.body.workingHours, { start: '', end: '' }),
      working_days: safeJSONParse(req.body.workingDays, []),
      introduction: req.body.introduction
    };

    // Validate required fields
    const requiredFields = [
      'name', 'location', 'nationality', 'experience',
      'rate', 'email', 'phone', 'visa_status', 'age',
      'education', 'accommodation_preference'
    ];

    const missingFields = requiredFields.filter(field => !nannyData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Upload profile image if provided
    if (req.files?.profilePic?.[0]) {
      const { publicUrl } = await uploadFileToSupabase(
          req.files.profilePic[0],
          'nanny-profile-images',
          'profiles'
      );
      nannyData.profile_image_url = publicUrl;
    }

    // Upload CV if provided
    if (req.files?.cv?.[0]) {
      const { publicUrl } = await uploadFileToSupabase(
          req.files.cv[0],
          'nanny-documents',
          'cvs'
      );
      nannyData.cv_url = publicUrl;
      nannyData.cv_file_type = mimeTypeToEnum[req.files.cv[0].mimetype];
    }

    // Insert nanny data into database
    const { data, error } = await supabase
        .from('nannies')
        .insert([nannyData])
        .select()
        .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update nanny profile
app.put('/api/nannies/:id', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = {
      ...req.body,
      languages: safeJSONParse(req.body.languages, undefined),
      special_skills: safeJSONParse(req.body.specialSkills, undefined),
      working_hours: safeJSONParse(req.body.workingHours, undefined),
      working_days: safeJSONParse(req.body.workingDays, undefined),
      can_travel: req.body.can_travel === 'true'
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    // Get existing nanny data
    const { data: existingNanny } = await supabase
        .from('nannies')
        .select('*')
        .eq('id', id)
        .single();

    if (!existingNanny) {
      return res.status(404).json({ error: 'Nanny not found' });
    }

    // Handle profile image update
    if (req.files?.profilePic?.[0]) {
      if (existingNanny.profile_image_url) {
        await deleteFileFromSupabase(existingNanny.profile_image_url, 'nanny-profile-images');
      }

      const { publicUrl } = await uploadFileToSupabase(
          req.files.profilePic[0],
          'nanny-profile-images',
          'profiles'
      );
      updateData.profile_image_url = publicUrl;
    }

    // Handle CV update
    if (req.files?.cv?.[0]) {
      if (existingNanny.cv_url) {
        await deleteFileFromSupabase(existingNanny.cv_url, 'nanny-documents');
      }

      const { publicUrl } = await uploadFileToSupabase(
          req.files.cv[0],
          'nanny-documents',
          'cvs'
      );
      updateData.cv_url = publicUrl;
      updateData.cv_file_type = mimeTypeToEnum[req.files.cv[0].mimetype];
    }

    // Update nanny data
    const { data, error } = await supabase
        .from('nannies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete nanny profile
app.delete('/api/nannies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get nanny data before deletion
    const { data: nanny } = await supabase
        .from('nannies')
        .select('cv_url, profile_image_url')
        .eq('id', id)
        .single();

    if (nanny) {
      // Delete CV file if exists
      if (nanny.cv_url) {
        await deleteFileFromSupabase(nanny.cv_url, 'nanny-documents');
      }

      // Delete profile image if exists
      if (nanny.profile_image_url) {
        await deleteFileFromSupabase(nanny.profile_image_url, 'nanny-profile-images');
      }
    }

    // Delete nanny record
    const { error } = await supabase
        .from('nannies')
        .delete()
        .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Search nannies
app.get('/api/nannies/search', async (req, res) => {
  try {
    const {
      location,
      languages,
      minRate,
      maxRate,
      experience,
      nationality,
      accommodation_preference
    } = req.query;

    let query = supabase
        .from('nannies')
        .select('*');

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (nationality) {
      query = query.eq('nationality', nationality);
    }

    if (accommodation_preference) {
      query = query.eq('accommodation_preference', accommodation_preference);
    }

    if (languages) {
      const searchLanguages = languages.split(',').map(lang => lang.trim());
      query = query.contains('languages', searchLanguages);
    }

    if (minRate) {
      query = query.gte('rate', parseInt(minRate));
    }

    if (maxRate) {
      query = query.lte('rate', parseInt(maxRate));
    }

    if (experience) {
      query = query.gte('experience', parseInt(experience));
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error searching nannies:', error);
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});