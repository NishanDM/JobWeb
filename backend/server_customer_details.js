// server.js
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Job schema (loose schema to store customer details)
const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', jobSchema);

async function exportUniqueCustomers() {
  try {
    const jobs = await Job.find({}, {
      customerPhone: 1,
      customerEmail: 1,
      customerCompany: 1,
      customerAddress: 1,
      customerName: 1,
      customerPrefix: 1
    });

    const customerMap = {};
    for (const job of jobs) {
      const phone = job.customerPhone;
      if (!phone) continue;

      customerMap[phone] = {
        phone: phone,
        email: job.customerEmail || '',
        company: job.customerCompany || '',
        address: job.customerAddress || '',
        name: job.customerName || '',
        prefix: job.customerPrefix || ''
      };
    }

    const outputDir = path.join(__dirname, 'uploads');
    const outputPath = path.join(outputDir, 'customers.json');

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(customerMap, null, 2));

    console.log(`✅ Customer data saved to ${outputPath}`);
  } catch (err) {
    console.error('❌ Error exporting customer data:', err);
  }
}

// API route to get customers.json
app.get('/api/customers', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'customers.json');
  if (fs.existsSync(filePath)) {
    res.json(JSON.parse(fs.readFileSync(filePath)));
  } else {
    res.json({});
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Connected to MongoDB');
  await exportUniqueCustomers(); // Run once on start

  // Keep file updated every 1 min
  setInterval(exportUniqueCustomers, 60000);
}).catch(err => console.error(err));

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
