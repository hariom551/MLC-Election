import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Box, Button as MUIButton } from '@mui/material';
import Button from 'react-bootstrap/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

function PollingStationAllotment() {
  const [PSListDetails, setPSListDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: '',
    WBId: '',
    TotalVoters: '0',
    PSNo: '',
    ESPName: '',
    RoomNo: '',
    VtsFrom: '',
    VtsTo: '',
  });
  const [loadingTotalVoters, setLoadingTotalVoters] = useState(false); // Loading state for total voters

  const user = JSON.parse(localStorage.getItem("user"));
  const DId = user ? user.DId : '';
  const loginUserId = user.userid;
  const [WBOptions, setWBOptions] = useState([]);

  useEffect(() => {

    const fetchWBOptions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/wardBlockDetails/${DId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch wardblock options');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid wardblock options data');
        }
        const options = data.map(wb => ({ value: wb.Id, label: wb.WardNo + ' - ' + wb.EWardBlock }));
        setWBOptions(options);
      } catch (error) {
        toast.error('Error fetching wardblock options:', error);
      }
    };

    fetchWBOptions();
  }, []);

  useEffect(() => {
    const fetchTotalVoters = async () => {
      if (formData.WBId) {
        setLoadingTotalVoters(true);
        try {

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/getTotalVoters`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ WBId: formData.WBId })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch total voters');
          }

          const data = await response.json();

          if (data && data.data && data.data.length > 0 && data.data[0].TotalVoters !== undefined) {
            const totalVoters = data.data[0].TotalVoters;
            setFormData(prevFormData => ({
              ...prevFormData,
              TotalVoters: totalVoters.toString()
            }));
          }
        } catch (error) {
          toast.error(`Error fetching total voters: ${error.message}`);
        } finally {
          setLoadingTotalVoters(false);
        }
      }
    };

    fetchTotalVoters();
  }, [formData.WBId]);


  const loadPSNoOptions = async (inputValue) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/searchPSNo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: inputValue })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch PS No options');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        return data.map(ps => ({
          value: ps.PSNo,
          label: ps.PSNo,
          ESPName: ps.EPSName,
          RoomNo: ps.RoomNo,

          details: {
            ESPName: ps.EPSName,
            RoomNo: ps.RoomNo
          }
        }));
      } else {
        toast.log('No PS No options found.');
        return [];
      }

    } catch (error) {
      toast.error('Error fetching PS No options:', error);
      return [];
    }
  };

  const handlePSNoChange = async (selectedOption) => {
    if (!selectedOption) {
      // Reset related fields if no PS No. is selected
      setFormData(prevFormData => ({
        ...prevFormData,
        PSNo: '',
        ESPName: '',
        RoomNo: '',
      }));
      return;
    }

    const { value: psNo, details } = selectedOption;

    setFormData(prevFormData => ({
      ...prevFormData,
      PSNo: psNo,
      ESPName: details.ESPName,
      RoomNo: details.RoomNo,
    }));
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/pSAllotDetails`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Polling Station Allotment details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          toast.info('No Polling Station Allotment details available.'); 
          return; 
        }
        setPSListDetails(data);
      } catch (error) {
        toast.error('Error fetching Polling Station Allotment data: ' + error.message);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/addPSA`, {
        method: 'POST',
        body: JSON.stringify({...formData, loginUserId}),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("PollingStationAllotment Added Successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding PollingStationAllotment:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding PollingStationAllotment:", error.message);
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
      let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/deletePSListDetail`, {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("PollingStationAllotment deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in deleting PollingStationAllotment:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in deleting PollingStationAllotment:", error.message);
    }
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExport = (rows, format) => {
    if (format === 'csv') {
      const csv = generateCsv(csvConfig)(rows.map(row => row.original));
      download(csvConfig)(csv);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableData = rows.map(row => Object.values(row.original));
      const tableHeaders = columns.map(c => c.header);
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
      });
      doc.save('PollingStationAllotment-export.pdf');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'Id',
      header: 'S.No',
      size: 10,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <>
          <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>
            Delete
          </Button>
        </>
      ),
    },
    {
      accessorKey: 'PSNo',
      header: 'PS No.',
      size: 20,
    },
    {
      accessorKey: 'ESPName',
      header: 'PS Name',
      size: 20,
    },
    {
      accessorKey: 'ESPArea',
      header: 'PS Area (English)',
      size: 20,
    },
    {
      accessorKey: 'WardNo',
      header: 'Ward No',
      size: 20,
    },
    {
      accessorKey: 'EWardBlock',
      header: 'Ward Name',
      size: 20,
    },
    {
      accessorKey: 'VtsFrom',
      header: 'From',
      size: 20,
    },
    {
      accessorKey: 'VtsTo',
      header: 'To',
      size: 20,
    },
  ], []);



  const table = useMaterialReactTable({
    columns,
    data: PSListDetails,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <MUIButton
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExport(table.getPrePaginationRowModel().rows, 'csv')}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data (CSV)
        </MUIButton>
        <MUIButton
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExport(table.getPrePaginationRowModel().rows, 'pdf')}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data (PDF)
        </MUIButton>
      </Box>
    ),
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Polling Station Allotment</h1>
        <Form onSubmit={handleSubmit} className="PollingStationAllotment-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select WardBlock<sup className='text-red-600'>*</sup></Form.Label>
                <Select
                  id="WBSelect"
                  name="WBId"
                  value={WBOptions.find(option => option.value === formData.WBId)}
                  onChange={option => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      WBId: option.value
                    }));
                  }}
                  options={WBOptions}
                  placeholder="Select WardBlock"
                />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Total Voters<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control
                  type="text"
                  id="TotalVoters"
                  name="TotalVoters"
                  value={loadingTotalVoters ? 'Loading...' : formData.TotalVoters} // Display loading text
                  onChange={handleChange}
                  required
                  readOnly
                />
              </Form.Group>
            </div>
          </Row>

          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS No.<sup className='text-red-600'>*</sup></Form.Label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={inputValue => {
                    if (inputValue) {
                      return loadPSNoOptions(inputValue);
                    }
                    return [];
                  }}
                  onChange={handlePSNoChange}
                  defaultOptions
                  value={formData.PSNo ? { value: formData.PSNo, label: formData.PSNo } : null}
                  placeholder="Type to search PS No."
                />
              </Form.Group>
            </div>


            <div className="col-md-5 mb-3">
              <Form.Group>
                <Form.Label>PS Name<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS Name" id="ESPName" name="ESPName" value={formData.ESPName} onChange={handleChange} readOnly />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Room No.<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Room No." id="RoomNo" name="RoomNo" value={formData.RoomNo} onChange={handleChange} readOnly />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Voter Serial From<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Voter Serial From" id="VtsFrom" name="VtsFrom" value={formData.VtsFrom} onChange={handleChange} required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Voter Serial To<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Voter Serial To" id="VtsTo" name="VtsTo" value={formData.VtsTo} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">PollingStationAllotment List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default PollingStationAllotment;
