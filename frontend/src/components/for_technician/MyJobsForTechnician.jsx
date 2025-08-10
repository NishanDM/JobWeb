import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewJobModal from './ViewJobModal';
import EditJobModal from './EditJobModal';

const MyJobsForTechnician = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
      const filtered = res.data.filter(job => job.technician === user?.username);

      // Sort after filtering
      const sorted = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setJobs(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.username]);

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
      fetchJobs(); // Refresh job list
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update job.');
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">🛠️ My Jobs</h2>

      <table className="min-w-full border bg-white shadow rounded text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Job Ref</th>
            <th className="px-4 py-2 text-left">Customer Name</th>
            {/* <th className="px-4 py-2 text-left">Customer Phone</th> */}
            <th className="px-4 py-2 text-left">Created Date</th>
            <th className="px-4 py-2 text-left">Est: Date</th>
            <th className="px-4 py-2 text-left">Device Type</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Progress</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t hover:bg-gray-100">
              <td className="px-4 py-2">{job.jobRef}</td>
              <td className="px-4 py-2">{job.customerName}</td>
              {/* <td className="px-4 py-2">{job.customerPhone}</td> */}
              <td className="px-4 py-2">{new Date(job.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(job.estimatedCompletion).toLocaleDateString()}</td>
              <td className="px-4 py-2">{job.deviceType}</td>
              <td className="px-4 py-2">{job.status}</td>
              <td className="px-4 py-2">{job.jobProgress}</td>
              <td className="px-4 py-2">{job.createdBy}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleView(job)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(job)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Job Modal */}
      {isViewing && selectedJob && (
        <ViewJobModal job={selectedJob} onClose={() => setIsViewing(false)} />
      )}

      {/* Edit Job Modal */}
      {isEditing && (
        <EditJobModal
          editData={editData}
          setEditData={setEditData}
          onClose={() => setIsEditing(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default MyJobsForTechnician;
