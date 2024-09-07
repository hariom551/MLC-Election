import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';

const DistrictRadio = ({ formData, setFormData }) => {
  const [district, setDistrict] = useState([]);

  const fetchDistrictOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/DistrictDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch District options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid District options data');
      }

      const options = data.map((district) => ({
        value: district.Id,
        label: district.EDistrict,
      }));
      setDistrict(options);
    } catch (error) {
      toast.error(`Error fetching District options: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDistrictOptions();
  }, []);

  return (
    <div className="col-md-3 mb-3">
      <Form.Group>
        <Form.Label>
          Select District<sup className="text-red-600">*</sup>
        </Form.Label>

        {district.map((option) => (
          <Form.Check
            key={option.value}
            type="radio"
            id={`district-${option.value}`}
            name="DId"
            label={
              <span
                className={`${
                  formData.DId == option.value ? 'text-[#011627] font-bold' : ''
                }`}
              >
                {option.label}
              </span>
            }
            value={option.value}
            checked={formData.DId === option.value}
            onChange={(e) =>
              setFormData((prevFormData) => ({ ...prevFormData, DId: e.target.value }))
            }
            className="mb-2 custom-radio" // Apply custom CSS class for radio buttons
          />
        ))}
      </Form.Group>
    </div>
  );
};

export default DistrictRadio;
