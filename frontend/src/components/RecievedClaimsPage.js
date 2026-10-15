import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaEnvelope, 
  FaQuestion,
  FaComments
} from 'react-icons/fa';

const ReceivedClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [groupedClaims, setGroupedClaims] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseAction, setResponseAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch user's items
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/lostandfound/user/${userEmail}`);
        setMyItems(response.data);
        
        // Get all item IDs
        const itemIds = response.data.map(item => item._id);
        
        // Fetch claims for each item
        const allClaims = [];
        await Promise.all(itemIds.map(async (itemId) => {
          try {
            const claimsResponse = await axios.get(`http://localhost:5000/api/claims/item/${itemId}`);
            allClaims.push(...claimsResponse.data);
          } catch (err) {
            console.error(`Error fetching claims for item ${itemId}:`, err);
          }
        }));
        
        setClaims(allClaims);
        
        // Group claims by item
        const grouped = {};
        allClaims.forEach(claim => {
          if (!grouped[claim.itemId]) {
            grouped[claim.itemId] = [];
          }
          grouped[claim.itemId].push(claim);
        });
        
        setGroupedClaims(grouped);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your items and claims. Please try again later.');
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserItems();
    }
  }, [userEmail]);

  const getItem = (itemId) => {
    return myItems.find(item => item._id === itemId);
  };

  const handleRespondToClaim = (claim) => {
    setSelectedClaim(claim);
    setResponseMessage('');
    setResponseAction('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
    setResponseMessage('');
    setResponseAction('');
  };

  const handleSubmitResponse = async () => {
    if (!responseAction) {
      toast.error('Please select whether to accept or reject the claim');
      return;
    }
    
    try {
      await axios.put('http://localhost:5000/api/claims/respond', {
        claimId: selectedClaim._id,
        status: responseAction,
        message: responseMessage || undefined
      });
      
      toast.success(`Claim ${responseAction} successfully!`);
      
      // Update local state
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim._id === selectedClaim._id 
            ? { ...claim, status: responseAction } 
            : claim
        )
      );
      
      // Update grouped claims
      setGroupedClaims(prevGrouped => {
        const itemId = selectedClaim.itemId;
        return {
          ...prevGrouped,
          [itemId]: prevGrouped[itemId].map(claim => 
            claim._id === selectedClaim._id 
              ? { ...claim, status: responseAction } 
              : claim
          )
        };
      });
      
      handleCloseModal();
    } catch (error) {
      console.error('Error responding to claim:', error);
      toast.error(error.response?.data?.message || 'Error responding to claim!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': 
        return (
          <span 
            className="px-3 py-1 rounded-pill d-inline-flex align-items-center"
            style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              color: '#ffc107'
            }}
          >
            <FaHourglassHalf className="me-1" /> PENDING
          </span>
        );
      case 'accepted': 
        return (
          <span 
            className="px-3 py-1 rounded-pill d-inline-flex align-items-center"
            style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              border: '1px solid rgba(40, 167, 69, 0.3)',
              color: '#28a745'
            }}
          >
            <FaCheckCircle className="me-1" /> ACCEPTED
          </span>
        );
      case 'rejected': 
        return (
          <span 
            className="px-3 py-1 rounded-pill d-inline-flex align-items-center"
            style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              color: '#dc3545'
            }}
          >
            <FaTimesCircle className="me-1" /> REJECTED
          </span>
        );
      default: 
        return (
          <span 
            className="px-3 py-1 rounded-pill d-inline-flex align-items-center"
            style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(108, 117, 125, 0.2)',
              border: '1px solid rgba(108, 117, 125, 0.3)',
              color: '#6c757d'
            }}
          >
            UNKNOWN
          </span>
        );
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

  // Filter items with claims based on status
  const filteredItems = Object.keys(groupedClaims).filter(itemId => {
    if (filterStatus === 'all') return true;
    return groupedClaims[itemId].some(claim => claim.status === filterStatus);
  });
  
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
            <h4 className="mb-3">Please log in to view received claims</h4>
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
    <>
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
            Received Claims
          </h2>
          
          <Dropdown>
            <Dropdown.Toggle 
              variant="outline-success" 
              id="filter-dropdown"
              className="rounded-pill d-flex align-items-center"
              style={{
                borderWidth: '1.5px',
                background: 'rgba(7, 43, 33, 0.4)',
                backdropFilter: 'blur(10px)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
            >
              <FaFilter className="me-2" />
              {filterStatus === 'all' ? 'All Claims' : 
                filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ 
              background: 'rgba(7, 43, 33, 0.95)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(40, 167, 69, 0.3)',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)'
            }}>
              <Dropdown.Item 
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'active text-success' : 'text-white-50'}
                style={{ 
                  backgroundColor: filterStatus === 'all' ? 'rgba(40, 167, 69, 0.15)' : 'transparent',
                }}
              >
                All Claims
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={() => setFilterStatus('pending')}
                className={filterStatus === 'pending' ? 'active text-warning' : 'text-white-50'}
                style={{ 
                  backgroundColor: filterStatus === 'pending' ? 'rgba(255, 193, 7, 0.15)' : 'transparent',
                }}
              >
                <FaHourglassHalf className="me-2" />
                Pending
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={() => setFilterStatus('accepted')}
                className={filterStatus === 'accepted' ? 'active text-success' : 'text-white-50'}
                style={{ 
                  backgroundColor: filterStatus === 'accepted' ? 'rgba(40, 167, 69, 0.15)' : 'transparent',
                }}
              >
                <FaCheckCircle className="me-2" />
                Accepted
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={() => setFilterStatus('rejected')}
                className={filterStatus === 'rejected' ? 'active text-danger' : 'text-white-50'}
                style={{ 
                  backgroundColor: filterStatus === 'rejected' ? 'rgba(220, 53, 69, 0.15)' : 'transparent',
                }}
              >
                <FaTimesCircle className="me-2" />
                Rejected
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white-50 mt-3">Loading received claims...</p>
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
            <FaFilter className="text-success mb-3" size={40} />
            <h5 className="text-white">No claims found with this filter</h5>
            <p className="text-white-50 mb-0">Try changing your filter or post more items.</p>
            <Button 
              variant="success" 
              onClick={() => navigate('/post-item')}
              className="mt-3 rounded-pill px-4"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              Post New Item
            </Button>
          </div>
        ) : (
          filteredItems.map(itemId => {
            const item = getItem(itemId);
            if (!item) return null;
            
            // Filter claims by status if needed
            const itemClaims = filterStatus === 'all' 
              ? groupedClaims[itemId] 
              : groupedClaims[itemId].filter(claim => claim.status === filterStatus);
              
            if (itemClaims.length === 0) return null;
            
            return (
              <div key={itemId} className="mb-5">
                <div 
                  className="p-3 mb-3 rounded-lg"
                  style={{
                    background: 'rgba(40, 167, 69, 0.1)',
                    borderLeft: '4px solid #28a745',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h4 className="text-white mb-1" style={{ fontWeight: '600' }}>
                        {item.Name}
                      </h4>
                      <div className="d-flex align-items-center small text-white-50">
                        <Badge 
                          bg={item.status === 'Lost' ? 'danger' : 'success'} 
                          className="me-2 py-2 px-3"
                          style={{ 
                            borderRadius: '12px',
                            fontWeight: '500',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {item.status}
                        </Badge>
                        <FaMapMarkerAlt className="me-1" /> {item.location || 'Unknown location'}
                        <span className="mx-2">•</span>
                        <FaCalendarAlt className="me-1" /> {formatDate(item.date || item.createdAt)}
                      </div>
                    </div>
                    <div className="mt-2 mt-md-0">
                      <div 
                        className="px-3 py-1 rounded-pill d-inline-flex align-items-center"
                        style={{ 
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff'
                        }}
                      >
                        <FaComments className="me-1" />
                        {itemClaims.length} {itemClaims.length === 1 ? 'Claim' : 'Claims'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="mb-2 p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(7, 30, 25, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <div className="d-flex align-items-center mb-2">
                    <FaQuestion className="text-success me-2" />
                    <h6 className="text-white mb-0">Verification Question</h6>
                  </div>
                  <p className="text-white-50 mb-0">{item.question}</p>
                </div>
                
                <Row xs={1} md={2} className="g-4">
                  {itemClaims.map(claim => (
                    <Col key={claim._id}>
                      <div 
                        className="claim-card rounded-lg position-relative overflow-hidden h-100"
                        style={{
                          background: 'rgba(15, 40, 35, 0.6)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '12px',
                          border: `1px solid rgba(${claim.status === 'accepted' ? '40, 167, 69' : 
                                 claim.status === 'pending' ? '255, 193, 7' :
                                 claim.status === 'rejected' ? '220, 53, 69' : '108, 117, 125'}, 0.2)`,
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <div className="d-flex align-items-center text-white">
                                <FaEnvelope className={`text-${claim.status === 'accepted' ? 'success' : claim.status === 'pending' ? 'warning' : 'danger'} me-2`} />
                                <h6 className="mb-0">{claim.claimantEmail}</h6>
                              </div>
                              <small className="text-white-50">
                                Claimed on {formatDate(claim.createdAt)}
                              </small>
                            </div>
                            <div>
                              {getStatusBadge(claim.status)}
                            </div>
                          </div>
                          
                          <div 
                            className="mb-3 p-3 rounded"
                            style={{ 
                              background: 'rgba(7, 30, 25, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <p className="text-white-50 small mb-1">Their answer:</p>
                            <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>{claim.answer}</p>
                          </div>
                          
                          {claim.status === 'pending' && (
                            <div className="d-flex gap-2">
                              <Button 
                                variant="success" 
                                className="w-100 rounded-pill py-2"
                                style={{
                                  background: 'linear-gradient(135deg, #28a745, #219a3a)',
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                                  fontWeight: '500',
                                  letterSpacing: '0.5px'
                                }}
                                onClick={() => {
                                  setSelectedClaim(claim);
                                  setResponseAction('accepted');
                                  setShowModal(true);
                                }}
                              >
                                <FaCheckCircle className="me-2" />
                                Accept
                              </Button>
                              <Button 
                                variant="danger" 
                                className="w-100 rounded-pill py-2"
                                style={{
                                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                                  fontWeight: '500',
                                  letterSpacing: '0.5px'
                                }}
                                onClick={() => {
                                  setSelectedClaim(claim);
                                  setResponseAction('rejected');
                                  setShowModal(true);
                                }}
                              >
                                <FaTimesCircle className="me-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {claim.status === 'accepted' && (
                            <div 
                              className="p-3 rounded"
                              style={{
                                background: 'rgba(40, 167, 69, 0.1)',
                                border: '1px solid rgba(40, 167, 69, 0.2)',
                              }}
                            >
                              <div className="d-flex align-items-center mb-2">
                                <FaCheckCircle className="text-success me-2" />
                                <h6 className="text-success mb-0">You accepted this claim</h6>
                              </div>
                              <p className="text-white-50 small mb-2">
                                Contact the claimant at:
                              </p>
                              <a 
                                href={`mailto:${claim.claimantEmail}`} 
                                className="d-flex align-items-center text-white"
                                style={{
                                  textDecoration: 'none',
                                  fontWeight: '500'
                                }}
                              >
                                <FaEnvelope className="text-success me-2" />
                                {claim.claimantEmail}
                              </a>
                            </div>
                          )}
                          
                          {claim.status === 'rejected' && (
                            <div 
                              className="p-3 rounded"
                              style={{
                                background: 'rgba(220, 53, 69, 0.1)',
                                border: '1px solid rgba(220, 53, 69, 0.2)',
                              }}
                            >
                              <div className="d-flex align-items-center mb-2">
                                <FaTimesCircle className="text-danger me-2" />
                                <h6 className="text-danger mb-0">You rejected this claim</h6>
                              </div>
                              <p className="text-white-50 small mb-0">
                                This claim has been marked as rejected.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                
                <hr className="mt-4 mb-5" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>
            );
          })
        )}
        
        {/* Response Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal}
          backdrop="static"
          centered
          contentClassName="border-0"
          dialogClassName="modal-dialog-centered"
        >
          <Modal.Header 
            closeButton
            style={{ 
              background: 'linear-gradient(135deg, rgba(5, 30, 25, 0.97), rgba(10, 40, 35, 0.98))',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
          >
            <Modal.Title style={{ fontWeight: '600' }}>
              {responseAction === 'accepted' ? (
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="text-success me-2" />
                  Accept Claim
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <FaTimesCircle className="text-danger me-2" />
                  Reject Claim
                </div>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{ 
              background: 'linear-gradient(135deg, rgba(5, 30, 25, 0.97), rgba(10, 40, 35, 0.98))',
              color: '#fff'
            }}
          >
            {selectedClaim && (
              <>
                <div 
                  className="p-3 mb-3 rounded"
                  style={{ 
                    background: 'rgba(7, 30, 25, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p className="text-white-50 mb-1">Claim from:</p>
                  <div className="d-flex align-items-center">
                    <FaEnvelope className="text-success me-2" />
                    <p className="text-white mb-0" style={{ fontWeight: '500' }}>
                      {selectedClaim.claimantEmail}
                    </p>
                  </div>
                </div>
                
                <div 
                  className="p-3 mb-3 rounded"
                  style={{ 
                    background: 'rgba(7, 30, 25, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p className="text-white-50 mb-1">Their answer:</p>
                  <p className="text-white mb-0">{selectedClaim.answer}</p>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-white-50">
                    {responseAction === 'accepted' 
                      ? "Add contact information or instructions for item pickup (Optional)"
                      : "Explain why you're rejecting this claim (Optional)"}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={
                      responseAction === 'accepted' 
                        ? "E.g., You can pick up the item at the campus security office..." 
                        : "E.g., The answer doesn't match our records..."
                    }
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    style={{
                      background: 'rgba(15, 40, 35, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  />
                </Form.Group>
                
                
               
                <Alert variant={responseAction === 'accepted' ? "success" : "warning"}>
                  {responseAction === 'accepted' 
                    ? "By accepting this claim, you're confirming this person is the rightful owner of the item." 
                    : "Rejected claims can't be undone. The claimant will be notified that their claim was rejected."}
                </Alert>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant={responseAction === 'accepted' ? "success" : "danger"}
              onClick={handleSubmitResponse}
            >
              {responseAction === 'accepted' ? "Accept Claim" : "Reject Claim"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      </div>
    </>
  );
};

export default ReceivedClaimsPage;