import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferenceDetailsForm from './ReferenceDetailsForm.jsx';
import VoterDetailsForm from './VoterDetailsForm.jsx';
import AddressInformationForm from './AddressInformationForm.jsx';
import VoterDocs from './VoterDocs.jsx';
import { Occupation } from '../Pages/Constaint.jsx';
import { validateVoterDetails } from '../../Validation/voterDetailsValidation.js';
import { ExtraVoterForm } from '../QCStaff/ExtraVoterForm.jsx';

function AddVoter() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const content = searchParams.get('content');

    const user = JSON.parse(localStorage.getItem("user"));
    const DId = user ? user.DId : '';
    const userRole = user ? user.role : '';
    const loginUserId =user ? user.userid: '';

    const [referenceDetails, setReferenceDetails] = useState({
        PacketNo: '',
        IncRefId: '',
        VMob1: '',
        VMob2: '',
        VEName: '',
        VHName: '',
        VEAddress: '',
        VHAddress: '',
        COList: [
            { VMob1: '', VEName: '', VHName: '' }
        ],
    });

    const [voterDetails, setVoterDetails] = useState({
        EFName: '',
        HFName: '',
        ELName: '',
        HLName: '',
        RType: '',
        ERFName: '',
        HRFName: '',
        ERLName: '',
        HRLName: '',
        CasteId: '',
        ECaste: '',
        Qualification: '',
        Occupation: Occupation ? '' : 'NA',
        Age: '',
        DOB: '',
        Sex: '',
        MNo: '',
        MNo2: '',
        AadharNo: '',
        VIdNo: '',
        GCYear: '',
    });

    const [addressDetail, setAddressDetail] = useState({
        DId: '',
        AreaId: '',
        EAreaVill: '',
        TehId: '',
        EName: '',
        CounId: '',
        ECouncil: '',
        VSId: '',
        EVidhanSabha: '',
        WBId: '',
        EWardBlock: '',
        ChkBlkId: '',
        ECBPanch: '',
        HNo: '',
        Landmark: '',
    });

    const [voterDocs, setVoterDocs] = useState({
        Image: '',
        IdProof: '',
        Degree: '',

    });

    const [extraDetails, setExtraDetails] = useState({
        MobileNoRemark: '',
        AddressRemark: '',
        NameRemark: '',
        FatherNameRemark: '',
        RequiredForms: '',
        DeathRemark: '',
        ExtraRemark: '',
        SpeacialRemark: '',
    })

    const [errors, setErrors] = useState({
        referenceDetails: {},
        voterDetails: {},
        addressDetail: {},
        voterDocs: {},
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            if (!content) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualitystaff/voterDetailById`, {
                    method: 'POST',
                    body: JSON.stringify({ content }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch the voter data");
                }
                const result = await response.json();
                if (!result.success || result.statusCode !== 200 || !Array.isArray(result.data) || result.data.length === 0) {
                    throw new Error(result.message || "Empty or invalid data");
                }
                setReferenceDetails(prevState => ({ ...prevState, PacketNo: result.data[0][0].PacketNo }))
                setVoterDetails(prevState => ({ ...prevState, ...result.data[1][0] }));
                setAddressDetail(prevState => ({ ...prevState, ...result.data[2][0] }));
                setExtraDetails(prevState => ({ ...prevState, ...result.data[3][0] }));
            } catch (error) {
                toast.error('Error in fetching voter data: ' + error.message);
            }
        };
        fetchData();
    }, [content]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate voter details
        const voterDetailErrors = {};
        Object.keys(voterDetails).forEach((field) => {
            const error = validateVoterDetails(field, voterDetails[field]);
            if (error) {
                voterDetailErrors[field] = error;
            }
        });

        // Validate reference details
        const referenceDetailsErrors = {};
        Object.keys(referenceDetails).forEach((field) => {
            const error = validateVoterDetails(field, referenceDetails[field]);
            if (error) {
                referenceDetailsErrors[field] = error;
            }
        });

        const addressDetailError = {};
        Object.keys(addressDetail).forEach((field) => {
            const error = validateVoterDetails(field, addressDetail[field]);
            if (error) {
                addressDetailError[field] = error;
            }
        });


        if (Object.keys(addressDetailError).length > 0 || Object.keys(voterDetailErrors).length > 0 || Object.keys(referenceDetailsErrors).length > 0) {
            setErrors({
                ...errors,
                voterDetails: voterDetailErrors,
                referenceDetails: referenceDetailsErrors,
                addressDetail: addressDetailError,
            });
            toast.error('Please fix the errors in the form.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('referenceDetails', JSON.stringify({
                IncRefId: referenceDetails.IncRefId,
                PacketNo: referenceDetails.PacketNo,
            }));
            formData.append('voterDetails', JSON.stringify(voterDetails));
            formData.append('addressDetail', JSON.stringify(addressDetail));
            formData.append('loginIdDetails',JSON.stringify({ loginId: loginUserId}));



            Object.keys(voterDocs).forEach(key => {
                if (voterDocs[key].file) {
                    formData.append(key, voterDocs[key].file);
                }
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/feedingStaff/addVoter`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {

                if (data.message === "Duplicate voter entry found") {
                    toast.error('Duplicate entry found. Please check the voter details.');
                } else {
                    throw new Error(data.message || 'Failed to create voter');
                }
            } else {


                toast.success('Voter created successfully!');
                // Reset forms after successful submission
                setReferenceDetails({
                    PacketNo: '',
                    IncRefId: '',
                    VMob1: '',
                    VMob2: '',
                    VEName: '',
                    VHName: '',
                    VEAddress: '',
                    VHAddress: '',
                    COList: [
                        { VMob1: '', VEName: '', VHName: '' }
                    ],
                });
                setVoterDetails({
                    EFName: '',
                    HFName: '',
                    ELName: '',
                    HLName: '',
                    RType: '',
                    ERFName: '',
                    HRFName: '',
                    ERLName: '',
                    HRLName: '',
                    CasteId: '',
                    ECaste: '',
                    Qualification: '',
                    Occupation: Occupation ? '' : 'NA',
                    Age: '',
                    DOB: '',
                    Sex: '',
                    MNo: '',
                    MNo2: '',
                    AadharNo: '',
                    VIdNo: '',
                    GCYear: '',
                });
                setAddressDetail({
                    AreaId: '',
                    EAreaVill: '',
                    TehId: '',
                    EName: '',
                    CounId: '',
                    ECouncil: '',
                    VSId: '',
                    EVidhanSabha: '',
                    WBId: '',
                    EWardBlock: '',
                    ChkBlkId: '',
                    ECBPanch: '',
                    HNo: '',
                    Landmark: '',
                });
                setVoterDocs({
                    Image: '',
                    IdProof: '',
                    Degree: '',

                });
                setErrors({
                    referenceDetails: {},
                    voterDetails: {},
                    addressDetail: {},
                    voterDocs: {},
                });
            }

        } catch (error) {

            toast.error('Error creating voter: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const voterDetailErrors = {};
        Object.keys(voterDetails).forEach((field) => {
            const error = validateVoterDetails(field, voterDetails[field]);
            if (error) {
                voterDetailErrors[field] = error;
            }
        });

        const referenceDetailsErrors = {};
        Object.keys(referenceDetails).forEach((field) => {
            const error = validateVoterDetails(field, referenceDetails[field]);
            if (error) {
                referenceDetailsErrors[field] = error;
            }
        });

        const addressDetailError = {};
        Object.keys(addressDetail).forEach((field) => {
            const error = validateVoterDetails(field, addressDetail[field]);
            if (error) {
                addressDetailError[field] = error;
            }
        });


        if (Object.keys(addressDetailError).length > 0 || Object.keys(voterDetailErrors).length > 0 || Object.keys(referenceDetailsErrors).length > 0) {
            setErrors({
                ...errors,
                voterDetails: voterDetailErrors,
                referenceDetails: referenceDetailsErrors,
                addressDetail: addressDetailError,
            });
            toast.error('Please fix the errors in the form.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('referenceDetails', JSON.stringify({
                IncRefId: referenceDetails.IncRefId,
                PacketNo: referenceDetails.PacketNo,
            }));
            formData.append('voterDetails', JSON.stringify(voterDetails));
            formData.append('addressDetail', JSON.stringify(addressDetail));
            formData.append('extraDetails', JSON.stringify(extraDetails));
            formData.append('loginIdDetails',JSON.stringify({ loginId: loginUserId}));

            Object.keys(voterDocs).forEach(key => {
                if (voterDocs[key].file) {
                    formData.append(key, voterDocs[key].file);
                }
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/UpdateVoter/${content}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create voter');
            } else {
                toast.success('Voter Updated successfully!');
               window.location.href='/VoterList'
                setReferenceDetails({
                    PacketNo: '',
                    IncRefId: '',
                    VMob1: '',
                    VMob2: '',
                    VEName: '',
                    VHName: '',
                    VEAddress: '',
                    VHAddress: '',
                    COList: [
                        { VMob1: '', VEName: '', VHName: '' }
                    ],
                });
                setVoterDetails({
                    EFName: '',
                    HFName: '',
                    ELName: '',
                    HLName: '',
                    RType: '',
                    ERFName: '',
                    HRFName: '',
                    ERLName: '',
                    HRLName: '',
                    CasteId: '',
                    ECaste: '',
                    Qualification: '',
                    Occupation: Occupation ? '' : 'NA',
                    Age: '',
                    DOB: '',
                    Sex: '',
                    MNo: '',
                    MNo2: '',
                    AadharNo: '',
                    VIdNo: '',
                    GCYear: '',
                });
                setAddressDetail({
                    AreaId: '',
                    EAreaVill: '',
                    TehId: '',
                    EName: '',
                    CounId: '',
                    ECouncil: '',
                    VSId: '',
                    EVidhanSabha: '',
                    WBId: '',
                    EWardBlock: '',
                    ChkBlkId: '',
                    ECBPanch: '',
                    HNo: '',
                    Landmark: '',
                });
                setVoterDocs({
                    Image: '',
                    IdProof: '',
                    Degree: '',

                });
                setErrors({
                    referenceDetails: {},
                    voterDetails: {},
                    addressDetail: {},
                    voterDocs: {},
                });
            }

        } catch (error) {

            toast.error('Error creating voter: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 text-black">
                <Form onSubmit={content ? handleUpdate : handleSubmit} className="Council-form">
                    <ReferenceDetailsForm
                        referenceDetails={referenceDetails}
                        setReferenceDetails={setReferenceDetails}
                        errors={errors.referenceDetails}
                        setErrors={setErrors}
                    />

                    <VoterDetailsForm
                        voterDetails={voterDetails}
                        setVoterDetails={setVoterDetails}
                        errors={errors.voterDetails}
                        setErrors={setErrors}
                    />

                    <AddressInformationForm
                        addressDetail={addressDetail}
                        setAddressDetail={setAddressDetail}
                        errors={errors.addressDetail}
                        setErrors={setErrors}
                    />

                    <VoterDocs
                        voterDocs={voterDocs}
                        setVoterDocs={setVoterDocs}
                        errors={errors.voterDocs}
                        setErrors={setErrors}
                    />

                    {userRole === 'QC Staff' &&
                        <ExtraVoterForm
                            extraDetails={extraDetails}
                            setExtraDetails={setExtraDetails}
                        />
                    }

                    <Button variant="primary" type="submit">
                        {content ? 'Update' : 'Submit'}
                    </Button>

                </Form>
            </div>
        </main>
    );
}

export default AddVoter;
