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

const TextArea = ({ label, name, value, onChange, rows = 3, readOnly = false }) => (
  <div className="col-span-2">
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    <textarea
      name={name}
      value={value || ''}
      onChange={readOnly ? () => {} : onChange}
      rows={rows}
      readOnly={readOnly}
      className={`w-full border rounded px-2 py-1 mt-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
              <Input label="Job Flag" name="jobFlag" value={editData.jobFlag} readOnly />
              <Input label="Created By" name="createdBy" value={editData.createdBy} readOnly />
            </Row>
          </Section>

          {/* Customer Information */}
          <Section title="Customer Information">
            <Row>
              <Input label="Prefix" name="customerPrefix" value={editData.customerPrefix} readOnly />
              <Input label="Customer Name" name="customerName" value={editData.customerName} readOnly />
              <Input label="Customer Phone" name="customerPhone" value={editData.customerPhone} readOnly />
              <Input label="Customer Email" name="customerEmail" value={editData.customerEmail} readOnly />
              <Input label="Customer Company" name="customerCompany" value={editData.customerCompany} readOnly />
              <Input label="Customer Address" name="customerAddress" value={editData.customerAddress} readOnly />
            </Row>
          </Section>

          {/* Device Details */}
          <Section title="Device Details">
            <Row>
              <Input label="Device Type" name="deviceType" value={editData.deviceType} readOnly />
              <Input label="Model" name="model" value={editData.model} readOnly />
              <Input label="Series" name="series" value={editData.series} readOnly />
              <Input label="EMEI" name="emei" value={editData.emei} readOnly />
              <Input label="Capacity" name="capacity" value={editData.capacity} readOnly />
              <Input label="Color" name="color" value={editData.color} readOnly />
              <Input label="Passcode" name="passcode" value={editData.passcode} readOnly />
              <Input label="SIM Tray Serial" name="simTraySerial" value={editData.simTraySerial} readOnly />
              <Input label="Under Warranty" name="underWarranty" value={editData.underWarranty} readOnly />
              <div>
                <label className="block text-xs font-medium text-gray-600">SIM Tray Collected</label>
                <select
                  name="simTrayCollected"
                  value={editData.simTrayCollected ? 'Yes' : 'No'}
                  onChange={() => {}}
                  disabled
                  className="w-full border rounded px-2 py-1 mt-1 bg-gray-100 cursor-not-allowed"
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
              <Input label="Technician" name="technician" value={editData.technician} readOnly />
              <Input label="Status" name="status" value={editData.status} readOnly />
              <Input label="Estimated Completion" name="estimatedCompletion" value={editData.estimatedCompletion} readOnly />
              <Input label="Estimated Cost" name="estimatedCost" value={editData.estimatedCost} readOnly />
              <div>
                <label className="block text-xs font-medium text-gray-600">Progress</label>
                <select
                  name="jobProgress"
                  value={editData.jobProgress}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1 mt-1"
                >
                  <option>---SELECT----</option>
                  <option value="Taken">Taken</option>
                  <option value="Completed">Completed</option>
                  <option value="Hold">Hold</option>
                  <option value="Returned">Returned</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </Row>
          </Section>

          {/* Faults, Remarks & Accessories */}
          <Section title="Faults & Remarks">
            <Row>
              <TextArea
                label="Faults"
                name="faults"
                value={editData.faults}
                onChange={() => {}}
                rows={2}
                readOnly
              />
              <TextArea
                label="Remarks"
                name="remarks"
                value={editData.remarks}
                onChange={handleEditChange}
                rows={2}
              />
               {/* <TextArea
                label="Repaired Accessories"
                name="repaired_accessories"
                value={editData.repaired_accessories}
                onChange={handleEditChange}
                rows={2}
              />  */}
          <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600">Repaired Accessories</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              name="newRepairedAccessory"
              value={editData.newRepairedAccessory || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, newRepairedAccessory: e.target.value }))}
              className="w-full border rounded px-2 py-1"
              placeholder="Enter accessory name"
            />
            <button
              type="button"
              onClick={() => {
                if (editData.newRepairedAccessory?.trim()) {
                  setEditData(prev => ({
                    ...prev,
                    repaired_accessories: [
                      ...(prev.repaired_accessories || []),
                      prev.newRepairedAccessory.trim()
                    ],
                    newRepairedAccessory: ''
                  }));
                }
              }}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* List of added accessories */}
          {editData.repaired_accessories?.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
              {editData.repaired_accessories.map((acc, index) => (
                <li key={index}>{acc}</li>
              ))}
            </ul>
          )}
        </div>

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
