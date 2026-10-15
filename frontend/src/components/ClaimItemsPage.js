import React, { useState, useEffect } from 'react';
import { Button, Container, Card, Row, Col, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaHandHolding, FaClipboardCheck } from 'react-icons/fa';

const ClaimItemsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [claimAnswer, setClaimAnswer] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all available items
  useEffect(() => {
    const fetchItems = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/lostandfound/all');
        
        // Filter out items posted by the current user
        const filteredItems = response.data.filter(item => item.userEmail !== userEmail);
        setItems(filteredItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchItems();
    }
  }, [userEmail]);

  // Handle claim button click
  const handleClaimClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setClaimAnswer('');
  };

  // Handle claim form submission
  const handleClaimSubmit = async () => {
    if (!claimAnswer.trim()) {
      toast.error('Please provide an answer to the question');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/claims', {
        itemId: selectedItem._id,
        claimantEmail: userEmail,
        answer: claimAnswer
      });
      
      toast.success('Claim submitted successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error(error.response?.data?.message || 'Error submitting claim!');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!userEmail) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 20, 15, 0.97), rgba(5, 30, 25, 0.98)), url("WlcmBackImg.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <NavBar />
        <Container className="mt-5 pt-5 text-center">
          <Alert variant="warning" style={{ 
            background: 'rgba(255, 193, 7, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <h4 className="mb-3">Please log in to view and claim items</h4>
            <Button 
              variant="warning" 
              onClick={() => navigate('/login')}
              className="rounded-pill px-4 py-2"
              style={{
                background: 'linear-gradient(135deg, #ffc107, #ffaa00)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
              }}
            >
              Go to Login
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, rgba(0, 20, 15, 0.97), rgba(5, 30, 25, 0.98)), url("WlcmBackImg.jpg")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <NavBar />
      <Container className="py-5" style={{ paddingTop: "120px !important" }}>
        <ToastContainer theme="colored" />
        
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="text-white mb-3 mb-md-0" style={{ fontWeight: '600' }}>
            <span className="text-success me-2" style={{ fontSize: '28px', fontWeight: '700' }}>|</span>
            Available Items to Claim
          </h2>
        </div>
        
        <Row className="mb-4">
          <Col lg={8} className="mb-3 mb-lg-0">
            <InputGroup>
              <Form.Control
                placeholder="Search for items to claim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-success"
                style={{ 
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  height: '50px',
                  background: 'rgba(7, 43, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderWidth: '2px'
                }}
              />
              <Button 
                variant="success"
                style={{ 
                  borderRadius: '0 8px 8px 0',
                  background: 'linear-gradient(135deg, #28a745, #219a3a)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
                }}
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white-50 mt-3">Loading items...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" style={{
            background: 'rgba(220, 53, 69, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: '12px',
            color: '#fff'
          }}>
            {error}
          </Alert>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-5 my-4 rounded-lg"
            style={{ 
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px dashed rgba(40, 167, 69, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FaClipboardCheck className="text-success mb-3" size={40} />
            <h5 className="text-white">No items available to claim</h5>
            <p className="text-white-50 mb-0">Check back later for new items.</p>
          </div>
        ) : (
          <>
            {/* Lost Items Section */}
            <div className="d-flex align-items-center my-4">
              <div 
                className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: 'rgba(220, 53, 69, 0.15)',
                  width: '45px',
                  height: '45px',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.2)'
                }}
              >
                <FaHandHolding className="text-danger" size={18} />
              </div>
              <h3 className="text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Lost Items</h3>
            </div>
            
            <Row className="mb-5">
              {filteredItems.filter(item => item.status === 'Lost').map((item) => (
                <Col md={4} key={item._id} className="mb-4">
                  <div 
                    className="item-card rounded-lg position-relative overflow-hidden"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid rgba(220, 53, 69, 0.2)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      height: '100%'
                    }}
                  >
                    <div className="position-relative">
                      <div className="image-container" style={{ 
                        height: '200px', 
                        overflow: 'hidden',
                        borderRadius: '12px 12px 0 0',
                        position: 'relative'
                      }}>
                        <img
                          src={`http://localhost:5000/uploads/documents/${item.images}`}
                          className="w-100 h-100"
                          alt={item.Name}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/api/placeholder/400/200'; // Fallback image
                          }}
                        />
                        <div 
                          className="image-overlay" 
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)'
                          }}
                        ></div>
                      </div>
                      
                      <span 
                        className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill"
                        style={{ 
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          backgroundColor: '#dc3545',
                          color: 'white'
                        }}
                      >
                        LOST
                      </span>
                    </div>
                    
                    <div className="p-3">
                      <h5 className="text-white mb-2 text-truncate" style={{ fontWeight: '600' }}>{item.Name}</h5>
                      <p 
                        className="text-white-50 small mb-3" 
                        style={{ 
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.9rem',
                          height: '54px'  // Fixed height for 3 lines
                        }}
                      >
                        {item.description || 'No description available'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center small mb-2">
                        <div className="d-flex align-items-center text-white-50">
                          <FaMapMarkerAlt className="me-1 text-danger" />
                          <span>{item.location || 'Unknown location'}</span>
                        </div>
                        <div className="d-flex align-items-center text-white-50">
                          <FaCalendarAlt className="me-1 text-danger" />
                          <span>{formatDate(item.date || item.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 d-grid">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="rounded-pill"
                          onClick={() => handleClaimClick(item)}
                          style={{
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            letterSpacing: '0.5px',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          CLAIM THIS ITEM
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            
            {/* Found Items Section */}
            <div className="d-flex align-items-center my-4">
              <div 
                className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: 'rgba(40, 167, 69, 0.15)',
                  width: '45px',
                  height: '45px',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.2)'
                }}
              >
                <FaClipboardCheck className="text-success" size={18} />
              </div>
              <h3 className="text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Found Items</h3>
            </div>
            
            <Row>
              {filteredItems.filter(item => item.status === 'Found').map((item) => (
                <Col md={4} key={item._id} className="mb-4">
                  <div 
                    className="item-card rounded-lg position-relative overflow-hidden"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      height: '100%'
                    }}
                  >
                    <div className="position-relative">
                      <div className="image-container" style={{ 
                        height: '200px', 
                        overflow: 'hidden',
                        borderRadius: '12px 12px 0 0',
                        position: 'relative'
                      }}>
                        <img
                          src={`http://localhost:5000/uploads/documents/${item.images}`}
                          className="w-100 h-100"
                          alt={item.Name}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/api/placeholder/400/200'; // Fallback image
                          }}
                        />
                        <div 
                          className="image-overlay" 
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)'
                          }}
                        ></div>
                      </div>
                      
                      <span 
                        className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill"
                        style={{ 
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          backgroundColor: '#28a745',
                          color: 'white'
                        }}
                      >
                        FOUND
                      </span>
                    </div>
                    
                    <div className="p-3">
                      <h5 className="text-white mb-2 text-truncate" style={{ fontWeight: '600' }}>{item.Name}</h5>
                      <p 
                        className="text-white-50 small mb-3" 
                        style={{ 
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.9rem',
                          height: '54px'  // Fixed height for 3 lines
                        }}
                      >
                        {item.description || 'No description available'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center small mb-2">
                        <div className="d-flex align-items-center text-white-50">
                          <FaMapMarkerAlt className="me-1 text-success" />
                          <span>{item.location || 'Unknown location'}</span>
                        </div>
                        <div className="d-flex align-items-center text-white-50">
                          <FaCalendarAlt className="me-1 text-success" />
                          <span>{formatDate(item.date || item.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 d-grid">
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="rounded-pill"
                          onClick={() => handleClaimClick(item)}
                          style={{
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            letterSpacing: '0.5px',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          CLAIM THIS ITEM
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Claim Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal}
          centered
          backdrop="static"
          contentClassName="bg-dark text-white border-success"
          style={{ 
            backdropFilter: 'blur(10px)',
          }}
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ 
              borderBottom: '1px solid rgba(40, 167, 69, 0.3)',
              background: 'linear-gradient(135deg, rgba(7, 43, 33, 0.97), rgba(10, 50, 40, 0.98))'
            }}
          >
            <Modal.Title>
              <span className="text-success me-2">|</span>
              Claim Item: {selectedItem?.Name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'rgba(7, 43, 33, 0.9)' }}>
            <div className="p-2 mb-4 rounded" style={{ background: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.2)' }}>
              <h5 className="text-success mb-2">Verification Question:</h5>
              <p className="mb-0">{selectedItem?.question}</p>
            </div>
            
            <Form>
              <Form.Group controlId="claimAnswer">
                <Form.Label className="text-success">Your Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your answer to verify ownership"
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  required
                  style={{ 
                    background: 'rgba(7, 30, 25, 0.7)',
                    border: '1px solid rgba(40, 167, 69, 0.5)',
                    color: 'white'
                  }}
                />
              </Form.Group>
            </Form>
            <p className="mt-3 text-white-50 small">
              Your answer will be sent to the person who posted this item.
              They will review your claim and either accept or reject it based on your answer.
            </p>
          </Modal.Body>
          <Modal.Footer style={{ 
            borderTop: '1px solid rgba(40, 167, 69, 0.3)',
            background: 'rgba(7, 43, 33, 0.9)'
          }}>
            <Button 
              variant="outline-light" 
              onClick={handleCloseModal}
              className="rounded-pill px-3"
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleClaimSubmit}
              className="rounded-pill px-4"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              Submit Claim
            </Button>
          </Modal.Footer>
        </Modal>
        
        <style jsx>{`
          .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          }
          
          .item-card:hover button {
            transform: scale(1.03);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
            }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default ClaimItemsPage;