import React from 'react';

const Section = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3 mt-4">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, name, value, onChange, readOnly = false }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full border rounded px-2 py-1 mt-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="col-span-2">
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      rows={rows}
      className="w-full border rounded px-2 py-1 mt-1"
    />
  </div>
);

const EditJobModal = ({ editData, setEditData, onClose, onSubmit }) => {
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'simTrayCollected') {
      setEditData(prev => ({ ...prev, [name]: value === 'Yes' }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-700 hover:text-red-600 w-10 h-10 flex items-center justify-center rounded-full transition duration-150"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-yellow-700">✏️ Edit Job Details</h2>
        <form onSubmit={onSubmit} className="space-y-4 text-sm text-gray-800">

          {/* Job Details */}
          <Section title="Job Details">
            <Row>
              <Input label="Job Ref" name="jobRef" value={editData.jobRef} readOnly />
              <Input label="Created Date" name="createdDate" value={editData.createdDate} readOnly />
              <Input label="Job Flag" name="jobFlag" value={editData.jobFlag} onChange={handleEditChange} />
              <Input label="Created By" name="createdBy" value={editData.createdBy} readOnly />
            </Row>
          </Section>

          {/* Customer Information */}
          <Section title="Customer Information">
            <Row>
              <Input label="Prefix" name="customerPrefix" value={editData.customerPrefix} onChange={handleEditChange} />
              <Input label="Customer Name" name="customerName" value={editData.customerName} onChange={handleEditChange} />
              <Input label="Customer Phone" name="customerPhone" value={editData.customerPhone} onChange={handleEditChange} />
              <Input label="Customer Email" name="customerEmail" value={editData.customerEmail} onChange={handleEditChange} />
              <Input label="Customer Company" name="customerCompany" value={editData.customerCompany} onChange={handleEditChange} />
              <Input label="Customer Address" name="customerAddress" value={editData.customerAddress} onChange={handleEditChange} />
            </Row>
          </Section>

          {/* Device Details */}
          <Section title="Device Details">
            <Row>
              <Input label="Device Type" name="deviceType" value={editData.deviceType} onChange={handleEditChange} />
              <Input label="Model" name="model" value={editData.model} onChange={handleEditChange} />
              <Input label="Series" name="series" value={editData.series} onChange={handleEditChange} />
              <Input label="EMEI" name="emei" value={editData.emei} onChange={handleEditChange} />
              <Input label="Capacity" name="capacity" value={editData.capacity} onChange={handleEditChange} />
              <Input label="Color" name="color" value={editData.color} onChange={handleEditChange} />
              <Input label="Passcode" name="passcode" value={editData.passcode} onChange={handleEditChange} />
              <Input label="SIM Tray Serial" name="simTraySerial" value={editData.simTraySerial} onChange={handleEditChange} />
              <Input label="Under Warranty" name="underWarranty" value={editData.underWarranty} onChange={handleEditChange} />
              <div>
                <label className="block text-xs font-medium text-gray-600">SIM Tray Collected</label>
                <select
                  name="simTrayCollected"
                  value={editData.simTrayCollected ? 'Yes' : 'No'}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1 mt-1"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </Row>
          </Section>

          {/* Job Progress */}
          <Section title="Job Progress">
            <Row>
              <Input label="Technician" name="technician" value={editData.technician} onChange={handleEditChange} />
              <Input label="Status" name="status" value={editData.status} onChange={handleEditChange} />
              <Input label="Estimated Completion" name="estimatedCompletion" value={editData.estimatedCompletion} onChange={handleEditChange} />
              <Input label="Estimated Cost" name="estimatedCost" value={editData.estimatedCost} onChange={handleEditChange} />
              <Input label="Progress" name="jobProgress" value={editData.jobProgress} onChange={handleEditChange} />
            </Row>
          </Section>

          {/* Faults, Remarks & Accessories */}
          <Section title="Faults & Remarks">
            <Row>
              <TextArea
                label="Faults"
                name="faults"
                value={editData.faults}
                onChange={handleEditChange}
                rows={2}
              />
              <TextArea
                label="Remarks"
                name="remarks"
                value={editData.remarks}
                onChange={handleEditChange}
                rows={2}
              />
              <TextArea
                label="Repaired Accessories"
                name="repaired_accessories"
                value={editData.repaired_accessories}
                onChange={handleEditChange}
                rows={2}
              />
            </Row>
          </Section>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
