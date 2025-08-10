const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const router = express.Router();

const User = require('./models/User');
const Job = require('./models/Job');
const Customer = require('./models/Customer');
const Notification = require('./models/Notification');

const emailRoutes = require('./routes/email');
const notificationRoutes = require('./routes/notifications');

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

// Utility: Generate next job reference number
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

// Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// Email
app.use('/api/email', emailRoutes);

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

// Get technicians only
app.get('/api/users/technicians', async (req, res) => {
  try {
    const technicians = await User.find({ type: 'technician' }).select('username email');
    res.json(technicians);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ message: 'Server error while fetching technicians' });
  }
});

// Auth - Login
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

// Auth - Register
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

// Submit a new job (and create customer if not exists)
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      customerPrefix, customerName, customerEmail, customerPhone,
      customerCompany, customerAddress,
      technician, technicianEmail // ✅ Needed for notification
    } = req.body;

    // Find or create customer
    let customer = await Customer.findOne({
      $or: [{ email: customerEmail }, { phone: customerPhone }],
    });

    if (!customer) {
      customer = new Customer({
        prefix: customerPrefix,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: customerCompany,
        address: customerAddress,
      });
      await customer.save();
    }

    // Generate job reference if missing
    if (!req.body.jobRef) {
      req.body.jobRef = await generateNextJobRef();
    }

    const job = new Job(req.body);
    await job.save();

    // ✅ Send notification to assigned technician (by username)
if (technician) {
  const notification = new Notification({
    username: technician, // 👈 correct field
    message: `You have been assigned a new job (${req.body.jobRef})`,
  });
  await notification.save();
  console.log('✅ Notification created for:', technician);
  console.log('Assigned technician username:', technician);
}


    res.status(201).json({ message: 'Job and customer saved successfully', job, customer });
  } catch (err) {
    console.error('Error saving job/customer:', err);
    res.status(500).json({ message: 'Server error while saving job and customer' });
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

// Update job by ID
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
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

// Update job progress
app.patch('/api/jobs/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ message: 'Progress field is required' });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, { progress }, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job progress updated', job: updatedJob });
  } catch (err) {
    console.error('Error updating job progress:', err);
    res.status(500).json({ message: 'Server error updating job progress' });
  }
});

// Update customer by ID
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updateData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Server error updating customer' });
  }
});

// Get customer by phone
app.get('/api/customers/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer by phone:', err);
    res.status(500).json({ message: 'Server error fetching customer' });
  }
});



// Notifications route
app.use('/api/notifications', notificationRoutes);

// ------------------- Server Init -------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
