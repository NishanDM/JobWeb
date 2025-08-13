import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CustomerDetails from './CustomerDetails';
import DeviceDetails from './DeviceDetails';
import JobDetails from './JobDetails';

const initialFormData = (user, today) => ({
  jobRef: '',
  createdDate: today,
  jobFlag: 'Normal',
  createdBy: user?.username || user?.email || '',
  customerPrefix: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerCompany: '',
  customerAddress: '',
  deviceType: 'Phone',
  model: '',
  series: '',
  emei: '',
  capacity: '',
  color: '',
  passcode: '',
  underWarranty: 'No',
  faults: [],
  technician: '',
  status: 'New',
  estimatedCompletion: '',
  estimatedCost: '',
  jobProgress: 'Just_started',
  remarks: '',
  repaired_accessories: [],
  simTrayCollected: false,
  simTraySerial: '',
  
  // Newly added fields:
  customer_reported: [],
  newCustomerReported: '',
  collected_accessories: [],
});


const JobForm = () => {
  const [formData, setFormData] = useState(() =>
    initialFormData(JSON.parse(localStorage.getItem('user')), new Date().toISOString().split('T')[0])
  );
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const initializeForm = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const today = new Date().toISOString().split('T')[0];

      try {
        const [refRes, techRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/nextRef`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/technicians`),
        ]);

        setTechnicians(techRes.data || []);
        setFormData({
          ...initialFormData(user, today),
          jobRef: refRes.data.nextJobRef || 'IDSJBN-00-00-000',
        });
      } catch (err) {
        console.error('Initialization error:', err);
        setFormData((prev) => ({
          ...prev,
          jobRef: 'IDSJBN-00-00-000',
        }));
      }
    };

    initializeForm();
  }, []);

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Prepare submission data (join arrays to comma-separated strings)
//   const submissionData = {
//     ...formData,
//     faults: formData.faults.join(', '),
//     repaired_accessories: formData.repaired_accessories.join(', '),
//   };

//   try {
//     // Submit job to backend
//     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, submissionData);

//     if (res.status === 201) {
//   alert('✅ Job submitted successfully!');

//   // Reset form with new jobRef and current user info
//   const user = JSON.parse(localStorage.getItem('user'));
//   const today = new Date().toISOString().split('T')[0];
//   const refRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/nextRef`);
//   const newRef = refRes.data.nextJobRef || 'IDSJBN-00-00-000';

//   setFormData({
//     ...initialFormData(user, today),
//     jobRef: newRef,
//   });
// }

    
//     else 
//       {
//       alert(`❌ Failed to submit job: ${res.data.message || 'Unknown error'}`);
//     }
//   } catch (error) {
//     console.error('Submit Error:', error);

//     // More informative alert message if available from server
//     const errorMsg = error.response?.data?.message || error.message || 'Error occurred while submitting the job.';
//     alert(`❌ ${errorMsg}`);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare submission data (join arrays to comma-separated strings)
  const submissionData = {
    ...formData,
    faults: formData.faults.join(', '),
    repaired_accessories: formData.repaired_accessories.join(', '),
  };

  try {
    // Submit job to backend
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, submissionData);

    if (res.status === 201) {
      alert('✅ Job submitted successfully!');

      // 📧 Send email to customer
      if (formData.customerEmail) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/email/sendJobStart`, {
            to: formData.customerEmail,
            subject: 'Job Started',
            message: `Dear valued customer, we started your job. The job number is ${formData.jobRef}`,
          });
          console.log('📧 Customer email sent successfully');
        } catch (emailErr) {
          console.error('Email sending failed:', emailErr);
          alert('⚠ Job created but failed to send customer email.');
        }
      }

      // Reset form with new jobRef and current user info
      const user = JSON.parse(localStorage.getItem('user'));
      const today = new Date().toISOString().split('T')[0];
      const refRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/nextRef`);
      const newRef = refRes.data.nextJobRef || 'IDSJBN-00-00-000';

      setFormData({
        ...initialFormData(user, today),
        jobRef: newRef,
      });
    } else {
      alert(`❌ Failed to submit job: ${res.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Submit Error:', error);

    // More informative alert message if available from server
    const errorMsg = error.response?.data?.message || error.message || 'Error occurred while submitting the job.';
    alert(`❌ ${errorMsg}`);
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-gray-200 p-4 shadow rounded text-sm font-medium space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">📋 Job Submission</h2>

      {/* Job Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
  <div>
    <label className="block mb-1">Job Ref</label>
    <input
      type="text"
      value={formData.jobRef}
      disabled
      className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed text-gray-500"
    />
  </div>
  <div>
    <label className="block mb-1">Created Date</label>
    <input
      type="date"
      value={formData.createdDate}
      disabled
      className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed text-gray-500"
    />
  </div>
  <div>
    <label className="block mb-1">Created By</label>
    <input
      type="text"
      value={formData.createdBy}
      disabled
      className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed text-gray-500"
    />
  </div>
</div>


      {/* Subsections */}
      <CustomerDetails formData={formData} setFormData={setFormData} />
      <DeviceDetails formData={formData} setFormData={setFormData} />
      <JobDetails formData={formData} setFormData={setFormData} technicians={technicians} />

      {/* Final Submit Button */}
      <div className="text-right flex justify-end gap-2 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Job</button>
      
      </div>
    </form>
  );
};

export default JobForm;
