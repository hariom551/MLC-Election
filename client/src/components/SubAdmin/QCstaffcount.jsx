import {  MaterialReactTable } from 'material-react-table';
import React, { useMemo, useState } from 'react';
import { Row, Form, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Box, Button as MUIButton } from '@mui/material';
const QCstaffcount = () => {


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [qcstaff, setQcstaff] = useState([]);          
  const token = localStorage.getItem('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subadmin/qcstaffcount`, {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        toast.error(`Error in fetching the data: ${response.statusText}`);
        setQcstaff('');
        return;
      }
  
      const data = await response.json();
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid data');
      }
  
      setQcstaff(data);
      toast.success("QC staff count list fetched successfully.");
      
    } catch (error) {
      toast.error(`Error fetching QC staff details: ${error.message}`);
      setQcstaff(''); // Reset state in case of error
    }
  };
  

  const columns = useMemo(() => [
    {
      accessorKey: "Id",
      header: 'SNo.',
      size: 60,
      Cell: ({ cell }) => cell.row.index + 1,
    },
    {
      accessorKey: "name",
      header: 'Name',
      size: 100,
      Cell: ({ row }) => (
        <Link 
          to={`/daywisereport?content=${row.original.userid}`} 
          className="btn btn-link" 
        >
          {row.original.name}
        </Link>
      )
    },
    {
      accessorKey: "mobile1",
      header: 'Mobile No.',
      size: 60,
    },
    {
      accessorKey: "user_count",
      header: 'Total',
      size: 100,
    }
  ], []);

  const csvConfig = mkConfig({
    filename: 'feeding_staff_count',
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

 const handleExport = (rows, format) => {
  const exportData = rows.map((row, index) => ({
    "SNo.": index + 1,
    "Name": row.name,
    "Mobile No.": row.mobile1,
    "Total": row.user_count,
  }));

  if (format === 'csv') {
    try {
      const csv = generateCsv(csvConfig)( exportData);
      download(csvConfig)(csv);
      console.log('Exporting to CSV:', exportData);
    } catch (error) {
      toast.error('Error generating CSV:', error);
    }
  } else if (format === 'pdf') {
    try {
      const doc = new jsPDF();
      const tableData = exportData.map(row => Object.values(row));
      const tableHeaders = ["SNo.", "Name", "Mobile No.", "Total"];
      autoTable(doc, { head: [tableHeaders], body: tableData });
      doc.save('feeding_staff_count.pdf');
      console.log('Exporting to PDF:', exportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
};

  return (
    <main className='bg-gray-100'>
      <ToastContainer />
      <div className='container py-4 px-6 text-black'>
        <h1 className='text-2xl font-bold mb-4'>QC Staff </h1>
        <Form className="feeding-staff-form" onSubmit={handleSubmit}>
          <Row className='mb-3'>
            <Col md={3} className='mb-3'>
              <Form.Label className='block mb-2'>Start Date:</Form.Label>
              <input
                type='date'
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md p-2 w-full"
              />
            </Col>
            <Col md={3} className='mb-3'>
              <Form.Label className='block mb-2'>End Date:</Form.Label>
              <input
                type='date'
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md p-2 w-full"
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
        
        <div className='overflow-x-auto'>
          <MaterialReactTable
            columns={columns}
            data={qcstaff}
            options={{
              columnFilterDisplayMode:"popover",
              paginationDisplayMode:'pages',
            
            }}
            renderTopToolbarCustomActions={() => (
                <Box sx={{display:'flex',gap:'16px',padding:'8px',flexWrap:'wrap'}} >
                <MUIButton
                  disabled={qcstaff.length === 0}
                  onClick={() => handleExport(qcstaff, 'csv')}
                  startIcon={<FileDownloadIcon/>}
                >
                   Export All Data (CSV)
                </MUIButton>
                <MUIButton
                  disabled={qcstaff.length === 0}
                  onClick={() => handleExport(qcstaff, 'pdf')}
                  startIcon={<FileDownloadIcon />}
                >
                 Export All Data (PDF)
                </MUIButton>
                </Box>
            )}
          />
        </div>
      </div>
    </main>
  );
};

export default QCstaffcount;
