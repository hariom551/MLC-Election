import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import { validateUserForms } from '../../Validation/userFormValidatation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

function UserForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user.userid;
  const DId = user.DId;
  const userrole = user.role;
  const permission = user.permissionaccess;

  const [userData, setUserData] = useState([]);

  const initialFormData = {
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile1: '',
    mobile2: '',
    email: '',
    address: '',
    permission: '',
    DId: DId ? DId : ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const token = localStorage.getItem('token');

  const [district, setDistrict] = useState([]);
  
  // Function to fetch district options
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

      const options = data.map(District => ({ value: District.Id, label: District.EDistrict }));
      setDistrict(options);

    } catch (error) {
      toast.error('Error fetching District options:', error);
    }
  };

  // Function to fetch user data
  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/hariom`, {
        method: 'POST',
        body: JSON.stringify({ role: content, loginUserId }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      toast.error('Error fetching user data: ' + error.message);
    }
  };

  useEffect(() => {
    fetchDistrictOptions();
    fetchData(); // Fetch user data on component mount
  }, [content]); // Run only once

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const error = validateUserForms(name, value, formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formHasErrors = false;
    const newErrors = {};
    for (let key in formData) {
      const error = validateUserForms(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
        formHasErrors = true;
      }
    }
    setErrors(newErrors);

    if (formHasErrors) {
      toast.error("Please fix the validation errors");
      return;
    }

    const requestBody = {
      ...formData,
      loginUserId,
      role: content
    };

    try {
      let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/submitdetails`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (result.ok) {
        toast.success('Form submitted successfully.');
        setFormData(initialFormData);
        fetchData(); // Refresh user data after submission
      } else {
        toast.error("Error submitting form: " + result.statusText);
      }
    } catch (error) {
      toast.error("Error submitting form: " + error.message);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'Serial No',
        header: 'S.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'userid',
        header: 'UserID',
        size: 20,
      },
      {
        accessorKey: 'password',
        header: 'Password',
        size: 20,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 50,
      },
      {
        accessorKey: 'mobile1',
        header: 'Mobile1',
        size: 10,
      },
      {
        accessorKey: 'mobile2',
        header: 'Mobile2',
        size: 10,
      },
      {
        accessorKey: 'email',
        header: 'E-Mail Id',
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 150,
      },
      {
        accessorKey: 'permissionaccess',
        header: 'Permission',
        size: 50,
      },
      
    ]
   
    if (permission !== '0'){
      baseColumns.push({
      accessorKey: 'changePassword',
      header: 'Change Password',
      size: 150,
      Cell: ({ row }) => (
        <Button variant="primary" className="changepassword">
          <Link
            to={{ pathname: "/changePassword", search: `?content=${row.original.userid}` }}
          >
            Change Password
          </Link>
        </Button>
      ),
    })
    }
    return baseColumns;
  },[permission]);
  

  const table = useMaterialReactTable({
    columns,
    data: userData,
  });

  return (
    <main className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="container mx-auto py-8 text-black">
      {permission !== '0' && (
          <>
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-bold mb-4">Add {content}</h1>
          <p className='text-sm font-serif'><sup>*</sup>fields are required</p>
        </div>
        <Form onSubmit={handleSubmit} className="user-form">
          <h1 className='text-lg font-bold mb-3'>Login Credentials</h1>
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>userId <sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter userId"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                />
                {errors.userId && <div className="text-danger">{errors.userId}</div>}
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Password<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Confirm Password<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
              </Form.Group>
            </div>
          </Row>

          <hr />

          <h3 className='text-lg font-bold mt-3 mb-3'>User Information</h3>
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Name<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Mobile Number 1<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Mobile Number 1"
                  id="mobile1"
                  name="mobile1"
                  value={formData.mobile1}
                  onChange={handleChange}
                />
                {errors.mobile1 && <div className="text-danger">{errors.mobile1}</div>}
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Mobile Number 2</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Mobile Number 2"
                  id="mobile2"
                  name="mobile2"
                  value={formData.mobile2}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Email Id</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email Id"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            {userrole === "Super Admin" &&
              <div className="col-md-3 mb-3">
                <Form.Group>
                  <Form.Label>Select District<sup className='text-red-600'>*</sup></Form.Label>
                  <Select
                    id="DistrictSelect"
                    name="DId"
                    value={district.find(option => option.value === formData.DId)}
                    onChange={option => setFormData(prevFormData => ({ ...prevFormData, DId: option.value }))}
                    options={district}
                    placeholder="Select District"
                  />
                </Form.Group>
              </div>
            }
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Permission:</Form.Label>
                <Form.Select
                  name="permission"
                  id="permission"
                  value={formData.permission}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Access</option>
                  <option value="0">Read</option>
                  <option value="1">Write</option>
                  <option value="2">Execute</option>
                </Form.Select>
                {errors.permission && <div className="text-danger">{errors.permission}</div>}
              </Form.Group>
            </div>

            <input type="hidden" id="role" name="role" value={content} />
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <hr className="my-4" />
        </>
        )
        }
        <h4 className="container mt-3 text-xl font-bold mb-2">{content} Detail </h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default UserForm;
