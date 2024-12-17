const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();


const app = express();

// Updated CORS configuration
app.use(cors({
  origin: [
    'https://nanniestest2.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dubainannies.vercel.app',
    'https://server-1prf.onrender.com',
    'https://ejbiorpholetwkprfrfj.supabase.co'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add CORS headers middleware
app.use((req, res, next) => {
  console.log('=== CORS HEADER MIDDLEWARE ===');
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

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
console.log('=== SUPABASE INIT ===');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
console.log('Supabase client created:', supabase);

// Configure multer for temporary file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('=== MULTER FILE FILTER ===');
    console.log('Incoming file:', file.originalname, 'MIME:', file.mimetype);
    if (file.fieldname === 'cv') {
      if (!Object.keys(mimeTypeToEnum).includes(file.mimetype)) {
        console.error('File rejected: not a PDF or Word doc.');
        return cb(new Error('Only PDF and Word documents are allowed!'), false);
      }
    } else if (file.fieldname === 'profilePic') {
      if (!allowedImageTypes.includes(file.mimetype)) {
        console.error('File rejected: not an allowed image type.');
        return cb(new Error('Only JPEG, PNG, WebP, and HEIC images are allowed!'), false);
      }
    }
    console.log('File accepted:', file.originalname);
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Add this with your other helper functions
const axios = require('axios'); // Make sure to add this at the top of your file

async function verifyCaptcha(token) {
  console.log('=== VERIFY CAPTCHA ===');
  console.log('Verifying token:', token);
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token
      }
    });
    console.log('CAPTCHA verification response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
}

// Helper function for file upload
async function uploadFileToSupabase(file, bucket, folder) {
  console.log('=== UPLOAD FILE TO SUPABASE ===');
  console.log('Bucket:', bucket, 'Folder:', folder);
  console.log('File details:', file.originalname, 'Size:', file.size);
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}${fileExt}`;
  const filePath = `${folder}/${fileName}`;
  console.log('Computed filePath:', filePath);

  const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

  console.log('File uploaded successfully. Public URL:', publicUrl);
  return { filePath, publicUrl };
}

// Helper function to delete file from Supabase storage
async function deleteFileFromSupabase(filePath, bucket) {
  console.log('=== DELETE FILE FROM SUPABASE ===');
  console.log('filePath:', filePath, 'bucket:', bucket);
  if (!filePath) {
    console.log('No filePath provided, skipping delete.');
    return;
  }

  try {
    const pathSegments = filePath.split('/').slice(-2).join('/');
    console.log('Computed path for delete:', pathSegments);
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([pathSegments]);
    if (error) {
      console.error('Error deleting file:', error);
    } else {
      console.log('File deleted successfully from storage.');
    }
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
  }
}

// Helper function to parse JSON safely
function safeJSONParse(str, fallback = null) {
  console.log('=== SAFE JSON PARSE ===');
  console.log('Input:', str);
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
  console.log('=== GET /api/nannies ===');
  try {
    const { data, error } = await supabase
        .from('nannies')
        .select('*');
    console.log('Query result:', data);
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/nannies', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 }
]), async (req, res) => {
  console.log('=== POST /api/nannies ===');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);

  try {
    // Verify CAPTCHA
    const captchaToken = req.body.captchaToken;
    if (!captchaToken) {
      console.error('No CAPTCHA token provided');
      return res.status(400).json({ error: 'CAPTCHA verification required' });
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      console.error('CAPTCHA verification failed');
      return res.status(400).json({ error: 'CAPTCHA verification failed' });
    }

    // Check for existing phone number
    const { data: existingNanny } = await supabase
        .from('nannies')
        .select('phone')
        .eq('phone', req.body.phone)
        .single();

    if (existingNanny) {
      console.log('Phone number already exists:', req.body.phone);
      return res.status(409).json({
        error: 'A profile with this phone number already exists'
      });
    }

    const nannyData = {
      name: req.body.name,
      location: req.body.location,
      nationality: req.body.nationality,
      experience: parseInt(req.body.experience, 10),
      languages: safeJSONParse(req.body.languages, []),
      rate: parseFloat(req.body.rate),
      email: req.body.email,
      phone: req.body.phone,
      visa_status: req.body.visa_status,
      age: parseInt(req.body.age, 10),
      accommodation_preference: req.body.accommodation_preference,
      can_travel: req.body.can_travel === 'true',
      education: req.body.education,
      special_skills: safeJSONParse(req.body.specialSkills, []),
      working_hours: safeJSONParse(req.body.workingHours, { start: '', end: '' }),
      working_days: safeJSONParse(req.body.workingDays, [])
    };

    console.log('Parsed nannyData:', nannyData);

    const requiredFields = [
      'name', 'location', 'nationality', 'experience',
      'rate', 'email', 'phone', 'visa_status', 'age',
      'education', 'accommodation_preference'
    ];

    const missingFields = requiredFields.filter(field => !nannyData[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (req.files?.profilePic?.[0]) {
      console.log('Uploading profilePic...');
      const { publicUrl } = await uploadFileToSupabase(
          req.files.profilePic[0],
          'nanny-profile-images',
          'profiles'
      );
      nannyData.profile_image_url = publicUrl;
      console.log('profile_image_url set:', publicUrl);
    }

    if (req.files?.cv?.[0]) {
      console.log('Uploading CV...');
      const { publicUrl } = await uploadFileToSupabase(
          req.files.cv[0],
          'nanny-documents',
          'cvs'
      );
      nannyData.cv_url = publicUrl;
      nannyData.cv_file_type = mimeTypeToEnum[req.files.cv[0].mimetype];
      console.log('CV uploaded, url:', publicUrl, 'type:', nannyData.cv_file_type);
    }

    console.log('Inserting nanny data into DB...');
    const { data, error } = await supabase
        .from('nannies')
        .insert([nannyData])
        .select();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    console.log('Insert successful, response data:', data);
    res.status(201).json(data);

  } catch (error) {
    console.error('Error creating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/auth/callback', async (req, res) => {
  console.log('=== GET /auth/callback ===');
  console.log('Query params:', req.query);
  const { code } = req.query;

  if (!code) {
    console.error('No code provided');
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    console.log('Exchanging code for session:', code);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('exchangeCodeForSession error:', error);
      throw error;
    }
    console.log('Session exchange successful:', data);
    res.redirect('/register-nanny');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/api/nannies/profile', async (req, res) => {
  console.log('=== GET /api/nannies/profile ===');
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);

  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.query.user_id;

  console.log('Received Token:', token);
  console.log('Received user_id:', userId);

  if (!userId) {
    console.error('user_id missing');
    return res.status(400).json({ error: 'user_id is missing in the request.' });
  }

  if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
    console.error('Invalid UUID format:', userId);
    return res.status(400).json({ error: `Invalid UUID format: ${userId}` });
  }

  const supabaseServer = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('Fetching user with token...');
  try {
    const { data: userData, error: userError } = await supabaseServer.auth.getUser(token);
    console.log('getUser result:', userData, 'error:', userError);

    if (userError || !userData?.user) {
      console.error('Error fetching user from token:', userError);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = userData.user;
    console.log('Fetched user:', user);

    console.log('Fetching nanny profile for user_id:', userId);
    const { data: nannyData, error: profileError } = await supabaseServer
        .from('nannies')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

    console.log('Nanny data result:', nannyData, 'error:', profileError);
    if (profileError) {
      console.error('Supabase Error:', profileError.message);
      return res.status(500).json({ error: 'Failed to fetch profile from database.' });
    }

    if (nannyData && nannyData.length > 0) {
      console.log('Nanny profile found:', nannyData[0]);
      return res.status(200).json(nannyData[0]);
    }

    console.log('No nanny profile found, returning default profile');
    const defaultProfile = {
      name: user.user_metadata?.name || '',
      email: user.email || '',
      phone: user.user_metadata?.phone || '',
      rate: '',
      status: 'not_hired',
      location: ''
    };

    res.status(200).json(defaultProfile);

  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/nannies/:id', async (req, res) => {
  console.log('=== GET /api/nannies/:id ===');
  console.log('Param id:', req.params.id);
  try {
    const { data, error } = await supabase
        .from('nannies')
        .select('*')
        .eq('id', req.params.id)
        .single();

    console.log('Query result:', data, 'error:', error);
    if (error) throw error;
    if (!data) {
      console.error('Nanny not found');
      return res.status(404).json({ error: 'Nanny not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching nanny:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/nannies/profile', async (req, res) => {
  console.log('=== PUT /api/nannies/profile ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  const token = req.headers.authorization?.split(' ')[1];
  const { user_id, ...profileData } = req.body;
  console.log('Extracted user_id:', user_id, 'profileData:', profileData);

  try {
    const { data: nannyRecord } = await supabase
        .from('nannies')
        .select('id')
        .eq('user_id', user_id)
        .single();
    console.log('Existing nanny record:', nannyRecord);

    if (!nannyRecord) {
      console.error('Nanny record not found');
      return res.status(404).json({ error: 'Nanny record not found' });
    }

    console.log('Updating nanny profile with id:', nannyRecord.id);
    const { data, error } = await supabase
        .from('nannies')
        .update(profileData)
        .eq('id', nannyRecord.id)
        .select();

    console.log('Update result:', data, 'error:', error);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating nanny profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update nanny profile
app.put('/api/nannies/:id', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 }
]), async (req, res) => {
  console.log('=== PUT /api/nannies/:id ===');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('Files:', req.files);

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

    console.log('Initial updateData:', updateData);

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        console.log(`Deleting undefined key: ${key}`);
        delete updateData[key];
      }
    });

    console.log('Cleaned updateData:', updateData);

    const { data: existingNanny } = await supabase
        .from('nannies')
        .select('*')
        .eq('id', id)
        .single();

    console.log('existingNanny:', existingNanny);
    if (!existingNanny) {
      console.error('Nanny not found with id:', id);
      return res.status(404).json({ error: 'Nanny not found' });
    }

    if (req.files?.profilePic?.[0]) {
      console.log('Profile pic update detected.');
      if (existingNanny.profile_image_url) {
        console.log('Deleting old profile image...');
        await deleteFileFromSupabase(existingNanny.profile_image_url, 'nanny-profile-images');
      }

      console.log('Uploading new profile image...');
      const { publicUrl } = await uploadFileToSupabase(
          req.files.profilePic[0],
          'nanny-profile-images',
          'profiles'
      );
      updateData.profile_image_url = publicUrl;
      console.log('New profile_image_url:', publicUrl);
    }

    if (req.files?.cv?.[0]) {
      console.log('CV update detected.');
      if (existingNanny.cv_url) {
        console.log('Deleting old CV...');
        await deleteFileFromSupabase(existingNanny.cv_url, 'nanny-documents');
      }

      console.log('Uploading new CV...');
      const { publicUrl } = await uploadFileToSupabase(
          req.files.cv[0],
          'nanny-documents',
          'cvs'
      );
      updateData.cv_url = publicUrl;
      updateData.cv_file_type = mimeTypeToEnum[req.files.cv[0].mimetype];
      console.log('New cv_url:', publicUrl, 'cv_file_type:', updateData.cv_file_type);
    }

    console.log('Updating nanny with id:', id);
    const { data, error } = await supabase
        .from('nannies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    console.log('Update result:', data, 'error:', error);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete nanny profile
app.delete('/api/nannies/:id', async (req, res) => {
  console.log('=== DELETE /api/nannies/:id ===');
  console.log('Param id:', req.params.id);
  try {
    const { id } = req.params;

    console.log('Fetching nanny before deletion...');
    const { data: nanny } = await supabase
        .from('nannies')
        .select('cv_url, profile_image_url')
        .eq('id', id)
        .single();

    console.log('Nanny to delete:', nanny);
    if (nanny) {
      if (nanny.cv_url) {
        console.log('Deleting nanny CV...');
        await deleteFileFromSupabase(nanny.cv_url, 'nanny-documents');
      }
      if (nanny.profile_image_url) {
        console.log('Deleting nanny profile_image...');
        await deleteFileFromSupabase(nanny.profile_image_url, 'nanny-profile-images');
      }
    }

    console.log('Deleting nanny record...');
    const { error } = await supabase
        .from('nannies')
        .delete()
        .eq('id', id);

    if (error) {
      console.error('Error deleting from DB:', error);
      throw error;
    }

    console.log('Nanny deleted successfully.');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Search nannies
app.get('/api/nannies/search', async (req, res) => {
  console.log('=== GET /api/nannies/search ===');
  console.log('Query:', req.query);
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
      console.log('Applying location filter:', location);
      query = query.ilike('location', `%${location}%`);
    }

    if (nationality) {
      console.log('Applying nationality filter:', nationality);
      query = query.eq('nationality', nationality);
    }

    if (accommodation_preference) {
      console.log('Applying accommodation_preference filter:', accommodation_preference);
      query = query.eq('accommodation_preference', accommodation_preference);
    }

    if (languages) {
      console.log('Applying languages filter:', languages);
      const searchLanguages = languages.split(',').map(lang => lang.trim());
      query = query.contains('languages', searchLanguages);
    }

    if (minRate) {
      console.log('Applying minRate filter:', minRate);
      query = query.gte('rate', parseInt(minRate));
    }

    if (maxRate) {
      console.log('Applying maxRate filter:', maxRate);
      query = query.lte('rate', parseInt(maxRate));
    }

    if (experience) {
      console.log('Applying experience filter:', experience);
      query = query.gte('experience', parseInt(experience));
    }

    const { data, error } = await query;
    console.log('Search result:', data, 'error:', error);
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error searching nannies:', error);
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('=== GET /health ===');
  const statusObj = { status: 'OK', timestamp: new Date().toISOString() };
  console.log('Health check:', statusObj);
  res.json(statusObj);
});

// Error handler for undefined routes
app.use((req, res) => {
  console.error('404 - Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
