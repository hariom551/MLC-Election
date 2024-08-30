import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse'; // Make sure you have this installed

const Whatsapp = () => {
  const [formData, setFormData] = useState({
    type: 'Text',
    Mobile: '',
    Text: '',
    Count: '',
    exMobile: '',
    exPerson: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'Mobile') {
        const mobileNumbers = value.split(',').map(number => number.trim()).filter(number => number !== '');
        newData.Count = mobileNumbers.length;
        newData.exMobile = mobileNumbers.length;
        newData.exPerson = mobileNumbers.length;
      }

      return newData;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const mobileNumbers = result.data.flat().map(row => row.trim()).filter(row => row).join(', ');
          const count = result.data.flat().map(row => row.trim()).filter(row => row).length;
          setFormData(prev => ({
            ...prev,
            Mobile: mobileNumbers,
            Count: count,
            exMobile: count,
            exPerson: count
          }));
        },
        header: false, // Adjust based on your CSV format
        skipEmptyLines: true, // Skip empty lines if present
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileNumbers = formData.Mobile.split(',').map(number => number.trim());

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Mobile: mobileNumbers,
          type: formData.type,
          Text: formData.Text
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Error sending SMS');
      }
    } catch (error) {
      toast.error('Error sending SMS');
    }
  };

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Send Whatsapp</h1>
        <form onSubmit={handleSubmit} className="sms-form">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            {/* Mobile Number Text Area */}
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="Mobile" className="block text-black mb-2">Mobile Numbers (Comma-Separated)</label>
              <textarea
                id="Mobile"
                name="Mobile"
                value={formData.Mobile}
                onChange={handleInputChange}
                required
                placeholder="Enter comma-separated mobile numbers"
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* CSV Upload */}
            <div className="flex-shrink-0">
              <label htmlFor="csv-upload" className="block text-black mb-2">Upload CSV</label>
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="Count" className="block text-black mb-2">Total Mobile Count</label>
            <input
              type="number"
              name="Count"
              id="Count"
              placeholder='Total Mobile Count'
              value={formData.Count}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>

          <span>Select Message Type</span>
          <div className='flex gap-10 my-2'>
            <label>
              <input
                type="radio"
                name="type"
                value="Text"
                checked={formData.type === 'Text'}
                onChange={handleInputChange}
              />
              Text
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Image"
                checked={formData.type === 'Image'}
                onChange={handleInputChange}
              />
              Image
            </label>
          </div>

          {formData.type === 'Text' && (
            <div id="Text">
              <div className="mb-4">
                <label htmlFor="Text" className="block text-black mb-2">Text</label>
                <input
                  type="text"
                  id="Text"
                  name="Text"
                  value={formData.Text}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {formData.type === 'Image' && (
            <div id="Image-options">
              <div className="mb-3">
                <label htmlFor="ex-mobile" className="block text-black mb-2">Total Mobile Found</label>
                <input
                  type="text"
                  name="exMobile"
                  id="ex-mobile"
                  placeholder='Total Mobile Found'
                  value={formData.exMobile}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="ex-person" className="block text-black mb-2">Total Person</label>
                <input
                  type="text"
                  name="exPerson"
                  id="ex-person"
                  placeholder='Total Person'
                  value={formData.exPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send SMS</button>
        </form>
        <hr className="my-4" />
      </div>
    </main>
  );
};

export default Whatsapp;
