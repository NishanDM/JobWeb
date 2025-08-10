import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewJobModal from './ViewJobModal';
import EditJobModal from './EditJobModal';
import { Button } from '@mui/material';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
      // Sort descending by createdAt (newest first)
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setJobs(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewing(true);
  };

  const handleEdit = (job) => {
    setEditData(job);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/jobs/${editData._id}`, editData);
      alert('✅ Job updated successfully!');
      setIsEditing(false);
      fetchJobs(); // Refresh jobs after edit
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update job.');
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">🛠️ All Jobs</h2>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>No jobs found.</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="overflow-hidden rounded shadow-lg">
  <div className="max-h-[500px] overflow-y-auto">
    <table className="min-w-full text-sm bg-gray-800 text-white">
      <thead className="bg-blue-900 text-white sticky top-0 z-10">
        <tr>
          <th className="px-4 py-2 text-left">Job Ref</th>
          <th className="px-4 py-2 text-left">Customer Name</th>
          <th className="px-4 py-2 text-left">Customer Phone</th>
          <th className="px-4 py-2 text-left">Created Date</th>
          <th className="px-4 py-2 text-left">Device Type</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Progress</th>
          <th className="px-4 py-2 text-left">Technician</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job._id} className="border-t border-gray-700 hover:bg-gray-700">
            <td className="px-4 py-2">{job.jobRef}</td>
            <td className="px-4 py-2">{job.customerName}</td>
            <td className="px-4 py-2">{job.customerPhone}</td>
            <td className="px-4 py-2">
              {new Date(job.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">{job.deviceType}</td>
            <td className="px-4 py-2">{job.status}</td>
            <td className="px-4 py-2">{job.jobProgress || '-'}</td>
            <td className="px-4 py-2">{job.technician || '-'}</td>
            <td className="px-4 py-2 space-x-2">
              <Button
                variant="contained"
                size="small"
                onClick={() => handleView(job)}
                sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
              >
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      )}

      {/* View Job Modal */}
      {isViewing && selectedJob && (
        <ViewJobModal job={selectedJob} onClose={() => setIsViewing(false)} />
      )}

      
    </div>
  );
};

export default MyJobs;
