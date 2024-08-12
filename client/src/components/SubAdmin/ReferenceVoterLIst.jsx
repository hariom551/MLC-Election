import { MaterialReactTable } from 'material-react-table';
import React, { useMemo, useState } from 'react';
import { Row, Form, Col, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Box, Button as MUIButton } from '@mui/material';

const ReferenceVoterList = () => {
  const [number, setNumber] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`api/v1/subadmin/referencevoterlist`, {
        method: 'POST',
        body: JSON.stringify({ number }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        toast.error(`Error in fetching data: ${response.statusText}`);
      } else {
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0)
          throw new Error('Empty or invalid data');

        setData(data);
        toast.success("Reference voter list fetched successfully.");
      }
    } catch (error) {
      toast.error(`Error fetching Reference voter details: ${error.message}`);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'Serial No',
        header: 'S. No.',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      { accessorKey: 'Id', header: 'Id', size: 10 },
      { accessorKey: 'EFName', header: 'Name (English)', size: 20,
        Cell: ({ cell }) => {
          const { EFName, ELName } = cell.row.original;
          return `${EFName} ${ELName}`;
        },
      },
      { accessorKey: 'HFName', header: 'Name (Hindi)', size: 20,
        Cell: ({ cell }) => {
          const { HFName, HLName } = cell.row.original;
          return `${HFName} ${HLName}`;
        },
      },
      { accessorKey: 'RType', header: 'Relation', size: 10 },
      { accessorKey: 'ERFName', header: 'Relative Name (English)', size: 20,
        Cell: ({ cell }) => {
          const { ERFName, ERLName } = cell.row.original;
          return `${ERFName} ${ERLName}`;
        },
      },
      { accessorKey: 'HRFName', header: 'Relative Name (Hindi)', size: 20,
        Cell: ({ cell }) => {
          const { HRFName, HRLName } = cell.row.original;
          return `${HRFName} ${HRLName}`;
        },
      },
      {
        accessorKey: 'EAreaVillHNo',
        header: 'Address',
        size: 20,
        Cell: ({ cell }) => {
          const { EAreaVill, HNo } = cell.row.original;
          return `${HNo} ${EAreaVill}`;
        },
      },
      { accessorKey: 'ECaste', header: 'Caste', size: 20 },
      { accessorKey: 'Qualification', header: 'Qualification', size: 20 },
      { accessorKey: 'Occupation', header: 'Occupation', size: 20 },
      { accessorKey: 'Age', header: 'Age', size: 5 },
      { accessorKey: 'DOB', header: 'DOB', size: 10 },
      { accessorKey: 'Sex', header: 'Gender', size: 10 },
      { accessorKey: 'MNo', header: 'Mobile', size: 10 },
      { accessorKey: 'AadharNo', header: 'Aadhar', size: 12 },
      { accessorKey: 'VIdNo', header: 'VoterId', size: 20 },
      { accessorKey: 'GCYear', header: 'Grd.Year', size: 4 },
      {
        accessorKey: 'Image',
        header: 'Photo',
        size: 20,
        Cell: ({ cell }) => {
          const image = cell.getValue();
          if (!image) return 'N/A';
          const imageUrl = `http://localhost:3000/public/photo/${image}`;
          return <img src={imageUrl} alt="voter" style={{ width: '50px', height: '50px' }} />;
        },
      },
      {
        accessorKey: 'Degree',
        header: 'Degree',
        size: 20,
        Cell: ({ cell }) => {
          const degreeUrl = cell.getValue();
          if (!degreeUrl) return 'N/A';
          const imageUrl = `http://localhost:3000/public/Degree/${degreeUrl}`;
          return <img src={imageUrl} alt="degree" style={{ width: '50px', height: '50px' }} />;
        },
      },
      {
        accessorKey: 'IdProof',
        header: 'Id Proof',
        size: 20,
        Cell: ({ cell }) => {
          const idProofUrl = cell.getValue();
          if (!idProofUrl) return 'N/A';
          const imageUrl = `http://localhost:3000/public/IdProof/${idProofUrl}`;
          return <img src={imageUrl} alt="id proof" style={{ width: '50px', height: '50px' }} />;
        },
      },
    ];

    return baseColumns;
  }, []);

  const csvConfig = mkConfig({
    filename: "Reference_voter_list",
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExport = (rows, format) => {
    const exportData = rows.map((row, index) => ({
      "S. No.": index + 1,
      "Id": row.Id,
      "Name (English)": `${row.EFName} ${row.ELName}`,
      "Name (Hindi)": `${row.HFName} ${row.HLName}`,
      "Relation": row.RType,
      "Relative Name (English)": `${row.ERFName} ${row.ERLName}`,
      "Relative Name (Hindi)": `${row.HRFName} ${row.HRLName}`,
      "Address": `${row.EAreaVill} ${row.HNo}`,
      "Caste": row.ECaste,
      "Qualification": row.Qualification,
      "Occupation": row.Occupation,
      "Age": row.Age,
      "DOB": row.DOB,
      "Gender": row.Sex,
      "Mobile": row.MNo,
      "Aadhar": row.AadharNo,
      "VoterId": row.VIdNo,
      "Grd.Year": row.GCYear,
      "Photo": row.Image ? `http://localhost:3000/public/photo/${row.Image}` : 'N/A',
      "Degree": row.Degree ? `http://localhost:3000/public/Degree/${row.Degree}` : 'N/A',
      "IdProof": row.IdProof ? `http://localhost:3000/public/IdProof/${row.IdProof}` : 'N/A',
    }));
  
    if (format === 'csv') {
      try {
        const csv = generateCsv(csvConfig)(exportData);
        download(csvConfig)(csv);
        console.log('Exporting to CSV:', exportData);
      } catch (error) {
        toast.error(`Error generating CSV: ${error.message}`);
      }
    } else if (format === 'pdf') {
      try {
        const doc = new jsPDF('l', 'pt', 'a4'); // Explicitly set portrait mode and A4 paper size
        const tableData = exportData.map(row => Object.values(row));
        const tableHeaders = [
          "S. No.",
          "Id",
          "Name (English)",
          "Name (Hindi)",
          "Relation",
          "Relative Name (English)",
          "Relative Name (Hindi)",
          "Address",
          "Caste",
          "Qualification",
          "Occupation",
          "Age",
          "DOB",
          "Gender",
          "Mobile",
          "Aadhar",
          "VoterId",
          "Grd.Year",
        
        ];
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          margin: { top: 40, left: 30, right: 30, bottom: 30 },
          pageBreak: 'auto', // Automatic page breaking
          styles: {
            overflow: 'linebreak',
            cellPadding: 2,
            fontSize: 8,
          },
        });
        doc.save('Reference_voter_list.pdf');
        console.log('Exporting to PDF:', exportData);
      } catch (error) {
        toast.error(`Error generating PDF: ${error.message}`);
      }
    }
  };
  

  return (
    <main className='bg-gray-100'>
      <ToastContainer />
      <div className='container py-4 px-6 text-black'>
        <h1 className='text-2xl font-bold mb-4'>Reference Voter's Details</h1>
        <Form className='reference-voter-form' onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={3} className='mb-3'>
              <Form.Label className='block mb-2 text-gray-500'>Ref Mobile No<sup>*</sup></Form.Label>
              <input
                type='tel'
                value={number}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setNumber(value);
                  }
                }}
                pattern="\d{10}"
                minLength={10}
                maxLength={10}
                required
                className="border rounded-md p-2 w-full"
              />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col md={3} className='mb-3'>
              <Button variant='primary' type='submit'>
                SUBMIT
              </Button>
            </Col>
          </Row>
        </Form>
        <hr className='my-4' />
        <div className='overflow-x-auto'>
          <MaterialReactTable
            columns={columns}
            data={data}
            options={{
              columnFilterDisplayMode: "popover",
              paginationDisplayMode: 'pages',
            }}
            renderTopToolbarCustomActions={() => (
              <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <MUIButton
                  onClick={() => handleExport(data, 'csv')}
                  startIcon={<FileDownloadIcon />}
                >
                  Export All Data (CSV)
                </MUIButton>
                <MUIButton
                  onClick={() => handleExport(data, 'pdf')}
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
}

export default ReferenceVoterList;
