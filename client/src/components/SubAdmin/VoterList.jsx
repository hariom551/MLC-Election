import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';
import DistrictSelect from '../Pages/DistrictSelect';

function VoterList() {
    const [votersDetails, setVotersDetails] = useState([]);
    const [formData, setFormData] = useState({ DId: '', WBId: undefined });
    const [WBOptions, setWBOptions] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const userRole = user.role;
    const permission = user.permissionaccess;
    const token = localStorage.getItem('token');

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    useEffect(() => {
        const fetchWBOptions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/wardBlockDetails/${formData.DId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Failed to fetch wardblock options');

                const data = await response.json();
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('No Data Found');

                const options = data
                    .map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }))
                    .sort((a, b) => {
                        const wardA = a.label.split(' - ')[0];  // Extract WardNo from label
                        const wardB = b.label.split(' - ')[0];
                        return wardA.localeCompare(wardB, undefined, { numeric: true, sensitivity: 'base' });
                    });

                setWBOptions(options);


            } catch (error) {
                toast.error(`Error : ${error.message}`);
            }
        };
        if (formData.DId)
            fetchWBOptions();
    }, [formData.DId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subAdmin/voterList`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.data;
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('No Data Found');

                setVotersDetails(data);
                toast.success("Voter list fetched successfully.");
            } else {
                setVotersDetails([]);
                toast.error(`Error in fetching details: ${response.statusText}`);
            }
        } catch (error) {
            setVotersDetails([]);
            toast.error(`Error  : ${error.message}`);
        }
    };

    const handleDelete = async (Id) => {
        try {
            let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/DeleteVoter`, {
                method: 'POST',
                body: JSON.stringify({ Id }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (result.ok) {
                setVotersDetails(prevVoters => prevVoters.filter(voter => voter.Id !== Id));
                toast.success("Voter delete successfully.");

            } else {
                toast.error("Error in deleting voter:", result.statusText);
            }
        } catch (error) {
            toast.error("Error in  deleting voter:", error.message);
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
            {
                accessorKey: 'EFName', header: 'Name (English)', size: 20,
                Cell: ({ cell }) => {
                    const { EFName, ELName } = cell.row.original;
                    return `${EFName} ${ELName}`
                },
            },
            {
                accessorKey: 'HFName', header: 'Name (Hindi)', size: 20,
                Cell: ({ cell }) => {
                    const { HFName, HLName } = cell.row.original;
                    return `${HFName} ${HLName}`
                },
            },
            { accessorKey: 'MNo', header: 'Mobile', size: 10 },

            // { accessorKey: 'RType', header: 'Relation', size: 10 },
            // {
            //     accessorKey: 'ERFName', header: 'Relative Name (English)', size: 20,
            //     Cell: ({ cell }) => {
            //         const { ERFName, ERLName } = cell.row.original;
            //         return `${ERFName} ${ERLName}`
            //     },
            // },
            // {
            //     accessorKey: 'HRFName', header: 'Relative Name (Hindi)', size: 20,
            //     Cell: ({ cell }) => {
            //         const { HRFName, HRLName } = cell.row.original;
            //         return `${HRFName} ${HRLName}`
            //     },
            // },
            {
                accessorKey: 'EAreaVillHNo',
                header: 'Address',
                size: 20,
                Cell: ({ cell }) => {
                    const { EAreaVill, HNo } = cell.row.original;
                    return `${HNo} ${EAreaVill}`;
                },
            },
            // { accessorKey: 'ECaste', header: 'Caste', size: 20 },
            // { accessorKey: 'Qualification', header: 'Qualification', size: 20 },
            // { accessorKey: 'Occupation', header: 'Occupation', size: 20 },
            { accessorKey: 'Age', header: 'Age', size: 5 },
            { accessorKey: 'DOB', header: 'DOB', size: 10 },
            { accessorKey: 'Sex', header: 'Gender', size: 10 },
            { accessorKey: 'AadharNo', header: 'Aadhar', size: 12 },
            { accessorKey: 'VIdNo', header: 'VoterId', size: 20 },
            // { accessorKey: 'GCYear', header: 'Grd.Year', size: 4 },
            // {
            //     accessorKey: 'Image',
            //     header: 'Photo',
            //     size: 20,
            //     Cell: ({ cell }) => {
            //         const image = cell.getValue();
            //         if (!image) return 'N/A';
            //         const imageUrl = `${import.meta.env.VITE_API_URL}/public/photo/${image}`;
            //         return <img src={imageUrl} alt="voter" style={{ width: '50px', height: '50px' }} />;
            //     },
            // },
            // {
            //     accessorKey: 'Degree',
            //     header: 'Degree',
            //     size: 20,
            //     Cell: ({ cell }) => {
            //         const degreeUrl = cell.getValue();
            //         if (!degreeUrl) return 'N/A';
            //         const imageUrl = `${import.meta.env.VITE_API_URL}/public/Degree/${degreeUrl}`;
            //         return <img src={imageUrl} alt="degree" style={{ width: '50px', height: '50px' }} />;
            //     },
            // },
            // {
            //     accessorKey: 'IdProof',
            //     header: 'Id',
            //     size: 20,
            //     Cell: ({ cell }) => {
            //         const idProofUrl = cell.getValue();
            //         if (!idProofUrl) return 'N/A';
            //         const imageUrl = `${import.meta.env.VITE_API_URL}/public/IdProof/${idProofUrl}`;
            //         return <img src={imageUrl} alt="id proof" style={{ width: '50px', height: '50px' }} />;
            //     },
            // },
        ];

        if (userRole === 'QC Staff' && permission !== '0') {
            baseColumns.unshift(
                {
                    header: 'Edit',
                    size: 10,
                    Cell: ({ row }) => (
                        <Button variant="primary" className="Edit">
                            <Link to={{ pathname: "/editVoter", search: `?content=${row.original.Id}` }}>
                                Edit
                            </Link>
                        </Button>
                    ),
                },
            )
        }
        if (userRole === 'QC Staff' && permission === '2') {
            baseColumns.unshift(
                {
                    header: 'Delete',
                    size: 10,
                    Cell: ({ row }) => (
                        <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>

                            Delete

                        </Button>

                    ),
                }
            )
        }

        return baseColumns;
    }, [userRole]);

    const table = useMaterialReactTable({ columns, data: votersDetails });

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 pl-6 text-black">
                <h1 className="text-2xl font-bold mb-4">Voter Details</h1>
                <Form onSubmit={handleSubmit} className="voter-form">
                    <Row className="mb-3">
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

                        <div className="col-md-3 mb-3" style={{ zIndex: 10 }}>
                            <Form.Group>
                                <Form.Label>Select WardBlock<sup className="text-red-600">*</sup></Form.Label>
                                <Select
                                    id="WBSelect"
                                    name="WBId"
                                    value={WBOptions.find(option => option.value === formData.WBId) || null}
                                    onChange={option => {
                                        setFormData(prevFormData => ({ ...prevFormData, WBId: option.value }));
                                        setVotersDetails([]); // Clear the voter list when the selection changes
                                    }}
                                    options={WBOptions}
                                    placeholder="Select WardBlock"
                                />
                            </Form.Group>
                        </div>
                    </Row>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3">Voter List</h4>
                <div className="overflow-x-auto" style={{ zIndex: -1 }}>
                    <MaterialReactTable table={table} />
                </div>
            </div>
        </main>
    );
}

export default VoterList;
