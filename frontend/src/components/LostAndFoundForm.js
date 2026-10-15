import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { FaCloudUploadAlt, FaMapMarkerAlt, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function LostAndFoundForm() {
  const [Name, setForm1] = useState('');
  const [description, setForm2] = useState('');
  const [question, setForm3] = useState('');
  const [status, setForm5] = useState('');
  const [location, setForm4] = useState('');
  const [image, setImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      setShowLoginAlert(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error('Please login first to post an item');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('Name', Name);
    formData.append('description', description);
    formData.append('question', question);
    formData.append('status', status);
    formData.append('location', location);
    formData.append('userEmail', userEmail);

    if (image) {
      formData.append('images', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/lostandfound/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Item submitted successfully!');
      // Clear form
      setForm1('');
      setForm2('');
      setForm3('');
      setForm4('');
      setForm5('');
      setImage(null);
      setPreviewImage(null);

      // Navigate after submission
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error('Submission failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
    <div className="form-page-wrapper" style={{
    position: 'relative',
  backgroundImage: `
    linear-gradient(rgba(0, 20, 15, 0.7), rgba(5, 30, 25, 0.7)),
    url("WlcmBackImg.jpg") 
  `,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '100vh',
  fontFamily: "'Poppins', sans-serif",
  color: '#fff'
    }}>
      <NavBar />
      
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="form-card shadow-lg border-0" style={{
          background: 'rgba(15, 40, 35, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          overflow: 'hidden',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3) !important'
        }}>
          <div className="card-header-accent" style={{
            height: '8px',
            background: 'linear-gradient(to right, #0b9444, #064d24)',
            width: '100%'
          }}></div>
          
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-4" style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: '28px',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              <span className="text-success me-2">|</span>
              Post Lost or Found Item
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(to right, transparent, #0b9444, transparent)',
                borderRadius: '3px'
              }}></div>
            </h2>
            
            <ToastContainer theme="colored" />

            {showLoginAlert && (
              <Alert variant="warning" className="border-0 mb-4" style={{
                background: 'rgba(255, 193, 7, 0.15)',
                borderLeft: '4px solid #ffc107',
                color: '#fff'
              }}>
                <div className="d-flex align-items-center">
                  <FaInfoCircle className="me-2" size={18} />
                  <div>
                    Please login to post an item. 
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/login')} 
                      className="p-0 ms-2 text-warning"
                      style={{ textDecoration: 'none', fontWeight: '600' }}
                    >
                      Login Now
                    </Button>
                  </div>
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Group className="mb-4" controlId="formName">
                <Form.Label className="text-white">Item Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name of item"
                  value={Name}
                  onChange={(e) => setForm1(e.target.value)}
                  required
                  className="form-control-custom"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '15px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formDescription">
                <Form.Label className="text-white">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe the item in detail..."
                  value={description}
                  onChange={(e) => setForm2(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '15px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formQuestion">
                <Form.Label className="text-white d-flex align-items-center">
                  <FaQuestionCircle className="me-2 text-success" />
                  Verification Question
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ask a question only the true owner would know..."
                  value={question}
                  onChange={(e) => setForm3(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '15px'
                  }}
                />
                <Form.Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  This question will help verify the rightful owner when someone claims this item.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white">Status</Form.Label>
                <Row className="g-3">
                  <Col xs={6}>
                    <div 
                      className={`status-option ${status === 'Lost' ? 'selected' : ''}`}
                      onClick={() => setForm5('Lost')}
                      style={{
                        background: status === 'Lost' ? 'rgba(220, 53, 69, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: status === 'Lost' ? '2px solid #dc3545' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div 
                        className="radio-circle mb-2 mx-auto" 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid #dc3545',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {status === 'Lost' && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#dc3545'
                          }}></div>
                        )}
                      </div>
                      <div className="text-white">Lost Item</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`status-option ${status === 'Found' ? 'selected' : ''}`}
                      onClick={() => setForm5('Found')}
                      style={{
                        background: status === 'Found' ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: status === 'Found' ? '2px solid #28a745' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div 
                        className="radio-circle mb-2 mx-auto" 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid #28a745',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {status === 'Found' && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#28a745'
                          }}></div>
                        )}
                      </div>
                      <div className="text-white">Found Item</div>
                    </div>
                  </Col>
                </Row>
                <Form.Control
                  type="hidden"
                  name="status"
                  value={status}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formLocation">
                <Form.Label className="text-white d-flex align-items-center">
                  <FaMapMarkerAlt className="me-2 text-success" />
                  Location
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location where item was lost/found..."
                  value={location}
                  onChange={(e) => setForm4(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '15px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white d-flex align-items-center">
                  <FaCloudUploadAlt className="me-2 text-success" />
                  Upload Photo
                </Form.Label>
                
                <div className="upload-area" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px dashed rgba(11, 148, 68, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  {previewImage ? (
                    <div className="text-center">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          marginBottom: '10px'
                        }} 
                      />
                      <p className="text-success mb-0">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt size={40} className="text-success mb-3" />
                      <p className="text-white mb-0">Drag & drop or click to upload an image</p>
                      <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        JPEG, PNG or JPG (max. 5MB)
                      </small>
                    </div>
                  )}
                </div>
              </Form.Group>

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="btn-submit px-5 py-3"
                  disabled={!userEmail || !status}
                  style={{
                    background: 'linear-gradient(to right, #0b9444, #064d24)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    boxShadow: '0 5px 15px rgba(11, 148, 68, 0.3)',
                    transition: 'all 0.3s ease',
                    width: '200px'
                  }}
                >
                  SUBMIT
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
    </>
  );
}

export default LostAndFoundForm;