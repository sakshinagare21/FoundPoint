import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaSearch, FaBrain, FaShieldAlt, FaBell, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHandsHelping } from 'react-icons/fa';
import NavBar from './NavBar';
import axios from 'axios';


const About = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear any error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setLoading(true);
      try {
        // Fixed endpoint to match the backend route
        await axios.post('http://localhost:5000/api/msg', form);
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000); // Clear success message after 4s
      } catch (err) {
        console.error('Contact form submission error:', err);
        setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  // What we offer features
  const features = [
    { 
      icon: <FaSearch className="text-success" size={32} />, 
      title: "Smart Item Search", 
      desc: "Powerful search algorithms help connect lost items with their owners based on descriptions and location." 
    },
    { 
      icon: <FaBrain className="text-success" size={32} />, 
      title: "AI Image Matching", 
      desc: "Our advanced AI compares uploaded photos to identify potential matches with higher accuracy." 
    },
    { 
      icon: <FaShieldAlt className="text-success" size={32} />, 
      title: "Secure Verification", 
      desc: "Our verification process ensures items are returned to their rightful owners safely." 
    },
    { 
      icon: <FaBell className="text-success" size={32} />, 
      title: "Real-time Alerts", 
      desc: "Get instant notifications when similar items are found in your vicinity." 
    }
  ];

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage: `
          linear-gradient(rgba(0, 20, 15, 0.8), rgba(5, 30, 25, 0.8)),
          url("WlcmBackImg.jpg") 
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
        color: '#fff'
      }}
    >
      <NavBar />
      
      {/* Hero Section */}
      <Container className="py-5 mt-5">
        <Row className="align-items-center mb-5">
          <Col lg={7} className="text-center text-lg-start">
            <h1 
              className="display-4 fw-bold mb-4" 
              style={{ 
                letterSpacing: "1px",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                lineHeight: "1.2"
              }}
            >
              About <span className="text-success" style={{position: 'relative'}}>
                FOUND<span className="text-success">POINT</span>
                <div className="position-absolute" style={{
                  height: "8px",
                  width: "100%",
                  background: "rgba(40, 167, 69, 0.2)",
                  bottom: "0",
                  left: "0",
                  borderRadius: "4px"
                }}></div>
              </span>
            </h1>
            
            <p 
              className="lead mb-4" 
              style={{ 
                fontSize: "1.1rem", 
                fontWeight: "300",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                color: "rgba(255, 255, 255, 0.9)"
              }}
            >
              We're on a mission to reunite people with their lost belongings and foster a community
              of helpfulness. Our platform leverages cutting-edge technology to make the process of
              finding lost items efficient, secure, and accessible to everyone.
            </p>
            
            <Button 
              variant="success" 
              size="lg" 
              className="rounded-pill px-4 py-3 fw-bold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #28a745, #219a3a)',
                border: 'none',
                boxShadow: '0 6px 15px rgba(40, 167, 69, 0.4)'
              }}
            >
              JOIN OUR COMMUNITY
            </Button>
          </Col>
          <Col lg={5} className="text-center mt-5 mt-lg-0">
            <div 
              className="position-relative p-3 d-inline-block"
              style={{
                background: "rgba(7, 43, 33, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(40, 167, 69, 0.3)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)"
              }}
            >
              <div className="position-absolute" style={{
                background: "radial-gradient(circle, rgba(40, 167, 69, 0.2) 0%, rgba(40, 167, 69, 0) 70%)",
                width: "200px",
                height: "200px",
                top: "-30px",
                right: "-30px",
                zIndex: 0
              }}></div>
              
              <div className="position-relative">
                <div 
                  className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{width: "100px", height: "100px", boxShadow: "0 10px 25px rgba(40, 167, 69, 0.5)"}}
                >
                  <FaHandsHelping size={50} className="text-dark" />
                </div>
                <h3 className="text-success mb-3">Our Vision</h3>
                <p className="mb-0" style={{maxWidth: "300px"}}>
                  To create a world where lost items always find their way back home, powered by 
                  community collaboration and innovative technology.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* What We Offer */}
        <section className="mb-5 pt-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold">
              <span className="text-success">What</span> We Offer
            </h2>
            <p className="text-white-50">Innovative solutions for finding and returning lost items</p>
          </div>
          
          <Row className="g-4">
            {features.map((item, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card 
                  className="h-100 border-0" 
                  style={{
                    background: "rgba(7, 43, 33, 0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    border: "1px solid rgba(40, 167, 69, 0.2)",
                    boxShadow: "0 10px 25px rgba(0, 60, 40, 0.3)",
                    transition: "all 0.3s ease",
                    height: "100%"
                  }}
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                    <div 
                      className="rounded-circle mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        width: "70px",
                        height: "70px",
                      }}
                    >
                      {item.icon}
                    </div>
                    <Card.Title className="text-white mb-3">{item.title}</Card.Title>
                    <Card.Text className="text-white-50">{item.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
        <section>
          <Row className="justify-content-center mb-5 py-5">
            <Col lg={10}>
              <div 
                className="p-5 rounded-lg"
                style={{
                  background: 'linear-gradient(to right, rgba(7, 43, 33, 0.92), rgba(5, 56, 43, 0.95))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(40, 167, 69, 0.3)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px'
                }}
              >
                <Row className="align-items-center">
                  <Col md={6} className="pe-md-5">
                    <h2 className="fw-bold mb-4">Our Mission</h2>
                    <p className="mb-4">FoundPoint was born from a simple idea: to help people recover what they've lost and return what they've found. Every lost item has a story and an owner who misses it.</p>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3 p-2 rounded-circle" style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        color: "#28a745"
                      }}>
                        <FaHandsHelping />
                      </div>
                      <div>
                        <h6 className="mb-0 text-white">Community-Powered</h6>
                        <p className="mb-0 small text-white-50">We're building a network of helpful individuals</p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3 p-2 rounded-circle" style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        color: "#28a745"
                      }}>
                        <FaShieldAlt />
                      </div>
                      <div>
                        <h6 className="mb-0 text-white">Safety First</h6>
                        <p className="mb-0 small text-white-50">Your security and privacy are our top priorities</p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-2 rounded-circle" style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        color: "#28a745"
                      }}>
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h6 className="mb-0 text-white">Global Reach</h6>
                        <p className="mb-0 small text-white-50">Connecting people across communities and borders</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6} className="mt-4 mt-md-0">
                    <div 
                      className="rounded-lg p-3 h-100"
                      style={{
                        background: 'rgba(40, 167, 69, 0.05)',
                        border: '1px solid rgba(40, 167, 69, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div className="position-absolute" style={{
                        background: "radial-gradient(circle, rgba(40, 167, 69, 0.2) 0%, rgba(40, 167, 69, 0) 70%)",
                        width: "300px",
                        height: "300px",
                        top: "-50px",
                        right: "-50px",
                        zIndex: 0
                      }}></div>
                      
                      <div className="position-relative z-1 text-center p-4">
                        <div className="mb-4 mx-auto">
                          <div className="position-relative mx-auto" style={{width: '140px', height: '140px'}}>
                            <div className="position-absolute rounded-circle bg-success" style={{
                              width: '140px', 
                              height: '140px',
                              opacity: '0.1',
                              animation: 'pulse-animation 2s infinite'
                            }}></div>
                            <div className="position-absolute rounded-circle bg-success" style={{
                              width: '140px', 
                              height: '140px',
                              opacity: '0.1',
                              animation: 'pulse-animation 2s infinite 0.3s'
                            }}></div>
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{
                              width: '140px', 
                              height: '140px'
                            }}>
                              <FaMapMarkerAlt className="text-success" size={70} />
                            </div>
                          </div>
                        </div>
                        <h3 className="text-success mb-3">14,500+</h3>
                        <h5 className="text-white mb-2">Items Returned</h5>
                        <p className="text-white-50 mb-0">Join thousands of users who have successfully reunited with their belongings through our platform.</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </section>
        
        {/* Contact Form */}
        <section className="pt-4 pb-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Get In <span className="text-success">Touch</span>
            </h2>
            <p className="text-white-50">
              Have questions or suggestions? We'd love to hear from you!
            </p>
          </div>

          <Row className="g-4">
            {/* Contact Info Column */}
            <Col lg={5}>
              <Card 
                className="h-100 border-0" 
                style={{
                  background: "rgba(7, 43, 33, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(40, 167, 69, 0.2)",
                  boxShadow: "0 10px 25px rgba(0, 60, 40, 0.3)"
                }}
              >
                <Card.Body className="p-4">
                  <h4 className="text-white mb-4">Contact Information</h4>
                  
                  <div className="mb-4 d-flex align-items-start">
                    <div 
                      className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        width: "50px", 
                        height: "50px",
                        minWidth: "50px"
                      }}
                    >
                      <FaMapMarkerAlt className="text-success" size={20} />
                    </div>
                    <div>
                      <h6 className="text-success mb-1">Address</h6>
                      <p className="mb-0 text-white-50">1002 West 5th Ave,</p>
                      <p className="mb-0 text-white-50">New York, NY 55060</p>
                    </div>
                  </div>

                  <div className="mb-4 d-flex align-items-start">
                    <div 
                      className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        width: "50px", 
                        height: "50px",
                        minWidth: "50px"
                      }}
                    >
                      <FaPhone className="text-success" size={20} />
                    </div>
                    <div>
                      <h6 className="text-success mb-1">Phone</h6>
                      <p className="mb-0 text-white-50">+1 (252) 345-6689</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div 
                      className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(40, 167, 69, 0.15)",
                        width: "50px", 
                        height: "50px",
                        minWidth: "50px"
                      }}
                    >
                      <FaEnvelope className="text-success" size={20} />
                    </div>
                    <div>
                      <h6 className="text-success mb-1">Email</h6>
                      <p className="mb-0 text-white-50">contact@foundpoint.com</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Form Column */}
            <Col lg={7}>
              <Card 
                className="border-0" 
                style={{
                  background: "rgba(7, 43, 33, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(40, 167, 69, 0.2)",
                  boxShadow: "0 10px 25px rgba(0, 60, 40, 0.3)"
                }}
              >
                <Card.Body className="p-4">
                  <h4 className="text-white mb-4">Send Message</h4>
                  
                  {/* Success alert moved here for better UX */}
                  {submitted && (
                    <Alert variant="success" className="mb-4">
                      Your message has been sent successfully!
                    </Alert>
                  )}
                  
                  {/* Error alert */}
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label className="text-white-50">Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid rgba(40, 167, 69, 0.3)",
                              color: "white"
                            }}
                            className="rounded-pill"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formEmail">
                          <Form.Label className="text-white-50">Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid rgba(40, 167, 69, 0.3)",
                              color: "white"
                            }}
                            className="rounded-pill"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4" controlId="formMessage">
                      <Form.Label className="text-white-50">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Type your message..."
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(40, 167, 69, 0.3)",
                          color: "white",
                          borderRadius: "15px"
                        }}
                      />
                    </Form.Group>

                    <Button 
                      variant="success" 
                      type="submit" 
                      className="rounded-pill px-4 py-2 fw-bold"
                      disabled={loading}
                      style={{
                        background: loading ? '#1e7e34' : 'linear-gradient(135deg, #28a745, #219a3a)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)'
                      }}
                    >
                      {loading ? 'SENDING...' : 'SEND MESSAGE'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>

      <style jsx>{`
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.25);
          border-color: rgba(40, 167, 69, 0.5);
          color: white;
        }
        
        .card {
          transition: transform 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
        
        @keyframes pulse-animation {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.15;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default About;