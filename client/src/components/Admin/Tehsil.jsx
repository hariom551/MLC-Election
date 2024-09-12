import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistrictSelect from '../Pages/DistrictSelect';

function Tehsil() {
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');
  const navigate = useNavigate();

  const [tehsilDetails, setTehsilDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EName: '',
    HName: '',
    DId: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const loginUserId = user.userid;
  const permission = user.permissionaccess;

  const fetchTehsilData = async () => {
    if (!formData.DId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tehsilDetails/${formData.DId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {

        throw new Error('Failed to fetch Tehsil details');
      }

      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        setTehsilDetails([]);
        throw new Error('Empty or invalid Tehsil details data');
      }

      setTehsilDetails(data);

      if (content) {
        const tehsil = data.find((item) => item.Id == content);
        if (tehsil) {
          setFormData(prevFormData => ({
            ...prevFormData,
            ...tehsil
          }));
        } else {
          toast.error(`Tehsil with ID ${content} not found`);
        }
      }
    } catch (error) {
      toast.error(` ${error.message}`);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchTehsilData();
  }, [formData.DId, content]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/addTehsil/${formData.DId}`,
        {
          method: 'POST',
          body: JSON.stringify({ ...formData, loginUserId }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (result.ok) {
        toast.success('Tehsil added successfully.');
        setFormData({ Id: '', EName: '', HName: '', DId: formData.DId });
        fetchTehsilData();
      } else {
        toast.error('Error in adding Tehsil:', result.statusText);
      }
    } catch (error) {
      toast.error('Error in adding Tehsil:', error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/updateTehsilDetail`,
        {
          method: 'POST',
          body: JSON.stringify({ ...formData, loginUserId }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (result.ok) {
       
        await fetchTehsilData();
        setFormData({
          Id: '',
          EName: '',
          HName: '',
          DId: formData.DId
        });
        toast.success('Tehsil updated successfully.');
        setTimeout(() => navigate('/tehsil'), 2000);
      }
      else {
        const errorData = await result.json();
        toast.error(`Error in updating Tehsil: ${errorData.message || result.statusText}`);
      }
    } catch (error) {
      toast.error(`Error in updating: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    console.log("first", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleDelete = async (Id) => {
    try {

      const currentDId = formData.DId;

      let result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/Admin/deleteTehsilDetail`,
        {
          method: 'POST',
          body: JSON.stringify({ Id }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (result.ok) {
        console.log("Delete - Current DId:", formData.DId);
         fetchTehsilData();
        toast.success('Tehsil deleted successfully.');
      } else {
        toast.error('Error in deleting Tehsil:', result.statusText);
      }
    } catch (error) {
      toast.error('Error in deleting Tehsil:', error.message);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'Id',
        header: 'S.No',
        size: 3,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'EName',
        header: 'Tehsil Name (English)',
        size: 15,
      },
      {
        accessorKey: 'HName',
        header: 'Tehsil Name (Hindi)',
        size: 15,
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
              <Link
                to={{ pathname: '/tehsil', search: `?content=${row.original.Id}` }}
              >
                Edit
              </Link>
            </Button>
            {permission === '2' && (
              <Button
                variant="danger"
                onClick={() => handleDelete(row.original.Id)}
                className="delete"
                type="button"
              >
                Delete
              </Button>
            )}
          </>
        ),
      });
    }
    return baseColumns;
  }, [permission]);

  const table = useMaterialReactTable({
    columns,
    data: tehsilDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Tehsil</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="Tehsil-form">
          <DistrictSelect
            formData={formData}
            handleChange={handleChange}
          />

          {permission !== '0' && formData.DId && (
            <>
              <Row className="mb-3">
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>
                      Tehsil Name (English)<sup className="text-red-600">*</sup>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Tehsil Name (English)"
                      id="EName"
                      name="EName"
                      value={formData.EName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3 mb-3">
                  <Form.Group>
                    <Form.Label>
                      Tehsil Name (Hindi)<sup className="text-red-600">*</sup>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Tehsil Name (Hindi)"
                      id="HName"
                      name="HName"
                      value={formData.HName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
              </Row>
              <Button variant="primary" type="submit">
                {content ? 'Update' : 'Submit'}
              </Button>
            </>
          )}
        </Form>

        <hr className="my-4" />



        <h4 className="container mt-3 text-xl font-bold mb-3">Tehsil List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default Tehsil;
