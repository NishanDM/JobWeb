import React from 'react';
import deviceModels from '../data/deviceModels.json';
import deviceColors from '../data/deviceColors.json';
import { Input, Select, Row, Section } from './FormComponents';

const capacityOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB'];

const DeviceDetails = ({ formData, setFormData }) => {
  const selectedColors = deviceColors[formData.model] || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    if (name === 'deviceType') {
      setFormData((prev) => ({
        ...prev,
        deviceType: finalValue,
        model: '',
        color: '',
      }));
      return;
    }

    if (name === 'model') {
      setFormData((prev) => ({
        ...prev,
        model: finalValue,
        color: '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const resetSection = () => {
    setFormData((prev) => ({
      ...prev,
      deviceType: 'Phone',
      model: '',
      series: '',
      emei: '',
      capacity: '',
      color: '',
      passcode: '',
      simTrayCollected: false,
      simTraySerial: '',
    }));
  };

  return (
    <Section title="Device Details" color="text-purple-700">
      <Row>
        <Select label="Device Type" name="deviceType" value={formData.deviceType} onChange={handleChange} options={Object.keys(deviceModels)} />
        <Select label="Model" name="model" value={formData.model} onChange={handleChange} options={deviceModels[formData.deviceType] || []} required />
        <Input label="Serial Number" name="series" value={formData.series} onChange={handleChange} />
        <Input label="EMEI" name="emei" value={formData.emei} onChange={handleChange} />
        <Select label="Capacity" name="capacity" value={formData.capacity} onChange={handleChange} options={capacityOptions} />
        <Select label="Color" name="color" value={formData.color} onChange={handleChange} options={selectedColors} />
        <Input label="Passcode / Pattern" name="passcode" value={formData.passcode} onChange={handleChange} />
      </Row>

      <Row>
        <div className="flex flex-col space-y-2 mt-10">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="simTrayCollected" checked={formData.simTrayCollected} onChange={handleChange} />
            <label className="text-sm font-medium">SIM Tray Collected</label>
          </div>

          {formData.simTrayCollected && (
            <Input label="SIM Tray Serial" name="simTraySerial" value={formData.simTraySerial} onChange={handleChange} required />
          )}
        </div>
      </Row>

      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="bg-gray-400 px-4 py-1 rounded" onClick={resetSection}>Reset</button>
        {/* <button type="button" className="bg-blue-600 text-white px-4 py-1 rounded">Save</button> */}
      </div>
    </Section>
  );
};

export default DeviceDetails;
