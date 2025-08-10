const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const User = require('./models/User');
const Job = require('./models/Job');
const Customer = require('./models/Customer');
const emailRoutes = require('./routes/email');



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Utility: Generate next job reference number (async)
const generateNextJobRef = async () => {
  const PREFIX = 'IDSJBN';
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const currentPrefix = `${PREFIX}-${mm}-${yy}`;

  const lastJob = await Job.findOne({ jobRef: { $regex: `^${currentPrefix}` } })
    .sort({ createdDate: -1, jobRef: -1 })
    .exec();

  let nextNumber = '001';
  if (lastJob && lastJob.jobRef) {
    const match = lastJob.jobRef.match(/-(\d{3})$/);
    if (match) {
      const lastNum = parseInt(match[1], 10);
      nextNumber = String(lastNum + 1).padStart(3, '0');
    }
  }

  return `${currentPrefix}-${nextNumber}`;
};

// ------------------- Routes -------------------

// Use email routes
app.use('/api/email', emailRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// Get all users (excluding passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      email: user.email,
      type: user.type,
      username: user.username,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, confirmPassword, type } = req.body;

  if (!name || !email || !password || !confirmPassword || !type)
    return res.status(400).json({ message: 'All fields are required' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: 'User already exists' });

    const newUser = new User({
      username: name,
      email,
      password,
      type,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Get next job reference number
app.get('/api/jobs/nextRef', async (req, res) => {
  try {
    const nextJobRef = await generateNextJobRef();
    res.json({ nextJobRef });
  } catch (err) {
    console.error('Error generating next job ref:', err);
    res.status(500).json({ message: 'Error generating next job reference' });
  }
});

// Submit job (no photos)
app.post('/api/jobs', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone } = req.body;

    let customer = await Customer.findOne({
      $or: [{ email: customerEmail }, { phone: customerPhone }],
    });

    if (!customer) {
      customer = new Customer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      });
      await customer.save();
    }

    // Ensure jobRef is set
    if (!req.body.jobRef) {
      req.body.jobRef = await generateNextJobRef();
    }

    const job = new Job(req.body);
    await job.save();

    res.status(201).json({ message: 'Job and customer saved successfully', job, customer });
  } catch (err) {
    console.error('Error saving job/customer:', err);
    res.status(500).json({ message: 'Server error while saving job and customer' });
  }
});

// Update a job by ID
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;

    // Optional: Validate updateData here if needed

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate before update
    });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});


// Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdDate: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// Update job progress (PATCH)
app.patch('/api/jobs/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ message: 'Progress field is required' });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job progress updated', job: updatedJob });
  } catch (err) {
    console.error('Error updating job progress:', err);
    res.status(500).json({ message: 'Server error updating job progress' });
  }
});

// Get technicians only
app.get('/api/users/technicians', async (req, res) => {
  try {
    const technicians = await User.find({ type: 'technician' }).select('username');
    res.json(technicians);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ message: 'Server error while fetching technicians' });
  }
});

// ------------------- Server Init -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
