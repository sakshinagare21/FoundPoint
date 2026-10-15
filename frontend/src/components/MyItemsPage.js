import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert, Button, Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaTrashAlt, FaEdit, FaEye, FaPlus } from 'react-icons/fa';

const MyItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [claimCounts, setClaimCounts] = useState({});
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
        setItems(response.data);
        
        // Get claim counts for each item
        const counts = {};
        await Promise.all(response.data.map(async (item) => {
          try {
            const claimsResponse = await axios.get(`http://localhost:5000/api/claims/item/${item._id}`);
            counts[item._id] = claimsResponse.data.length;
          } catch (err) {
            console.error(`Error fetching claims for item ${item._id}:`, err);
            counts[item._id] = 0;
          }
        }));
        
        setClaimCounts(counts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your items. Please try again later.');
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserItems();
    }
  }, [userEmail]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/lostandfound/${itemToDelete._id}`);
      
      // Update local state
      setItems(items.filter(item => item._id !== itemToDelete._id));
      toast.success('Item deleted successfully');
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
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

  const filteredItems = filterStatus === 'all' 
    ? items 
    : items.filter(item => item.status === filterStatus);

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
            <h4 className="mb-3">Please log in to view your items</h4>
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
            My Posted Items
          </h2>
          
          <div className="d-flex align-items-center gap-3">
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
                {filterStatus === 'all' ? 'All Items' : 
                  filterStatus === 'Lost' ? 'Lost Items' : 'Found Items'}
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
                  All Items
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => setFilterStatus('Lost')}
                  className={filterStatus === 'Lost' ? 'active text-danger' : 'text-white-50'}
                  style={{ 
                    backgroundColor: filterStatus === 'Lost' ? 'rgba(220, 53, 69, 0.15)' : 'transparent',
                  }}
                >
                  Lost Items
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => setFilterStatus('Found')}
                  className={filterStatus === 'Found' ? 'active text-success' : 'text-white-50'}
                  style={{ 
                    backgroundColor: filterStatus === 'Found' ? 'rgba(40, 167, 69, 0.15)' : 'transparent',
                  }}
                >
                  Found Items
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Button 
              as={Link} 
              to="/postitem" 
              variant="success"
              className="rounded-pill d-flex align-items-center"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
            >
              <FaPlus className="me-2" />
              Post Item
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white-50 mt-3">Loading your items...</p>
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
            <FaPlus className="text-success mb-3" size={40} />
            <h5 className="text-white">No items found with this filter</h5>
            <p className="text-white-50 mb-0">
              {filterStatus === 'all' 
                ? "You haven't posted any items yet."
                : `You haven't posted any ${filterStatus.toLowerCase()} items yet.`}
            </p>
            <Button 
              as={Link} 
              to="/postitem" 
              variant="success" 
              className="mt-3 rounded-pill px-4"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              <FaPlus className="me-2" />
              Post New Item
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredItems.map((item) => (
              <Col key={item._id}>
                <div 
                  className="item-card rounded-lg position-relative overflow-hidden"
                  style={{
                    borderRadius: '12px',
                    border: `1px solid rgba(${item.status === 'Lost' ? '220, 53, 69' : '40, 167, 69'}, 0.2)`,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                >
                  <div className="position-relative">
                    <div className="image-container img-fluid" style={{ 
                      height: '200px', 
                      overflow: 'hidden',
                      borderRadius: '12px 12px 0 0',
                      position: 'relative'
                    }}>
                      {item.images ? (
                        <img
                          src={`http://localhost:5000/uploads/documents/${item.images}`}
                          className="w-100 h-100 img img-fluid"
                          alt={item.Name || 'Item image'}
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
                        backgroundColor: item.status === 'Lost' ? '#dc3545' : '#28a745',
                        color: 'white'
                      }}
                    >
                      {item.status}
                    </span>
                    
                    <div 
                      className="position-absolute top-0 end-0 m-3"
                    >
                      <Badge 
                        bg="info" 
                        className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill"
                        // style={{
                        //   backgroundColor: 'rgba(13, 202, 240, 0.2) !important',
                        //   border: '1px solid rgba(13, 202, 240, 0.3)',
                        //   color: '#0dcaf0',
                        //   fontWeight: '600',
                        //   fontSize: '0.75rem',
                        //   letterSpacing: '0.5px'
                        // }}
                      >
                        <FaEye className="me-1" />
                        Claims: {claimCounts[item._id] || 0}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h5 className="text-white mb-2 text-truncate" style={{ fontWeight: '600' }}>
                      {item.Name}
                    </h5>
                    
                    <div className="d-flex justify-content-between align-items-center small mb-3">
                      <div className="d-flex align-items-center text-white-50">
                        <FaMapMarkerAlt className={`me-1 text-${item.status === 'Lost' ? 'danger' : 'success'}`} />
                        <span>{item.location || 'Unknown location'}</span>
                      </div>
                      <div className="d-flex align-items-center text-white-50">
                        <FaCalendarAlt className={`me-1 text-${item.status === 'Lost' ? 'danger' : 'success'}`} />
                        <span>{formatDate(item.date || item.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div 
                      className="mb-3 p-2 rounded"
                      style={{ 
                        background: 'rgba(7, 30, 25, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        maxHeight: '80px',
                        overflow: 'hidden'
                      }}
                    >
                      <p className="text-white small mb-0" style={{ fontSize: '0.9rem' }}>
                        {item.description.length > 100 
                          ? `${item.description.substring(0, 100)}...` 
                          : item.description}
                      </p>
                    </div>
                    
                    <div className="d-flex justify-content-between mt-3">
                      {claimCounts[item._id] > 0 ? (
                        <Button 
                          as={Link}
                          to="/receivedclaims" 
                          variant="outline-info" 
                          className="rounded-pill d-flex align-items-center"
                          style={{
                            background: 'rgba(13, 202, 240, 0.1)',
                            border: '1px solid rgba(13, 202, 240, 0.3)',
                            color: '#0dcaf0',
                            letterSpacing: '0.5px',
                            fontWeight: '500',
                            boxShadow: '0 4px 12px rgba(13, 202, 240, 0.15)'
                          }}
                        >
                          <FaEye className="me-2" />
                          View Claims
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-secondary" 
                          className="rounded-pill d-flex align-items-center"
                          disabled
                          style={{
                            background: 'rgba(108, 117, 125, 0.1)',
                            border: '1px solid rgba(108, 117, 125, 0.2)',
                            color: '#6c757d',
                            opacity: '0.7',
                            letterSpacing: '0.5px',
                            fontWeight: '500'
                          }}
                        >
                          <FaEye className="me-2" />
                          No Claims
                        </Button>
                      )}
                      
                      <div className="d-flex gap-2">
                        <Button 
                          as={Link}
                          to={`/edit-item/${item._id}`} 
                          variant="outline-success" 
                          className="rounded-pill d-flex align-items-center justify-content-center"
                          style={{
                            background: 'rgba(40, 167, 69, 0.1)',
                            border: '1px solid rgba(40, 167, 69, 0.3)',
                            color: '#28a745',
                            width: '38px',
                            height: '38px',
                            padding: '0'
                          }}
                        >
                          <FaEdit />
                        </Button>
                        
                        <Button 
                          variant="outline-danger" 
                          className="rounded-pill d-flex align-items-center justify-content-center"
                          onClick={() => handleDeleteClick(item)}
                          style={{
                            background: 'rgba(220, 53, 69, 0.1)',
                            border: '1px solid rgba(220, 53, 69, 0.3)',
                            color: '#dc3545',
                            width: '38px',
                            height: '38px',
                            padding: '0'
                          }}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
        
        {/* Delete Confirmation Modal */}
        <Modal 
          show={showDeleteModal} 
          onHide={handleCloseDeleteModal}
          centered
          contentClassName="bg-dark text-white border-success"
          style={{
            backdropFilter: 'blur(10px)'
          }}
        >
          <Modal.Header 
            closeButton 
            className="border-success"
            style={{
              background: 'rgba(5, 30, 25, 0.97)'
            }}
          >
            <Modal.Title style={{ fontWeight: '600' }}>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: 'rgba(7, 43, 33, 0.97)'
            }}
          >
            <p>Are you sure you want to delete "{itemToDelete?.Name}"? This action cannot be undone.</p>
            
            {(claimCounts[itemToDelete?._id] > 0) && (
              <Alert 
                variant="warning" 
                className="mt-3"
                style={{
                  background: 'rgba(255, 193, 7, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              >
                <strong>Warning:</strong> This item has {claimCounts[itemToDelete?._id]} active claims. 
                Deleting this item will also remove all associated claims.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer 
            className="border-success"
            style={{
              background: 'rgba(5, 30, 25, 0.97)'
            }}
          >
            <Button 
              variant="outline-secondary" 
              onClick={handleCloseDeleteModal}
              className="rounded-pill"
              style={{
                background: 'rgba(108, 117, 125, 0.1)',
                border: '1px solid rgba(108, 117, 125, 0.3)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              className="rounded-pill"
              style={{
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
            >
              <FaTrashAlt className="me-2" />
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        
        <style jsx>{`
          .item-card {
            transition: all 0.3s ease;
          }
          
          .item-card:hover {
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
          
          .modal-content {
            border-radius: 12px;
            border: 1px solid rgba(40, 167, 69, 0.3);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
          }
          
          .modal-header .close {
            color: white;
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

export default MyItemsPage;