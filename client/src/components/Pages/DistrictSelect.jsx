import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
const DistrictSelect = ({ formData, setFormData }) => {
  const [district, setDistrict] = useState([]);


  const fetchDistrictOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/DistrictDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch District options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid District options data');
      }

      const options = data.map(district => ({ value: district.Id, label: district.EDistrict }));
      setDistrict(options);

    } catch (error) {
      toast.error('Error fetching District options:', error);
    }
  };

  useEffect(() => {
    fetchDistrictOptions();
  }, []);

  return (
    <div className="col-md-3 mb-3">
      <Form.Group>
        <Form.Label>Select District<sup className='text-red-600'>*</sup></Form.Label>
        <Select
        className="relative z-50"
          id="DistrictSelect"
          name="DId"
          value={district.find(option => option.value === formData.DId)}
          onChange={option => setFormData(prevFormData => ({ ...prevFormData, DId: option.value }))}
          options={district}
          placeholder="Select District"
        />
      </Form.Group>
    </div>
  );
};

export default DistrictSelect;
