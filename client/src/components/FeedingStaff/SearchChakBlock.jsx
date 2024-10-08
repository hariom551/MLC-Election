import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Select from 'react-select';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistrictSelect from '../Pages/DistrictSelect';

function SearchChakBlock() {
    const [perseemanDetails, setPerseemanDetails] = useState([]);
    const [CNOption, setCNOptions] = useState([]);
    const [CBOption, setCBOptions] = useState([]);
    const [AreaVillOptions, setAreaVillOptions] = useState([]);

    const [formData, setFormData] = useState({
        ChakNo: '',
        ECBPanch: '',
        EAreaVill: '',
        DId: '',
    });

    const fetchCBOptions = async () => {
        try {
            
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/feedingstaff/ChakNoBlock?DId=${encodeURIComponent(formData.DId)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch chakblock options');
            }

            const data = await response.json();
            if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error('Empty or invalid chakblock options data');
            }

           
            const options = Array.from(
                new Set(data.map((CB) => CB.ChakNo))
            ).sort((a, b) => {
                const regex = /(\d+|\D+)/g;
                const aParts = a.match(regex);
                const bParts = b.match(regex);

                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    const aPart = aParts[i] || '';
                    const bPart = bParts[i] || '';

                    if (aPart !== bPart) {
                        const isANumber = !isNaN(aPart);
                        const isBNumber = !isNaN(bPart);

                        if (isANumber && isBNumber) {
                            return parseInt(aPart, 10) - parseInt(bPart, 10);
                        }
                        return aPart.localeCompare(bPart);
                    }
                }
                return 0;
            }).map((value) => ({
                value,
                label: value,
            }));

           
            const Boptions = Array.from(
                new Set(data.map((CB) => CB.ECBPanch))
            ).sort((a, b) => a.localeCompare(b))
                .map((value) => ({
                    value,
                    label: value,
                }));

           
            setCNOptions(options);
            setCBOptions(Boptions);

        } catch (error) {
            console.error('Error fetching CB options:', error);
            toast.error('Error fetching CB options');
        }
    };


    useEffect(() => {
        if (formData.DId) {
            fetchCBOptions();
        }
    }, [formData.DId]);

    const fetchAreaVillOptions = async (input) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/feedingStaff/searchAreaVill/${formData.DId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggested AreaVill');
            }
            const data = await response.json();
            setAreaVillOptions(data);
        } catch (error) {
            console.error('Error fetching suggested AreaVill:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
        }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/feedingstaff/getPerseemanDetails`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                setPerseemanDetails([]);
                throw new Error('Empty or invalid details data');
            }
            else {
                setPerseemanDetails(data);
            }
            // setFormData({
            //     ChakNo: '',
            //     ECBPanch: '',
            //     EAreaVill: '',
            // });

            setAreaVillOptions([]);
        } catch (error) {
            toast.error(`Error in fetching data: ${error.message}`);
        }
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [actionMeta.name]: selectedOption ? selectedOption.value : '',
        }));
    };

    const columns = useMemo(() => [
        {
            accessor: (index) => index + 1,
            id: 'serialNumber',
            Header: 'S.No',
            size: 5,
            Cell: ({ cell }) => cell.row.index + 1
        },
        {
            accessorKey: 'ChakNo',
            header: 'ChakNo',
            size: 20,
        },
        {
            accessorKey: 'ECBPanch',
            header: 'Block',
            size: 20,
        },
        {
            accessorKey: 'EAreaVill',
            header: 'Area',
            size: 20,
            Cell: ({ cell }) => {
                const { HnoRange, EAreaVill } = cell.row.original;
                return HnoRange ? `${EAreaVill} || ${HnoRange}` : EAreaVill;
            }
        },
        {
            accessorKey: 'WardNoEWardBlock',
            header: 'WardNo',
            size: 20,
            Cell: ({ cell }) => {
                const { WardNo, EWardBlock } = cell.row.original;
                return `${WardNo} ${EWardBlock}`;
            }
        }
    ], []);

    const table = useMaterialReactTable({
        columns,
        data: perseemanDetails,
    });

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 pl-6 text-black">
                <h1 className="text-2xl font-bold mb-4">Search Details</h1>
                <Form onSubmit={handleSubmit} className="SearchCB-form">
    
                    <DistrictSelect formData={formData} handleChange={handleChange} />

                        <Row className="mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>ChakNo</Form.Label>
                                <Select
                                    id="CBSelect"
                                    name="ChakNo"
                                    value={CNOption.find(
                                        (option) => option.value === formData.ChakNo
                                    )}
                                    onChange={handleSelectChange}
                                    options={CNOption}
                                    placeholder="Chak No"
                                    isSearchable
                                    isClearable
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                        }),
                                    }}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Block</Form.Label>
                                <Select
                                    id="ECBSelect"
                                    name="ECBPanch"
                                    value={CBOption.find(
                                        (option) => option.value === formData.ECBPanch
                                    )}
                                    onChange={handleSelectChange}
                                    options={CBOption}
                                    placeholder="Block"
                                    isSearchable
                                    isClearable
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                        }),
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-3 flex-col gap-2 flex mt-1">
                            <Form.Group>
                                <Form.Label>Area / Village</Form.Label>
                                <Typeahead
                                    id="EAreaVill"
                                    onInputChange={(inputValue) => {
                                        setFormData((prevDetails) => ({
                                            ...prevDetails,
                                            EAreaVill: inputValue,
                                        }));
                                        fetchAreaVillOptions(inputValue);
                                    }}
                                    onChange={(selected) => {
                                        if (selected.length > 0) {
                                            const { EAreaVill } = selected[0];
                                            setFormData((prevDetails) => ({
                                                ...prevDetails,
                                                EAreaVill,
                                            }));
                                        } else {
                                            setFormData((prevDetails) => ({
                                                ...prevDetails,
                                                EAreaVill: '',
                                            }));
                                        }
                                    }}
                                    options={AreaVillOptions}
                                    placeholder="Area/Village"
                                    defaultInputValue={formData.EAreaVill}
                                    labelKey="EAreaVill"
                                    isClearable
                                    renderMenuItemChildren={(option) => (
                                        <div>
                                            {option.EAreaVill} | {option.HnoRange}
                                        </div>
                                    )}
                                />


                            </Form.Group>
                        </div>
                    </Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3"> List</h4>
                <div className="overflow-x-auto">
                    <MaterialReactTable table={table} />
                </div>
            </div>
        </main>
    );
}

export default SearchChakBlock;
