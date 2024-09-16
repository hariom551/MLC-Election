import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import DistrictSelect from '../Pages/DistrictSelect';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AreaVill() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let content = searchParams.get('content');

  const [AreaVillDetails, setAreaVillDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EAreaVill: '',
    HAreaVill: '',
    HnoRange: '',
    EWardBlock: '',
    WBID: '',
    CBPId: '',
    ECBPanch: '',
    DId: ''
  });

  const [wbOptions, setWBOptions] = useState([]);
  const [cbOptions, setCBOptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loginUserId = user.userid;
  const permission = user.permissionaccess;
  const navigate = useNavigate();
  const fetchWBOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/wardBlockDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Ward block options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid Ward block options data');
      }

      const options = data.map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }));
      setWBOptions(options);
    } catch (error) {
      toast.error('Error fetching wb options:', error);
    }
  };

  const fetchCBOptions = async (wbId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/chakBlockDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chakblock options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid chakblock options data');
      }

      const options = data
        .filter(CB => CB.WBId == wbId)
        .map(CB => ({ value: CB.Id, label: CB.ChakNo + "  - " + CB.ECBPanch }));

      setCBOptions(options);
    } catch (error) {
      toast.error('Error fetching CB options:', error);
    }
  };

  const fetchAreaVillDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/AreaVillDetails/${formData.DId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AreaVill details');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid AreaVill details data');
      }
      setAreaVillDetails(data);
      if (content) {
        const AreaVill = data.find(item => item.Id == content);
        if (AreaVill) {
          setFormData({
            Id: AreaVill.Id,
            WBID: AreaVill.WBId,
            EAreaVill: AreaVill.EAreaVill,
            HAreaVill: AreaVill.HAreaVill,
            HnoRange: AreaVill.HnoRange,
            EWardBlock: AreaVill.EWardBlock,
            CBPId: AreaVill.CBPId,
            ECBPanch: AreaVill.ECBPanch,
            DId: AreaVill.DId
          });

          fetchCBOptions(AreaVill.WBId);
        } else {
          toast.error(`AreaVill with ID ${content} not found`);
        }
      }
    } catch (error) {
      toast.error('Error fetching AreaVill data:', error);
    }
  };

  useEffect(() => {
    if (formData.DId) {
      fetchWBOptions();
      fetchAreaVillDetails();
    }
  }, [formData.DId]);


  useEffect(() => {
    if (content) {
      fetchAreaVillDetails();
    }
  }, [content]);


  const resetFormData = () => {
    setFormData({
      Id: '',
      EAreaVill: '',
      HAreaVill: '',
      HnoRange: '',
      EWardBlock: '',
      WBID: '',
      CBPId: '',
      ECBPanch: '',
      DId: formData.DId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/addAreaVill`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("AreaVill Added Successfully.");
        resetFormData();
        await fetchAreaVillDetails();
      } else {
        toast.error("Error in Adding AreaVill:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding AreaVill:", error.message);
    }
  };

  const handleChange = (input, name) => {

    if (input?.target) {

      const { name, value } = input.target;

      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    } else {

      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: input.value
      }));

      if (name === 'WBID') {
        fetchCBOptions(input.value);
      }
    }
  };


  const handleDelete = async (Id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Admin/deleteAreaVillDetail`, {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete AreaVill');
      }

      toast.success("AreaVill deleted successfully.");
      // await fetchAreaVillDetails(); 
    } catch (error) {
      toast.error("Error deleting AreaVill:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/updateAreaVillDetail`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, loginUserId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("AreaVill Updated successfully.");
        content = '';
        resetFormData();
        await fetchAreaVillDetails();
        // navigate('/AreaVill')
        navigate('/AreaVill');

      } else {
        toast.error("Error in Updating AreaVill:", result.statusText);
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
        accessorKey: 'ECBPanch',
        header: 'Chak Block',
        size: 20,
      },
      {
        accessorKey: 'EAreaVill',
        header: 'AreaVill Name (English)',
        size: 20,
      },
      {
        accessorKey: 'HAreaVill',
        header: 'AreaVill Name (Hindi)',
        size: 20,
      },
      {
        accessorKey: 'HnoRange',
        header: 'HNo Range',
        size: 5,
      },
    ];

    if (permission !== '0') {
      baseColumns.unshift({
        accessorKey: 'Action',
        header: 'Action',
        size: 10,
        Cell: ({ row }) => (
          <>
            <Button variant="primary" className="changepassword">
              <Link to={{ pathname: "/AreaVill", search: `?content=${row.original.Id}` }}>Edit</Link>
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
    data: AreaVillDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        {permission !== '0' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Add AreaVill</h1>
            <Form onSubmit={content ? handleEdit : handleSubmit} className="AreaVill-form">
              <DistrictSelect
                formData={formData}
                handleChange={handleChange}
                onDistrictChange={() => {
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    WBId: null
                  }));
                  setWBOptions([]);
                }}
              />


              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Select Ward Block</Form.Label>
                    <Select
                      id="wbSelect"
                      name="WBID"
                      value={wbOptions.find(option => option.value == formData.WBID)}
                      onChange={(selectedOption) => handleChange(selectedOption, 'WBID')}
                      options={wbOptions}
                      placeholder="Select Ward Block"
                      isSearchable={true}
                      required
                    />

                  </Form.Group>
                </div>

                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Select Chak Block<sup className='text-red-600'>*</sup></Form.Label>
                    <Select
                      id="CBSelect"
                      name="CBPId"
                      value={cbOptions.find(option => option.value === formData.CBPId)}
                      onChange={(selectedOption) => handleChange(selectedOption, 'CBPId')}
                      options={cbOptions}
                      placeholder="Select Chak Block"
                      isSearchable={true}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>Hno Range</Form.Label>
                    <Form.Control type="text" placeholder="Hno Range" id="HnoRange" name="HnoRange" value={formData.HnoRange} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, HnoRange: e.target.value }))} />
                  </Form.Group>
                </div>
              </Row>

              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>AreaVill Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Control type="text" placeholder="AreaVill Name (English)" id="EAreaVill" name="EAreaVill" value={formData.EAreaVill} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, EAreaVill: e.target.value }))} required />
                  </Form.Group>
                </div>
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>AreaVill Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                    <Form.Control type="text" placeholder="AreaVill Name (Hindi)" id="HAreaVill" name="HAreaVill" value={formData.HAreaVill} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, HAreaVill: e.target.value }))} required />
                  </Form.Group>
                </div>
              </Row>

              <Button variant="primary" type="submit">
                {content ? 'Update' : 'Submit'}
              </Button>
            </Form>
          </>)
        }
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">AreaVill List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default AreaVill;
