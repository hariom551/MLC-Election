import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "./DisplayData.css";
import { query } from "express";

const DisplayData = () => {
  const [data, setData] = useState([]);
  const [employNameOption, setEmployNameOption] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch IncomingForms details");
        }

        const data = await response.json();

        if (!data) {
          throw new Error("Empty or invalid details data");
        }
        setEmployNameOption(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedEmployee === 'all') {
      setData(employNameOption);
    } else {
      const selectedData = employNameOption.filter(details => details.sr_no == selectedEmployee);
      setData(selectedData);
    }
    console.log(`Selected employee data:`, data);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/users`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      console.log('File upload result:', result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div>
        <form id="browsecss" onSubmit={handleSubmit}>
          <label htmlFor="select">Select Name </label>
<div>
          <select name="select" id="select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">Select Employee</option>
            <option value="all">Select All</option>
            {employNameOption.map((data) => (
              <option key={data.sr_no} value={data.sr_no}>{()=>{
                query
              }}</option>
            ))}
          </select>
          </div>
          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      </div>

      <section>
        <div id="table">
          <table border="1" cellPadding="5" cellSpacing="0">
            {data.length > 0 && (
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>CreatedDate</th>
                  <th>LastModifiedDate</th>
                  <th>ImportedBy</th>
                  <th>LeadNo</th>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>CountryCode</th>
                  <th>PhoneNo</th>
                  <th>AlternateCountryCode</th>
                  <th>AlternatePhoneNo</th>
                  <th>NoOfAttempts</th>
                  <th>LeadTags</th>
                  <th>LastCallEmployee</th>
                  <th>LastCallTime</th>
                  <th>LastCallType</th>
                  <th>LastCallDuration</th>
                  <th>LastCallNote</th>
                  <th>AssignTo</th>
                  <th>LeadStatus</th>
                  <th>Reminder</th>
                  <th>CompanyName</th>
                  <th>Email</th>
                  <th>Address1</th>
                  <th>Address2</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zipcode</th>
                  <th>Country</th>
                  <th>Description</th>
                  <th>Source</th>
                  <th>Price</th>
                </tr>
              </thead>
            )}
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.sr_no}</td>
                  <td>{item.CreatedDate}</td>
                  <td>{item.LastModifiedDate}</td>
                  <td>{item.ImportedBy}</td>
                  <td>{item.LeadNo}</td>
                  <td>{item.FirstName}</td>
                  <td>{item.LastName}</td>
                  <td>{item.CountryCode}</td>
                  <td>{item.PhoneNo}</td>
                  <td>{item.AlternateCountryCode}</td>
                  <td>{item.AlternatePhoneNo}</td>
                  <td>{item.NoOfAttempts}</td>
                  <td>{item.LeadTags}</td>
                  <td>{item.LastCallEmployee}</td>
                  <td>{item.LastCallTime}</td>
                  <td>{item.LastCallType}</td>
                  <td>{item.LastCallDuration}</td>
                  <td>{item.LastCallNote}</td>
                  <td>{item.AssignTo}</td>
                  <td>{item.LeadStatus}</td>
                  <td>{item.Reminder}</td>
                  <td>{item.CompanyName}</td>
                  <td>{item.Email}</td>
                  <td>{item.Address1}</td>
                  <td>{item.Address2}</td>
                  <td>{item.City}</td>
                  <td>{item.State}</td>
                  <td>{item.Zipcode}</td>
                  <td>{item.Country}</td>
                  <td>{item.Description}</td>
                  <td>{item.Source}</td>
                  <td>{item.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </>
  );
};

export default DisplayData;