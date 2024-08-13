import React, { useMemo, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button as MUIButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { exportToCsv } from 'export-to-csv';

const MISPollingStation = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
  };

  const filterData = (option) => {
    let newFilteredData;
    if (option === 'all') {
      newFilteredData = data;
    } else if (option === 'motherRole') {
      newFilteredData = data.slice(0, Math.ceil(data.length / 2));
    } else if (option === 'supplementary') {
      newFilteredData = data.slice(Math.ceil(data.length / 2));
    }
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    if (selectedOption !== null) {
      filterData(selectedOption);
    } else {
      setFilteredData([]);
    }
  }, [selectedOption]);

  const columns = useMemo(() => [
    { accessorKey: 'serialNo', header: 'SNo', size: 10 },
    { accessorKey: 'psNo', header: 'PS No', size: 20 },
    { accessorKey: 'wardNo', header: 'Ward No', size: 30 },
    { accessorKey: 'psname', header: 'PS Name', size: 30 },
    { accessorKey: 'psname_hindi', header: 'PS Name(Hindi)', size: 40 },
    { accessorKey: 'roomno', header: 'Room No.', size: 10 },
    { accessorKey: 'psarea', header: 'PS Area', size: 10 },
    { accessorKey: 'psarea_hindi', header: 'PS Area(Hindi)', size: 10 },
    { accessorKey: 'noofvoter', header: 'No Of Voters', size: 10 },
  ], []);

  const data = useMemo(() => [
    { serialNo: 1, psNo: '001', wardNo: 'W1', psname: 'PS1', psname_hindi: 'पीएस1', roomno: '101', psarea: 'Area1', psarea_hindi: 'क्षेत्र1', noofvoter: 1000 },
    // Add more rows as needed
  ], []);

  const handleExport = (rows, format) => {
    const exportData = rows.map(row => ({
      "SNo": row.serialNo,
      "PS No": row.psNo,
      "Ward No": row.wardNo,
      "PS Name": row.psname,
      "PS Name(Hindi)": row.psname_hindi,
      "Room No.": row.roomno,
      "PS Area": row.psarea,
      "PS Area(Hindi)": row.psarea_hindi,
      "No Of Voters": row.noofvoter,
    }));

    // if (format === 'csv') {
    //   try {
    //     const csvExporter = new exportToCsv({
    //       filename: 'district_mis',
    //       fieldSeparator: ',',
    //       decimalSeparator: '.',
    //       showLabels: true,
    //       useKeysAsHeaders: true,
    //     });

    //     const csv = csvExporter.generateCsv(exportData);
    //     csvExporter.downloadCsv(csv);
    //     console.log('Exporting to CSV:', exportData);
    //   } catch (error) {
    //     console.error('Error generating CSV:', error);
    //   }
    // } else if (format === 'pdf') {
    //   try {
    //     const doc = new jsPDF();
    //     const tableData = exportData.map(row => Object.values(row));
    //     const tableHeaders = Object.keys(exportData[0]);
    //     autoTable(doc, { head: [tableHeaders], body: tableData });
    //     doc.save('district_mis.pdf');
    //     console.log('Exporting to PDF:', exportData);
    //   } catch (error) {
    //     console.error('Error generating PDF:', error);
    //   }
    // }
  };

  return (
    <main className='bg-gray-100'>
      <ToastContainer />
      <div className='container py-3 pl-6 text-black'>
        <Row className='align-items-center mb-4'>
          <Col>
            <h1 className='text-2xl font-bold mb-4'>MIS Polling Station</h1>
          </Col>
          <Col className='text-right'>
            <Form className='MISDistrict-form'>
              <Form.Group>
                <div className='d-flex justify-content-end'>
                  <Form.Check
                    type="radio"
                    label="All"
                    name="options"
                    value="all"
                    checked={selectedOption === 'all'}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Mother Role"
                    name="options"
                    value="motherRole"
                    checked={selectedOption === 'motherRole'}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Supplementary"
                    name="options"
                    value="supplementary"
                    checked={selectedOption === 'supplementary'}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                </div>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <hr className='my-4' />
        <h4 className='mt-3 text-xl font-bold mb-3'>MIS Pollingstation List</h4>
        <div className='overflow-x-auto'>
          <MaterialReactTable
            columns={columns}
            data={filteredData}
            options={{
              columnFilterDisplayMode: 'popover',
              paginationDisplayMode: 'pages',
            }}
            renderTopToolbarCustomActions={() => (
              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  padding: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <MUIButton
                  disabled={filteredData.length === 0}
                  onClick={() => handleExport(filteredData, 'csv')}
                  startIcon={<FileDownloadIcon />}
                >
                  Export All Data (CSV)
                </MUIButton>
                <MUIButton
                  disabled={filteredData.length === 0}
                  onClick={() => handleExport(filteredData, 'pdf')}
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

export default MISPollingStation;
