import React from 'react';
import { Input, Select, TextArea, Row, Section } from './FormComponents';
import { FaSearch } from 'react-icons/fa'; // ⬅️ Import search icon
import axios from 'axios';

const CustomerDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetSection = () => {
    setFormData((prev) => ({
      ...prev,
      customerPrefix: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerCompany: '',
      customerAddress: '',
    }));
  };

  const handleSearchCustomer = async () => {
    const phone = formData.customerPhone;
    if (!phone) {
      alert('Please enter a phone number to search');
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/customers/by-phone/${phone}`);
      if (res.status === 200) {
        const customer = res.data;
        setFormData((prev) => ({
          ...prev,
          customerPrefix: customer.prefix || '',
          customerName: customer.name || '',
          customerEmail: customer.email || '',
          customerCompany: customer.company || '',
          customerAddress: customer.address || '',
        }));
        alert('✅ Customer details filled successfully');
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      alert('❌ Customer not found');
    }
  };

  return (
    <Section title="Customer Details" color="text-green-700">
      <Row>
        <Select
          label="Prefix"
          name="customerPrefix"
          value={formData.customerPrefix}
          onChange={handleChange}
          options={['Mr', 'Mrs', 'Ms', 'Ven.', 'Dr', 'Rev.']}
          placeholder="-- Select Prefix --"
        />

        <Input
          label="Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
        />

        {/* Phone input + search icon */}
        <div className="w-full">
          <label className="block mb-1">Phone <span className="text-red-500">*</span></label>
          <div className="flex">
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="w-full border rounded-l px-2 py-1"
              required
            />
            <button
              type="button"
              onClick={handleSearchCustomer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r"
              title="Search Customer"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <Input
          label="Email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
        />
        <Input
          label="Company"
          name="customerCompany"
          value={formData.customerCompany}
          onChange={handleChange}
        />
      </Row>

      <TextArea
        label="Address"
        name="customerAddress"
        value={formData.customerAddress}
        onChange={handleChange}
        rows={2}
      />

      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="bg-gray-400 px-4 py-1 rounded" onClick={resetSection}>Reset</button>
        {/* <button type="button" className="bg-blue-600 text-white px-4 py-1 rounded">Save</button> */}
      </div>
    </Section>
  );
};

export default CustomerDetails;
