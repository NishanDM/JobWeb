import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewJobModal from './ViewJobModal';
import { Button } from '@mui/material';

const CompletedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  const fetchCompletedJobs = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/completed`);
    const sorted = res.data
      .filter(job => job.jobProgress === 'Completed') // safety filter
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setJobs(sorted);
  } catch (err) {
    console.error('Error fetching completed jobs:', err);
  }
};


  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewing(true);
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">✅ Completed Jobs</h2>

      <div className="overflow-hidden rounded shadow-lg">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full text-sm bg-gray-800 text-white">
            <thead className="bg-green-900 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left">Job Ref</th>
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Customer Phone</th>
                <th className="px-4 py-2 text-left">Created Date</th>
                <th className="px-4 py-2 text-left">Device Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Technician</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="border-t border-gray-700 hover:bg-gray-700">
                    <td className="px-4 py-2">{job.jobRef}</td>
                    <td className="px-4 py-2">{job.customerName}</td>
                    <td className="px-4 py-2">{job.customerPhone}</td>
                    <td className="px-4 py-2">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{job.deviceType}</td>
                    <td className="px-4 py-2 text-green-400">{job.jobProgress}</td>
                    <td className="px-4 py-2">{job.technician || '-'}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleView(job)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    No completed jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Job Modal */}
      {isViewing && selectedJob && (
        <ViewJobModal job={selectedJob} onClose={() => setIsViewing(false)} />
      )}
    </div>
  );
};

export default CompletedJobs;
