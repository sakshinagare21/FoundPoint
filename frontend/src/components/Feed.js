import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { Container, Row, Col, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaFilter, FaSort, FaMapPin, FaEye } from 'react-icons/fa';

const Feed = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', 'found'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLostItems();
    fetchFoundItems();
  }, []);

  const fetchLostItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/lostandfound/lost');
      setLostItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Lost fetch error:', err.response?.data || err.message);
      setLoading(false);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/lostandfound/found');
      setFoundItems(res.data);
    } catch (err) {
      console.error('Found fetch error:', err.response?.data || err.message);
    }
  };

  // Filter items based on search query
  const filteredLostItems = lostItems.filter(item => 
    item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFoundItems = foundItems.filter(item => 
    item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get formatted date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderItemCard = (item, type) => (
    <Col md={4} key={item._id} className="mb-4">
      <div 
        className="item-card rounded-lg position-relative overflow-hidden"
        style={{
// position: 'relative',
  backgroundImage: `
    linear-gradient(rgba(0, 20, 15, 0.7), rgba(5, 30, 25, 0.7)),
    url("WlcmBackImg.jpg") 
  `,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  // minHeight: '100vh',
  fontFamily: "'Poppins', sans-serif",
  color: '#fff',          borderRadius: '12px',
          border: '1px solid rgba(40, 167, 69, 0.2)',
          boxShadow: '0 10px 25px rgba(0, 60, 40, 0.3)',
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
          
          <Badge 
            bg={type === 'lost' ? 'danger' : 'success'} 
            className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill"
            style={{ 
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {type === 'lost' ? 'LOST' : 'FOUND'}
          </Badge>
          
          <Button 
            variant="dark" 
            size="sm" 
            className="position-absolute top-0 end-0 m-3 rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ 
              width: '38px', 
              height: '38px', 
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <FaEye size={16} />
          </Button>
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
              <span>{formatDate(item.date)}</span>
            </div>
          </div>
          
          <div className="mt-3 d-grid">
            <Button 
              variant="outline-success" 
              size="sm" 
              className="rounded-pill"
              style={{
                borderWidth: '1.5px',
                fontWeight: '500',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease'
              }}
            >
              {type === 'lost' ? 'I LOST THIS!' : 'I FOUND THIS!'}
            </Button>
          </div>
        </div>
      </div>
    </Col>
  );

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
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="text-white mb-3 mb-md-0" style={{ fontWeight: '600' }}>
            <span className="text-success me-2" style={{ fontSize: '28px', fontWeight: '700' }}>|</span>
            Browse Items
          </h2>
          
          <div className="d-flex gap-2">
            <Button 
              variant={activeTab === 'all' ? 'success' : 'outline-success'} 
              className="rounded-pill px-3"
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'linear-gradient(135deg, #28a745, #219a3a)' : 'transparent',
                borderWidth: '2px',
                boxShadow: activeTab === 'all' ? '0 4px 12px rgba(40, 167, 69, 0.3)' : 'none'
              }}
            >
              All Items
            </Button>
            <Button 
              variant={activeTab === 'lost' ? 'danger' : 'outline-danger'} 
              className="rounded-pill px-3"
              onClick={() => setActiveTab('lost')}
              style={{
                background: activeTab === 'lost' ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'transparent',
                borderWidth: '2px',
                boxShadow: activeTab === 'lost' ? '0 4px 12px rgba(220, 53, 69, 0.3)' : 'none'
              }}
            >
              Lost
            </Button>
            <Button 
              variant={activeTab === 'found' ? 'success' : 'outline-success'} 
              className="rounded-pill px-3"
              onClick={() => setActiveTab('found')}
              style={{
                background: activeTab === 'found' ? 'linear-gradient(135deg, #28a745, #219a3a)' : 'transparent',
                borderWidth: '2px',
                boxShadow: activeTab === 'found' ? '0 4px 12px rgba(40, 167, 69, 0.3)' : 'none'
              }}
            >
              Found
            </Button>
          </div>
        </div>
        
        <Row className="mb-4">
          <Col lg={8} className="mb-3 mb-lg-0">
            <InputGroup>
              <Form.Control
                placeholder="Search for items..."
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
          {/* <Col lg={4} className="d-flex justify-content-lg-end">
            <Button 
              variant="outline-secondary" 
              className="me-2 text-light rounded-pill"
              style={{ 
                borderColor: 'rgba(40, 167, 69, 0.5)',
                background: 'rgba(7, 43, 33, 0.4)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaFilter className="me-2" />
              Filter
            </Button>
            <Button 
              variant="outline-secondary"
              className="text-light rounded-pill"
              style={{ 
                borderColor: 'rgba(40, 167, 69, 0.5)',
                background: 'rgba(7, 43, 33, 0.4)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaSort className="me-2" />
              Sort
            </Button>
          </Col> */}
        </Row>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white-50 mt-3">Loading items...</p>
          </div>
        ) : (
          <>
            {(activeTab === 'all' || activeTab === 'lost') && filteredLostItems.length > 0 && (
              <>
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
                    <FaMapPin className="text-danger" size={18} />
                  </div>
                  <h3 className="text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Lost Items</h3>
                </div>
                
                <Row className="mb-5">
                  {filteredLostItems.map(item => renderItemCard(item, 'lost'))}
                </Row>
              </>
            )}
            
            {(activeTab === 'all' || activeTab === 'lost') && filteredLostItems.length === 0 && (
              <div className="text-center py-5 my-4 rounded-lg"
                style={{ 
                  background: 'rgba(220, 53, 69, 0.1)',
                  border: '1px dashed rgba(220, 53, 69, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FaMapPin className="text-danger mb-3" size={40} />
                <h5 className="text-white">No lost items found</h5>
                <p className="text-white-50 mb-0">Try a different search or check back later.</p>
              </div>
            )}
            
            {(activeTab === 'all' || activeTab === 'found') && filteredFoundItems.length > 0 && (
              <>
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
                    <FaMapMarkerAlt className="text-success" size={18} />
                  </div>
                  <h3 className="text-white mb-0" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Found Items</h3>
                </div>
                
                <Row>
                  {filteredFoundItems.map(item => renderItemCard(item, 'found'))}
                </Row>
              </>
            )}
            
            {(activeTab === 'all' || activeTab === 'found') && filteredFoundItems.length === 0 && (
              <div className="text-center py-5 my-4 rounded-lg"
                style={{ 
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px dashed rgba(40, 167, 69, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FaMapMarkerAlt className="text-success mb-3" size={40} />
                <h5 className="text-white">No found items found</h5>
                <p className="text-white-50 mb-0">Try a different search or check back later.</p>
              </div>
            )}
          </>
        )}
        
        <style jsx>{`
          .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          
          .item-card:hover button {
            background: rgba(40, 167, 69, 0.15);
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

export default Feed;