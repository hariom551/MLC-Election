import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Row, Form, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

const DaywiseReport = () => {

  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toISOString().split('T')[0]; // 
    }
    return '';
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('content');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportDetails, setReportDetails] = useState([]);

  const [name, setName] = useState('');
  const [api, setApi] = useState('');

 
  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/v1/subadmin/staffname', {
          method: 'POST',
          body: JSON.stringify({userId}),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.length > 0) {
          setName(data[0].name);
          console.log(data[0].role)
          if(data[0].role==="Feeding Staff")
         {   setApi (`/api/v1/subadmin/daywisereport`)
         }
          else
         {setApi(`/api/v1/subadmin/QCdaywisereport`)
         }
        } else {
          console.log('No name found');
        }
      } catch (error) {
        toast.error(`Error in updating: ${error.message}`);
      }
    };
    fetchUsername();
  }, [userId]);


  const handleSubmit =async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(api, {
        method: 'POST',
        body: JSON.stringify({startDate,endDate,userId}),
        headers: { 'Content-Type': 'application/json' },
      });
      if(!response.ok){
        toast.error(`Error in fetching data:${response.statusText}`)
      }
      const data = await response.json();
      setReportDetails(data);
      toast.success("Daywise Report fetched successfully.")
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  
  };

  const columns = useMemo(
    () => [
      {
        accessor: (row, index) => index + 1,
        id: 'serialNumber',
        Header: 'S.No',
        size: 5,
        Cell: ({ cell }) => cell.row.index + 1,
      },
      {
        accessorKey: 'formatted_date',
        header: 'Date',
        size: 100,
      },
      {
        accessorKey: 'Total',
        header: 'Total',
        size: 100,
      },
    ],
    []
  );

  return (
    <main className='bg-gray-100'>
      <ToastContainer />
      <div className='container py-4 px-6 text-black'>
        <Form className='daywise-report-form' onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <h1 className='text-2xl font-bold mb-4'>Daywise Report</h1>
            </Col>
            <Col className='text-center text-slate-700  text-2xl font-bold '>{name}</Col>
          </Row>
          <Row className='mb-3'>
            <Col md={3} className='mb-3'>
              <Form.Label className='block mb-2'>Start Date:</Form.Label>
              <input
                type='date'
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
                className='form-control border rounded-md p-2 w-full'
              />
            </Col>
            <Col md={3} className='mb-3'>
              <Form.Label className='block mb-2'>End Date:</Form.Label>
              <input
                type='date'
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
                className='form-control border rounded-md p-2 w-full'
              />
            </Col>
            <Col md={3} className='mb-3 flex items-end'>
              <Button
                variant='primary'
                type='submit'
                className='w-full py-2'
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <hr className='my-4' />
        <h4 className='container mt-3 text-xl font-bold mb-3'>Report List</h4>
        <div className='overflow-x-auto'>
          <MaterialReactTable columns={columns} data={reportDetails} />
        </div>
      </div>
    </main>
  );
};

export default DaywiseReport;
