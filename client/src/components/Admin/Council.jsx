import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

function Council() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [councilDetails, setCouncilDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    ECouncil: '',
    HCouncil: '',
    EName: '',
    TehId: ''
  });

  const [tehsilOptions, setTehsilOptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")); // Parse the user object from localStorage
  const DId = user ? user.DId : '';
  const loginUserId = user.userid;

  const fetchTehsilOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/tehsilDetails/${DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Tehsil options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid Tehsil options data');
      }
      const options = data.map(tehsil => ({ value: tehsil.Id, label: tehsil.EName }));
      setTehsilOptions(options);
    } catch (error) {
      toast.error('Error fetching Tehsil options:', error);
    }
  };

  const fetchCouncilDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/councilDetails/${DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Council details');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid Council details data');
      }
      setCouncilDetails(data);
      if (content) {
        const Council = data.find(item => item.Id == content);
        if (Council) {
          setFormData(Council);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast.error(`Council with ID ${content} not found`);
        }
      }
    } catch (error) {
      toast.error('Error fetching Council data:', error);
    }
  };

  useEffect(() => {
    fetchTehsilOptions();
    fetchCouncilDetails();
  }, [DId, content]);

  const resetFormData = () => {
    setFormData({
      Id: '',
      ECouncil: '',
      HCouncil: '',
      EName: '',
      TehId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/addCouncil`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("Council Added Successfully.");
        resetFormData();
        await fetchCouncilDetails(); // Refresh the table data
      } else {
        toast.error("Error in Adding Council:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding Council:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/updateCouncilDetail`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("Council Updated successfully.");
        resetFormData(); 
        await fetchCouncilDetails(); 
        window.location.href='/Council'
      } else {
        toast.error("Error in Updating Council:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating :", error.message);
    }
  };

  const handleDelete = async (Id) => {
    try {
      let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Admin/deleteCouncilDetail`, {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("Council Deleted Successfully.");
        await fetchCouncilDetails(); // Refresh the table data
      } else {
        toast.error("Error in Deleting Council:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Deleting Council:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'Id',
      header: 'S.No',
      size: 5,
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <>
          <Button variant="primary" className="changepassword">
            <Link
              to={{ pathname: "/Council", search: `?content=${row.original.Id}` }}
            >
              Edit
            </Link>
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>
            Delete
          </Button>
        </>
      ),
    },
    {
      accessorKey: 'EName',
      header: 'Tehsil',
      size: 20,
    },
    {
      accessorKey: 'ECouncil',
      header: 'Nikaya Name (English)',
      size: 20,
    },
    {
      accessorKey: 'HCouncil',
      header: 'Nikāya Name (Hindi)',
      size: 20,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: councilDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add Council</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="Council-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select Tehsil<sup className='text-red-600'>*</sup></Form.Label>
                <Select
                  id="tehsilSelect"
                  name="TehId"
                  value={tehsilOptions.find(option => option.value === formData.TehId)}
                  onChange={option => setFormData(prevFormData => ({ ...prevFormData, TehId: option.value }))}
                  options={tehsilOptions}
                  placeholder="Select Tehsil"
                />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Nikāya Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Nikaya Name (English)" id="ECouncil" name="ECouncil" value={formData.ECouncil} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Nikāya Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Nikāya Name (Hindi)" id="HCouncil" name="HCouncil" value={formData.HCouncil} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">Nikāya List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default Council;
