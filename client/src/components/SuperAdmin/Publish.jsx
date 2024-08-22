import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Publish = () => {
  const [formData, setFormData]=useState({
      publishtype:'',
      fromdate:'',
      todate:'',
      publishdate:'',

    }
  )
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/users/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          });

          
      if (response.ok) {
        toast.success('Published voters successfully.');
          // const data=await response.json();
  } else {
    toast.error('Error in publishing data');
  }
}catch(error){
    toast.error('error in fetching data',error)
  }
}
  
  const handleChange=async(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value})
    // setFormData((prevData)=>{
    //   return{
    //     ...prevData,
    //     [name]:value
    //     }
    // }
  }

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Publish Voterlist</h1>

        <Form className="PublishVoterlist-form" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className="text-pretty font-semibold">Publish Type</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Mother Role"
                name="publishtype"
                value="motherRole"
                onChange={handleChange}
                checked={formData.publishtype === 'motherRole'}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Supplementary 1"
                name="publishtype"
                onChange={handleChange}
                checked={formData.publishtype === 'supplementary1'}
                value="supplementary1"
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Supplementary 2"
                name="publishtype"
                onChange={handleChange}
                checked={formData.publishtype === 'supplementary2'}
                value="supplementary2"
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Supplementary 3"
                name="publishtype"
                onChange={handleChange}
                checked={formData.publishtype === 'supplementary3'}
                value="supplementary3"
                className="mb-2"
              />
            </div>
          </Form.Group>

          <Row className="mb-3">
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="block mb-2">From:</Form.Label>
                <input
                  type="date"
                  name="fromdate"
                  value={formData.fromdate}
                  onChange={handleChange}
                  className="form-control border rounded-md p-2 w-full"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="block mb-2">To:</Form.Label>
                <input
                  type="date"
                  name="todate"
                  value={formData.todate}
                  onChange={handleChange}
                  className="form-control border rounded-md p-2 w-full"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="block mb-2">Publish Date:</Form.Label>
                <input
                  type="date"
                  name="publishdate"
                  value={formData.publishdate}
                  onChange={handleChange}
                  className="form-control border rounded-md p-2 w-full"
                />
              </Form.Group>
            </Col>
          </Row>

          <Col md={3} className="mb-3">
            <Button
              variant="primary"
              type="submit"
              className="w-full py-2"
            >
              Publish
            </Button>
          </Col>
        </Form>
        <hr className="my-4" />
      </div>
    </main>
  );
};

export default Publish;
