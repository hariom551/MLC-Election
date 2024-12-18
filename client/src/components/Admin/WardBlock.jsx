import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistrictSelect from '../Pages/DistrictSelect';

function WardBlock() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let content = searchParams.get('content');
  const navigate = useNavigate();

  const [WardBlockDetails, setWardBlockDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EWardBlock: '',
    HWardBlock: '',
    WardNo: '',
    EVidhanSabha: '',
    VSId: '',
    DId: ''
  });

  const [vsOptions, setVSOptions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user.userid;
  const permission = user.permissionaccess;

  const fetchVSOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/vidhanSabhaDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vidhanSabha options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No Data Found ');
      }
      const options = data.map(vs => ({
        value: vs.Id,
        label: `${vs.VSNo} - ${vs.EVidhanSabha}`
      }));
      setVSOptions(options);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchWardBlockDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/wardBlockDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch WardBlock details');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No Data Found');
      }
      setWardBlockDetails(data);
      if (content) {
        const WardBlock = data.find(item => item.Id == content);
        if (WardBlock) {
          setFormData(WardBlock);
        } else {
          toast.error(`WardBlock with ID ${content} not found`);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (formData.DId) {
      fetchVSOptions();
      fetchWardBlockDetails();
    }
  }, [formData.DId]);

  useEffect(() => {
    if (content) {
      fetchWardBlockDetails();
    }
  }, [content]);

  const resetFormData = () => {
    setFormData({
      Id: '',
      EWardBlock: '',
      HWardBlock: '',
      WardNo: '',
      EVidhanSabha: '',
      VSId: '',
      DId: formData.DId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/addWardBlock`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success('WardBlock Added Successfully.');
        resetFormData();
        await fetchWardBlockDetails();
      } else {
        toast.error('Error in Adding WardBlock: ' + result.statusText);
      }
    } catch (error) {
      toast.error('Error in Adding WardBlock: ' + error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/updateWardBlockDetails`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success('WardBlock Updated successfully.');

        content = '';
        resetFormData();
        await fetchWardBlockDetails();


        navigate('/WardBlock');

      } else {
        toast.error('Error in Updating WardBlock: ' + result.statusText);
      }
    } catch (error) {
      toast.error('Error in updating: ' + error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleDelete = async (Id) => {
    try {
      let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Admin/deleteWardBlockDetail`, {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success('WardBlock Deleted Successfully.');
        // await fetchWardBlockDetails();
      } else {
        toast.error('Error in Deleting WardBlock: ' + result.statusText);
      }
    } catch (error) {
      toast.error('Error in Deleting WardBlock: ' + error.message);
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
        accessorKey: 'EVidhanSabha',
        header: 'VidhanSabha',
        size: 20,
      },
      {
        accessorKey: 'WardNo',
        header: 'Ward No',
        size: 20,
      },
      {
        accessorKey: 'EWardBlock',
        header: 'WardBlock (English)',
        size: 20,
      },
      {
        accessorKey: 'HWardBlock',
        header: 'WardBlock (Hindi)',
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
              <Link to={{ pathname: "/WardBlock", search: `?content=${row.original.Id}` }}>Edit</Link>
            </Button>
            {permission == '2' &&
              <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type="button">Delete</Button>
            }
          </>
        ),
      });
    }

    return baseColumns;
  }, [permission]);


  const table = useMaterialReactTable({
    columns,
    data: WardBlockDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        {permission !== '0' && (
          <>
            <h1 className="text-2xl font-bold mb-4">{content ? 'Edit WardBlock' : 'Add WardBlock'}</h1>
            <Form onSubmit={content ? handleEdit : handleSubmit} className="WardBlock-form">
              <DistrictSelect
                formData={formData}
                handleChange={handleChange}
                onDistrictChange={() => {
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    VSId: null
                  }));
                  setVSOptions([]);
                }}
              />

              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Select VidhanSabha<sup className="text-red-600">*</sup></Form.Label>
                    <Select
                      id="VSSelect"
                      name="VSId"
                      value={vsOptions.find(option => option.value === formData.VSId)}
                      onChange={option => setFormData(prevFormData => ({ ...prevFormData, VSId: option.value }))}
                      options={vsOptions}
                      placeholder="Select VidhanSabha"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Ward No<sup className="text-red-600">*</sup></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ward No"
                      id="WardNo"
                      name="WardNo"
                      value={formData.WardNo}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
              </Row>
              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>WardBlock Name (English)<sup className="text-red-600">*</sup></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="WardBlock Name (English)"
                      id="EWardBlock"
                      name="EWardBlock"
                      value={formData.EWardBlock}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>WardBlock Name (Hindi)<sup className="text-red-600">*</sup></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="WardBlock Name (Hindi)"
                      id="HWardBlock"
                      name="HWardBlock"
                      value={formData.HWardBlock}
                      onChange={handleChange}
                      required
                    />
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
        <h4 className="container mt-3 text-xl font-bold mb-3">WardBlock List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default WardBlock;
