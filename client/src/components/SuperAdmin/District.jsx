import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const District = () => {
  const [districtDetails, setDistrictDetails] = useState([]);
  const [formData, setFormData] = useState({
    DistCode: '',
    EDistrict: '',
    HDistrict: '',
    ESGraduate: "Kanpur Division",
    HSGraduate: 'कानपुर खण्ड'
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user ? user.userid : '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/getDistrictDetails`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch district data');
      }

      const data = await response.json();
      setDistrictDetails(data);
    } catch (error) {
      toast.error(`Error fetching district data: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      ...formData,
      loginUserId
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/addDistrict`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success("District added successfully.");
        setFormData({
          DistCode: '',
          EDistrict: '',
          HDistrict: '',
          ESGraduate: "Kanpur Division",
          HSGraduate: 'कानपुर खण्ड'
        });
      
        fetchData();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.error(`Error adding district: ${error.message}`);
    }
  };

  const handleDelete = async (DistCode) => {
    try {
      const response = await fetch(`/api/v1/users/deleteDistrictDetail`, {
        method: 'POST',
        body: JSON.stringify({ DistCode }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success("District deleted successfully.");
        fetchData(); 
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.error(`Error deleting district: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user?.role === 'Super Admin') {
      fetchData();
    }
  }, [user]);

  const columns = useMemo(() => [
    {
      accessorKey: 'index',
      header: 'S.No',
      size: 10,
      Cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <>
          <Button variant="primary" className="edit">
            <Link to={{ pathname: "/editDistrictDetails", search: `?content=${row.original.DistCode}` }}>
              Edit
            </Link>
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.original.DistCode)} className="delete">
            Delete
          </Button>
        </>
      ),
    },
    {
      accessorKey: 'DistCode',
      header: 'District Code',
      size: 10,
    },
    {
      accessorKey: 'EDistrict',
      header: 'District Name (English)',
      size: 50,
    },
    {
      accessorKey: 'HDistrict',
      header: 'District Name (Hindi)',
      size: 50,
    },
    {
      accessorKey: 'ESGraduate',
      header: 'Constituencies (English)',
      size: 50,
    },
    {
      accessorKey: 'HSGraduate',
      header: 'Constituencies (Hindi)',
      size: 50,
    }
  ], []);

  const table = useMaterialReactTable({ columns, data: districtDetails });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add District</h1>
        <Form onSubmit={handleSubmit} className="District-form">
          <Row className="mb-3">
            {['DistCode', 'EDistrict', 'HDistrict', 'ESGraduate', 'HSGraduate'].map((field, index) => (
              <div className="col-md-3 mb-3" key={field}>
                <Form.Group>
                  <Form.Label>
                    {field.replace(/([A-Z])/g, ' $1')}<sup className='text-red-600'>*</sup>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${field}`}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            ))}
          </Row>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-2">District</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
};

export default District;
