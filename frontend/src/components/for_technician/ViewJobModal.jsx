import React from 'react';

const Section = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3 mt-4">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const ViewField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-600">{label}</p>
    <p className="text-sm">{value ?? '-'}</p>
  </div>
);

const ViewJobModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-700 hover:text-red-600 w-10 h-10 flex items-center justify-center rounded-full transition duration-150">
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-yellow-700">🔍 View Job Details</h2>

        <Section title="Job Details">
          <ViewField label="Job Ref" value={job.jobRef} />
          <ViewField label="Created Date" value={job.createdDate} />
          <ViewField label="Job Flag" value={job.jobFlag} />
          <ViewField label="Created By" value={job.createdBy} />
          <ViewField label="Created At" value={new Date(job.createdAt).toLocaleString()} />
          <ViewField label="Updated At" value={new Date(job.updatedAt).toLocaleString()} />
        </Section>

        <Section title="Customer Information">
          <ViewField label="Prefix" value={job.customerPrefix} />
          <ViewField label="Customer Name" value={job.customerName} />
          <ViewField label="Customer Phone" value={job.customerPhone} />
          <ViewField label="Customer Email" value={job.customerEmail} />
          <ViewField label="Customer Company" value={job.customerCompany} />
          <ViewField label="Customer Address" value={job.customerAddress} />
        </Section>

        <Section title="Device Details">
          <ViewField label="Device Type" value={job.deviceType} />
          <ViewField label="Model" value={job.model} />
          <ViewField label="Series" value={job.series} />
          <ViewField label="EMEI" value={job.emei} />
          <ViewField label="Capacity" value={job.capacity} />
          <ViewField label="Color" value={job.color} />
          <ViewField label="Passcode" value={job.passcode} />
          <ViewField label="SIM Tray Serial" value={job.simTraySerial} />
          <ViewField label="Under Warranty" value={job.underWarranty} />
          <ViewField label="SIM Tray Collected" value={job.simTrayCollected ? 'Yes' : 'No'} />
        </Section>

        <Section title="Job Progress">
          <ViewField label="Technician" value={job.technician} />
          <ViewField label="Status" value={job.status} />
          <ViewField label="Estimated Completion" value={job.estimatedCompletion} />
          <ViewField label="Estimated Cost" value={job.estimatedCost} />
          <ViewField label="Progress" value={job.jobProgress} />
        </Section>

        <Section title="Faults & Remarks">
  <div className="col-span-2">
    <p className="text-xs font-medium text-gray-600">Customer Reported Faults</p>
    <p className="whitespace-pre-wrap">{job.customer_reported?.join(', ') || '-'}</p>
  </div>
  <div className="col-span-2 mt-2">
    <p className="text-xs font-medium text-gray-600">Collected Accessories</p>
    <p className="whitespace-pre-wrap">{job.collected_accessories?.join(', ') || '-'}</p>
  </div>
  <div className="col-span-2 mt-2">
    <p className="text-xs font-medium text-gray-600">Repaired Accessories</p>
    <p className="whitespace-pre-wrap">{job.repaired_accessories?.join(', ') || '-'}</p>
  </div>
  <div className="col-span-2 mt-2">
    <p className="text-xs font-medium text-gray-600">Faults</p>
    <p className="whitespace-pre-wrap">{job.faults?.join(', ') || '-'}</p>
  </div>
  <div className="col-span-2 mt-2">
    <p className="text-xs font-medium text-gray-600">Remarks</p>
    <p className="whitespace-pre-wrap">{job.remarks || '-'}</p>
  </div>
</Section>


        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;
