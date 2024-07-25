import React from 'react'
import { Form } from 'react-bootstrap';

export const ExtraVoterForm = (extraDetails,setExtraDetails) => {

    const handleChange = (event) => {
        const { name, value } = event.target;
        setExtraDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
    }

    return (
        <>
            <div className='w-full h-full mx-auto my-5 px-2 py-4 bg-gray-100' style={{ boxShadow: "0 0 5px 1px #ddd" }}>
                <div className=" flex-col gap-2 flex">
                    <div className='flex items-center justify-between py-3'>
                        <div className='text-xl font-bold mb-4'>Extra Details</div>
                    </div>
                    <hr />
                </div>

                <div className="row mt-3">
                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Mobile No. Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="EFName"
                                value={extraDetails.MobileNoRemark}
                                onChange={handleChange}
                                placeholder="Mobile No. Remark"
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Address Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="EFName"
                                value={extraDetails.AddressRemark}
                                onChange={handleChange}
                                placeholder="Enter Address Remark"
                            />
                        </Form.Group>
                    </div>
                </div>



                <div className="row mt-3">
                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Name Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="EFName"
                                value={extraDetails.NameRemark}
                                onChange={handleChange}
                                placeholder="Enter Name Remark"
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Father Name Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="FatherNameRemark"
                                value={extraDetails.FatherNameRemark}
                                onChange={handleChange}
                                placeholder="Enter Father Name Remark"
                            />
                        </Form.Group>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Death Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="DeathRemark"
                                value={extraDetails.DeathRemark}
                                onChange={handleChange}
                                placeholder="Death Remark"
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-6 mt-1">
                        <Form.Group>
                            <Form.Label>Extra Remark</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="ExtraRemark"
                                value={extraDetails.ExtraRemark}
                                onChange={handleChange}
                                placeholder="Enter Extra Remark"
                            />
                        </Form.Group>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6 mt-1">
                            <Form.Group>
                                <Form.Label>Special Remark</Form.Label>
                                <Form.Control
                                    className='px-2'
                                    type="text"
                                    name="SpeacialRemark"
                                    value={extraDetails.SpeacialRemark}
                                    onChange={handleChange}
                                    placeholder="Enter Special Remark"
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6 mt-1">
                            <Form.Group>
                                <Form.Label>Required Form Remark</Form.Label>
                                <Form.Control
                                    className='px-2'
                                    type="text"
                                    name="EFName"
                                    value={extraDetails.RequiredForms}
                                    onChange={handleChange}
                                    placeholder="Enter Required form Remark"
                                />
                            </Form.Group>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}
