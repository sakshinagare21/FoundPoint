import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEnvelope } from 'react-icons/fa';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [itemDetails, setItemDetails] = useState({});
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

  useEffect(() => {
    const fetchClaims = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/claims/user/${userEmail}`);
        setClaims(response.data);
        
        const itemIds = [...new Set(response.data.map(claim => claim.itemId))];
        const itemDetailsObj = {};
        
        await Promise.all(itemIds.map(async (itemId) => {
          try {
            const itemResponse = await axios.get(`http://localhost:5000/lostandfound/getsingle/${itemId}`);
            itemDetailsObj[itemId] = itemResponse.data;
          } catch (err) {
            console.error(`Error fetching item details for ${itemId}:`, err);
          }
        }));
        
        setItemDetails(itemDetailsObj);
        setLoading(false);

        // Show notification for accepted/rejected claims on page load
        response.data.forEach(claim => {
          if (claim.status === 'accepted') {
            toast.success(`Your claim for "${itemDetailsObj[claim.itemId]?.Name}" was accepted!`);
          } else if (claim.status === 'rejected') {
            toast.error(`Your claim for "${itemDetailsObj[claim.itemId]?.Name}" was rejected.`);
          }
        });

      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('Failed to load your claims. Please try again later.');
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchClaims();
    }
  }, [userEmail]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
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

  const filteredClaims = filterStatus === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === filterStatus);

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
            <h4 className="mb-3">Please log in to view your claims</h4>
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
            My Claims
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
            <p className="text-white-50 mt-3">Loading your claims...</p>
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
        ) : filteredClaims.length === 0 ? (
          <div className="text-center py-5 my-4 rounded-lg"
            style={{ 
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px dashed rgba(40, 167, 69, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FaFilter className="text-success mb-3" size={40} />
            <h5 className="text-white">No claims found with this filter</h5>
            <p className="text-white-50 mb-0">Try changing your filter or make a new claim.</p>
            <Button 
              variant="success" 
              onClick={() => navigate('/claim-items')}
              className="mt-3 rounded-pill px-4"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              Browse Items to Claim
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredClaims.map((claim) => {
              const item = itemDetails[claim.itemId];
              const statusColor = getStatusColor(claim.status);
              
              return (
                <Col key={claim._id}>
                  <div 
                    className="claim-card rounded-lg position-relative overflow-hidden"
                    style={{
                      borderRadius: '12px',
                      border: `1px solid rgba(${statusColor === 'success' ? '40, 167, 69' : 
                              statusColor === 'warning' ? '255, 193, 7' :
                              statusColor === 'danger' ? '220, 53, 69' : '108, 117, 125'}, 0.2)`,
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
                        {item && item.images ? (
                          <img
                            src={`http://localhost:5000/uploads/documents/${item.images}`}
                            className="w-100 h-100"
                            alt={item?.Name || 'Item image'}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/api/placeholder/400/200'; // Fallback image
                            }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center w-100 h-100"
                            style={{
                              background: 'rgba(7, 43, 33, 0.6)',
                            }}
                          >
                            <p className="text-white-50 mb-0">No image available</p>
                          </div>
                        )}
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
                          backgroundColor: item?.status === 'Lost' ? '#dc3545' : '#28a745',
                          color: 'white'
                        }}
                      >
                        {item?.status || 'UNKNOWN'}
                      </span>
                      
                      <div 
                        className="position-absolute top-0 end-0 m-3"
                      >
                        {getStatusBadge(claim.status)}
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h5 className="text-white mb-2 text-truncate" style={{ fontWeight: '600' }}>
                        {item ? item.Name : 'Unknown Item'}
                      </h5>
                      
                      <div className="d-flex justify-content-between align-items-center small mb-3">
                        <div className="d-flex align-items-center text-white-50">
                          <FaMapMarkerAlt className={`me-1 text-${item?.status === 'Lost' ? 'danger' : 'success'}`} />
                          <span>{item?.location || 'Unknown location'}</span>
                        </div>
                        <div className="d-flex align-items-center text-white-50">
                          <FaCalendarAlt className={`me-1 text-${item?.status === 'Lost' ? 'danger' : 'success'}`} />
                          <span>{formatDate(item?.date || item?.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div 
                        className="mb-3 p-2 rounded"
                        style={{ 
                          background: 'rgba(7, 30, 25, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <p className="text-white-50 small mb-1">Your answer:</p>
                        <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>{claim.answer}</p>
                      </div>

                      {claim.status === 'accepted' && (
                        <div 
                          className="p-3 rounded mb-3"
                          style={{
                            background: 'rgba(40, 167, 69, 0.1)',
                            border: '1px solid rgba(40, 167, 69, 0.2)',
                          }}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            <h6 className="text-success mb-0">Claim Accepted!</h6>
                          </div>
                          <p className="text-white-50 small mb-2">
                            Contact the poster at:
                          </p>
                          <a 
                            href={`mailto:${item?.userEmail}`} 
                            className="d-flex align-items-center text-white"
                            style={{
                              textDecoration: 'none',
                              fontWeight: '500'
                            }}
                          >
                            <FaEnvelope className="text-success me-2" />
                            {item?.userEmail}
                          </a>
                          
                          <div className="mt-3">
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="rounded-pill w-100"
                              onClick={() => window.location.href = `mailto:${item?.userEmail}`}
                              style={{
                                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                                fontWeight: '500',
                                letterSpacing: '0.5px'
                              }}
                            >
                              <FaEnvelope className="me-2" />
                              Contact Poster
                            </Button>
                          </div>
                        </div>
                      )}

                      {claim.status === 'rejected' && (
                        <div 
                          className="p-3 rounded mb-3"
                          style={{
                            background: 'rgba(220, 53, 69, 0.1)',
                            border: '1px solid rgba(220, 53, 69, 0.2)',
                          }}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <FaTimesCircle className="text-danger me-2" />
                            <h6 className="text-danger mb-0">Claim Rejected</h6>
                          </div>
                          <p className="text-white-50 small mb-0">
                            Your claim was rejected. Please double-check your answer or try claiming another item.
                          </p>
                        </div>
                      )}
                      
                      {claim.status === 'pending' && (
                        <div 
                          className="p-3 rounded mb-3"
                          style={{
                            background: 'rgba(255, 193, 7, 0.1)',
                            border: '1px solid rgba(255, 193, 7, 0.2)',
                          }}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <FaHourglassHalf className="text-warning me-2" />
                            <h6 className="text-warning mb-0">Claim Pending</h6>
                          </div>
                          <p className="text-white-50 small mb-0">
                            Your claim is being reviewed by the poster. Check back later for updates.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
        
        <style jsx>{`
          .claim-card {
            transition: all 0.3s ease;
          }
          
          .claim-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          }
          
          .dropdown-item {
            transition: all 0.2s ease;
          }
          
          .dropdown-item:hover {
            background-color: rgba(40, 167, 69, 0.1) !important;
            color: #fff !important;
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

export default MyClaimsPage;