import React, { useCallback, useRef, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
// import Webcam from 'react-webcam';

function VoterDocs({ voterDocs, setVoterDocs }) {
  const webref = useRef(null);
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoterDocs((prevDetails) => ({
          ...prevDetails,
          [name]: {
            file,
            dataUrl: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePic = useCallback(() => {
    const imageSrc = webref.current.getScreenshot();
    setImage(imageSrc);
    setVoterDocs((prevDetails) => ({
      ...prevDetails,
      VImage: imageSrc,
    }));
  }, [webref, setVoterDocs]);

  return (
    <div className='w-full py-4 h-full mx-auto bg-gray-100' style={{ boxShadow: '0 0 5px 1px #ddd' }}>
      <Container className="flex-col gap-2 flex">
        <div className='flex items-center justify-between py-3'>
          <div className='text-xl text-black'>Voter's Documents</div>
          <p className='select-none text-sm'></p>
        </div>
        <hr />

        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="Image" onChange={handleChange} />
                {voterDocs.Image && <img src={voterDocs.Image.dataUrl} alt="Image Preview" style={{ width: '50%', marginTop: '10px' }} />}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Id</Form.Label>
                <Form.Control type="file" name="IdProof" onChange={handleChange} />
                {voterDocs.IdProof && <img src={voterDocs.IdProof.dataUrl} alt="ID Preview" style={{ width: '50%', marginTop: '10px' }} />}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Degree</Form.Label>
                <Form.Control type="file" name="Degree" onChange={handleChange} />
                {voterDocs.Degree && <img src={voterDocs.Degree.dataUrl} alt="Degree Preview" style={{ width: '50%', marginTop: '10px' }} />}
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Uncomment and adjust the following block if you want to use the camera functionality */}
        {/* <div className="row border-2 mt-5">
          <div className="col-md-4 border-r-2">
            <div className='border-b-2'>
              <p className='underline flex items-center justify-center text-black py-4'>Live Camera</p>
            </div>
            <div className='h-[40vh] flex items-center justify-center'>
              <Webcam ref={webref} screenshotFormat="image/jpeg" />
            </div>
            <div className='flex items-center justify-center py-2 border-t-2'>
              <button className='btn btn-primary text-black' onClick={capturePic}>Capture</button>
            </div>
          </div>
          <div className="col-md-4 border-r-2">
            <div className='border-b-2'>
              <p className='underline flex items-center text-black justify-center py-4'>Captured Picture</p>
            </div>
            <div className='h-[40vh] flex items-center justify-center'>
              {image && <img src={image} alt='Captured' style={{ width: '100%' }} />}
            </div>
            <div className='flex items-center justify-center py-2 border-t-2'>
              <button className='btn bg-blue-400 text-white'>Crop</button>
            </div>
          </div>
          <div className="col-md-4 border-r">
            <div className='border-b-2'>
              <p className='underline flex items-center text-black justify-center py-4'>Preview Picture</p>
            </div>
            <div className='h-[40vh] flex items-center justify-center'>
              {image && <img src={image} alt='Preview' style={{ width: '100%' }} />}
            </div>
            <div className='flex items-center justify-center py-2 border-t-2'>
              <Form.Control type="file" name="PreviewPicture" onChange={handleChange} />
            </div>
          </div>
        </div> */}
      </Container>
    </div>
  );
}

export default VoterDocs;
