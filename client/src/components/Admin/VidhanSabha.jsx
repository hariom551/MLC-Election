import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistrictSelect from '../Pages/DistrictSelect';

function VidhanSabha() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let content = searchParams.get('content');
  const navigate = useNavigate();

  const [VidhanSabhaDetails, setVidhanSabhaDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EVidhanSabha: '',
    HVidhanSabha: '',
    VSNo: '',
    EName: '',
    TehId: '',
    counId: '',
    Ecouncil: '',
    DId: ''
  });

  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [councilOptions, setCouncilOptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user.userid;
  const permission = user.permissionaccess;


  const fetchTehsilOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/tehsilDetails/${formData.DId}`, {
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

  const fetchCouncilOptions = async (tehId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/councilDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch council options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid council options data');
      }

      const options = data
        .filter(council => council.TehId == tehId)
        .map(council => ({ value: council.Id, label: council.ECouncil }));

      setCouncilOptions(options);
    } catch (error) {
      toast.error('Error fetching Council options:', error);
    }
  };

  const fetchVidhanSabhaDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/vidhanSabhaDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch VidhanSabha details');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid VidhanSabha details data');
      }
      setVidhanSabhaDetails(data);
      if (content) {
        const VidhanSabha = data.find(item => item.Id == content);
        if (VidhanSabha) {
          setFormData(VidhanSabha);
          fetchCouncilOptions(VidhanSabha.counId);
        } else {
          toast.error(`VidhanSabha with ID ${content} not found`);
        }
      }
    } catch (error) {
      toast.error('Error fetching VidhanSabha data:', error);
    }
  };

  useEffect(() => {
    if (formData.DId) {
      fetchTehsilOptions();
      fetchVidhanSabhaDetails();
    }
  }, [formData.DId]);

  useEffect(() => {
    if (content) {
      fetchVidhanSabhaDetails();
    }
  }, [content]);



  const resetFormData = () => {
    setFormData({
      Id: '',
      EVidhanSabha: '',
      HVidhanSabha: '',
      VSNo: '',
      EName: '',
      TehId: '',
      counId: '',
      Ecouncil: '',
      DId: formData.DId

    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/addVidhanSabha`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("VidhanSabha Added Successfully.");
        resetFormData();
        await fetchVidhanSabhaDetails();
      } else {
        toast.error("Error in Adding VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding VidhanSabha:", error.message);
    }
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     [name]: value
  //   }));

  //   if (name === 'TehId') {
  //     fetchCouncilOptions(value);
  //   }
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'TehId') {
      fetchCouncilOptions(value);
    }
  };



  const handleDelete = async (Id) => {
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Admin/deleteVidhanSabhaDetail`, {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("VidhanSabha Deleted Successfully.");
        // await fetchVidhanSabhaDetails();
      } else {
        toast.error("Error in Deleting VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Deleting VidhanSabha:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/updateVidhanSabhaDetail`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (result.ok) {
        toast.success("VidhanSabha Updated successfully.");
          content = '';
        resetFormData();
        await fetchVidhanSabhaDetails();
      
        
        navigate('/VidhanSabha');

      } else {
        toast.error("Error in Updating VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating :", error.message);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'Id',
        header: 'S.No',
        size: 10,
      },
      {
        accessorKey: 'EName',
        header: 'Tehsil',
        size: 20,
      },
      {
        accessorKey: 'ECouncil',
        header: 'Nikaya',
        size: 20,
      },
      {
        accessorKey: 'VSNo',
        header: 'VSNo',
        size: 5,
      },
      {
        accessorKey: 'EVidhanSabha',
        header: 'VidhanSabha Name (English)',
        size: 20,
      },
      {
        accessorKey: 'HVidhanSabha',
        header: 'VidhanSabha Name (Hindi)',
        size: 20,
      },
    ]

    if (permission !== '0') {
      baseColumns.unshift({
        accessorKey: 'Action',
        header: 'Action',
        size: 10,
        Cell: ({ row }) => (
          <>
            <Button variant="primary" className="changepassword">
              <Link
                to={{ pathname: "/VidhanSabha", search: `?content=${row.original.Id}` }}
              >
                Edit
              </Link>
            </Button>
            {permission == '2' &&
              <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>
                Delete
              </Button>
            }
          </>
        ),
      });
    }

    return baseColumns;
  }, [permission]);


  const table = useMaterialReactTable({
    columns,
    data: VidhanSabhaDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        {permission !== '0' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Add VidhanSabha</h1>
            <Form onSubmit={content ? handleEdit : handleSubmit} className="VidhanSabha-form">
              <DistrictSelect
                formData={formData}
                handleChange={handleChange}
                onDistrictChange={() => {
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    TehId: null
                  }));
                  setTehsilOptions([]);
                }}
              />


              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Select Tehsil<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Select
                      id="tehsilSelect"
                      name="TehId"
                      value={formData.TehId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Tehsil</option>
                      {tehsilOptions.map(option => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Select Nikaya<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Select
                      id="CouncilSelect"
                      name="counId"
                      value={formData.counId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Nikaya</option>
                      {councilOptions.map(option => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-3 mb-3">
                  <Form.Group >
                    <Form.Label>VidhanSabha No<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Control type="text" placeholder="VidhanSabha No" id="VSNo" name="VSNo" value={formData.VSNo} onChange={handleChange} required />
                  </Form.Group>
                </div>
              </Row>

              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group >
                    <Form.Label>VidhanSabha Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Control type="text" placeholder="VidhanSabha Name (English)" id="EVidhanSabha" name="EVidhanSabha" value={formData.EVidhanSabha} onChange={handleChange} required />
                  </Form.Group>
                </div>
                <div className="col-md-3 mb-3">
                  <Form.Group >
                    <Form.Label>VidhanSabha Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Control type="text" placeholder="VidhanSabha Name (Hindi)" id="HVidhanSabha" name="HVidhanSabha" value={formData.HVidhanSabha} onChange={handleChange} required />
                  </Form.Group>
                </div>
              </Row>

              <Button variant="primary" type="submit">
                {content ? 'Update' : 'Submit'}
              </Button>
            </Form>
            <hr className="my-4" />
          </>
        )
        }
        <h4 className="container mt-3 text-xl font-bold mb-3">VidhanSabha List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default VidhanSabha;
