import React, { useState } from 'react';
import dataset from '../data/repairaccessories';
import { Input, Select, TextArea, Row, Section } from './FormComponents';
import { ChevronDown, ChevronRight } from 'lucide-react';

const JobDetails = ({ formData, setFormData, technicians }) => {
  const [newFault, setNewFault] = useState('');
  const [accessoriesVisible, setAccessoriesVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFault = () => {
    if (newFault.trim()) {
      setFormData((prev) => ({
        ...prev,
        faults: [...prev.faults, newFault.trim()],
      }));
      setNewFault('');
    }
  };

  const resetSection = () => {
    setFormData((prev) => ({
      ...prev,
      jobFlag: 'Normal',
      technician: '',
      status: 'New',
      estimatedCompletion: '',
      estimatedCost: '',
      jobProgress: 'Just_started',
      remarks: '',
      faults: [],
      repaired_accessories: [],
      customer_reported: [],
      newCustomerReported: '',
      collected_accessories: [],
    }));
  };

  return (
    <Section title="Job Info" color="text-red-700">
      <Row>
        <Select label="Job Flag" name="jobFlag" value={formData.jobFlag} onChange={handleChange} options={['Normal', 'Quick']} />
        <Select label="Under Warranty" name="underWarranty" value={formData.underWarranty} onChange={handleChange} options={['Yes', 'No']} />

        <div className="w-full">
          <label className="block mb-1 font-medium">Technician</label>
          <select name="technician" value={formData.technician} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white text-gray-800">
            <option value="">-- Select Technician --</option>
            {technicians.map(t => (
              <option key={t._id || t.username} value={t.username}>{t.username}</option>
            ))}
          </select>
        </div>

        <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['New', 'Re-repair', 'Under-warranty', 'Sell for parts']} />
        <Input label="Est. Completion" name="estimatedCompletion" type="date" value={formData.estimatedCompletion} onChange={handleChange} />
        <Input label="Estimated Cost" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} />
      </Row>

      <Row>
        {/* Faults Section */}
        <div className="md:col-span-4">
          <label className="block mb-1 font-medium">Faults</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={newFault} onChange={(e) => setNewFault(e.target.value)} placeholder="Enter a fault" className="w-full border rounded px-2 py-1" />
            <button type="button" onClick={handleAddFault} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Add</button>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {formData.faults.map((fault, index) => <li key={index}>{fault}</li>)}
          </ul>
        </div>

        {/* Repaired Accessories Section */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="font-medium">Accessories to be repaired</label>
            <button
              type="button"
              className="text-gray-600 hover:text-black"
              onClick={() => setAccessoriesVisible(!accessoriesVisible)}
              aria-label="Toggle Accessories"
            >
              {accessoriesVisible ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {accessoriesVisible && (
            <div className="border p-2 rounded bg-gray-100 overflow-y-auto max-h-64 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {dataset.repairedAccessories.map((acc) => (
                  <div key={acc} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.repaired_accessories.includes(acc)}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          repaired_accessories: prev.repaired_accessories.includes(acc)
                            ? prev.repaired_accessories.filter((a) => a !== acc)
                            : [...prev.repaired_accessories, acc],
                        }));
                      }}
                    />
                    <label className="text-sm">{acc}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Reported Issues */}
        <div className="md:col-span-4">
          <label className="block mb-1 font-medium">Customer Reported</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={formData.newCustomerReported || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, newCustomerReported: e.target.value }))}
              placeholder="Enter issue reported by customer"
              className="w-full border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={() => {
                if (formData.newCustomerReported?.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    customer_reported: [...(prev.customer_reported || []), prev.newCustomerReported.trim()],
                    newCustomerReported: ''
                  }));
                }
              }}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {(formData.customer_reported || []).map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>

        {/* Other Accessories Collected */}
        <div className="md:col-span-4">
          <label className="block mb-1 font-medium">Other Accessories Collected</label>
          <select
            name="collected_accessories"
            value={formData.collected_accessories || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, collected_accessories: e.target.value }))}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">-- Select an accessory --</option>
            {['Charger', 'Cable', 'Bluetooth Earbud', 'SIM', 'Case', 'Memory Card'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <TextArea label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
        </div>
      </Row>

      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="bg-gray-400 px-4 py-1 rounded" onClick={resetSection}>Reset</button>
      </div>
    </Section>
  );
};

export default JobDetails;
