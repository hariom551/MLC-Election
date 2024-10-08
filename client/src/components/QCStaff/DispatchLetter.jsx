import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import UpdateLetter from './UpdateLetter';
import DistrictSelect from '../Pages/DistrictSelect';


function DispatchLetter() {
    const [votersDetails, setVotersDetails] = useState([]);
    const [formData, setFormData] = useState({ DId: '', WBId: undefined });
    const [WBOptions, setWBOptions] = useState([]);
    const [letters, setLetters] = useState([]);
    

    useEffect(() => {
        const fetchWBOptions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/wardBlockDetails/${formData.DId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Failed to fetch wardblock options');

                const data = await response.json();
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid wardblock options data');

                const options = data
                    .map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }))
                    .sort((a, b) => {
                        const wardA = a.label.split(' - ')[0];  // Extract WardNo from label
                        const wardB = b.label.split(' - ')[0];
                        return wardA.localeCompare(wardB, undefined, { numeric: true, sensitivity: 'base' });
                    });

                setWBOptions(options);


            } catch (error) {
                toast.error(`Error fetching wardblock options: ${error.message}`);
            }
        };
        if (formData.DId)
            fetchWBOptions();
    }, [formData.DId]);


    useEffect(()=>{

        const fetchletters = async()=>{
          try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/prevletter`,{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                },
      
            });
            if(!response.ok) throw new Error ('Failed to fetch previous letter');
      
            const data =await response.json();
           
            console.log("the received data:",data[0].content)
            if(!data|| data.length===0) throw new Error("empty  or invalid data")
            
              console.log("the received data:",data)
      
              setLetters(data[0].content);
      
          }catch (error) {
            console.error('Error fetching letters:', error);
          }
          
        }
        fetchletters()
        },[])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subAdmin/voterList`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (result.ok) {
                const results = await result.json();
                const data= results.data;
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid voter list data');

                setVotersDetails(data);
                toast.success("Voter list fetched successfully.");
            } else {
                toast.error(`Error in fetching details: ${result.statusText}`);
            }
        } catch (error) {
            toast.error(`Error in fetching: ${error.message}`);
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
                Cell : ({cell}) =>{
                    const {EFName, ELName }= cell.row.original;
                    return `${EFName} ${ELName}`
                },
             },
            { accessorKey: 'HFName', header: 'Name (Hindi)', size: 20,
                Cell : ({cell}) =>{
                    const {HFName, HLName }= cell.row.original;
                    return `${HFName} ${HLName}`
                },
             },
            { accessorKey: 'RType', header: 'Relation', size: 10 },
            { accessorKey: 'ERFName', header: 'Relative Name (English)', size: 20,
                Cell : ({cell}) =>{
                    const {ERFName, ERLName }= cell.row.original;
                    return `${ERFName} ${ERLName}`
                },
             },
            { accessorKey: 'HRFName', header: 'Relative Name (Hindi)', size: 20,
                Cell : ({cell}) =>{
                    const {HRFName, HRLName }= cell.row.original;
                    return `${HRFName} ${HRLName}`
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
                    const imageUrl = `${import.meta.env.VITE_API_URL}/public/photo/${image}`;
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
                    const imageUrl = `${import.meta.env.VITE_API_URL}/public/Degree/${degreeUrl}`;
                    return <img src={imageUrl} alt="degree" style={{ width: '50px', height: '50px' }} />;
                },
            },
            {
                accessorKey: 'IdProof',
                header: 'Id',
                size: 20,
                Cell: ({ cell }) => {
                    const idProofUrl = cell.getValue();
                    if (!idProofUrl) return 'N/A';
                    const imageUrl = `${import.meta.env.VITE_API_URL}/public/IdProof/${idProofUrl}`;
                    return <img src={imageUrl} alt="id proof" style={{ width: '50px', height: '50px' }} />;
                },
            },
        ];
        return baseColumns;
    }, []);

    const table = useMaterialReactTable({ columns, data: votersDetails });

 const handleDispatchLetter = () => {
    const letterContent = votersDetails.map((voter, index) => (
        `<div class="letter">
            <p>सेवा में ,</p>
            <p>${voter.HFName + " " + voter.HLName}</p>
            <p>${voter.HNo ? voter.HNo : ''} ${voter.HAreaVill},</p>
            <p>प्रिय ${voter.HFName + " " + voter.HLName},</p>
            <p>नमस्कार!</p>

            <div class="letter-justify">${letters}</div> <!-- Justified content -->

            <p>आपका स्नेही,</p>
            <p>अरुण पाठक</p>
            <p>स्नातक चैत्र, कानपूर</p>
        </div>`
    )).join('<div class="page-break"></div>');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Letters</title>
                <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0; /* Remove margin for print */
                        padding: 20mm; /* Padding for printed content */
                        box-sizing: border-box;
                        min-height: 100vh;
                    }
                    .letter {

                        margin-top: 6rem;
                        margin-bottom: 0.3rem;
                        page-break-after: always;
                    }
                    .letter-justify {
                        text-align: justify; /* Justify the text */
                        margin: 1rem 0; /* Optional margin for spacing */
                    }
                    
                    @media print {
                        body {
                            width: 21cm;
                            height: 29.7cm;
                        }
                        /* Hide elements not needed in print */
                        header, footer {
                            display: none; /* Hide header and footer */
                        }
                    }
                </style>
            </head>
            <body>
                ${letterContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

    
    

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 pl-6 text-black">
            <h1 className="text-2xl font-bold mb-1">Letter</h1>
                <UpdateLetter/>
                <h1 className="text-xl font-bold mb-4">Dispatch Letter</h1>
                <Form onSubmit={handleSubmit} className="voter-form">
                    <Row className="mb-3">
                    <DistrictSelect
                            formData={formData}
                            setFormData={setFormData}
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
                                    value={WBOptions.find(option => option.value === formData.WBId)}
                                    onChange={option => {
                                        setFormData(prevFormData => ({ ...prevFormData, WBId: option.value }));
                                        setVotersDetails([]); // Clear the voter list when the selection changes
                                    }}
                                    
                                    options={WBOptions}
                                    placeholder="Select WardBlock"
                                />
                            </Form.Group>
                        </div>
                         <div className="col-md-3 mt-8">
                    <Button variant="primary" type="submit">Search</Button></div>
                    </Row>
                </Form>
                <Button variant="primary" onClick={handleDispatchLetter}className="mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Dispatch Letter</Button>
                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3">Voter List</h4>
                <div className="overflow-x-auto" style={{ zIndex: -1 }}>
                    <MaterialReactTable table={table} />
                </div>
              
            </div>
        </main>
    );
}

export default DispatchLetter;