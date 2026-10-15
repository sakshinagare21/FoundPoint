import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { FaMapMarkerAlt, FaMapPin, FaHandsHelping, FaCheck } from 'react-icons/fa';

const NavbarPage = () => {
  // Features to display
  const features = [
    {
      icon: <FaMapPin />,
      title: "Lost Something?",
      description: "Post a lost item report and get notified when it's found"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Found Something?",
      description: "Help someone get their belongings back"
    },
    {
      icon: <FaHandsHelping />,
      title: "Community-Powered",
      description: "Join thousands helping each other recover lost items"
    }
  ];

  return (
    <div
     style={{
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
}}

    >
      <NavBar  />
      
      <Container className="text-white" style={{ paddingTop: "120px" }}>
        <Row className="align-items-center">
          <Col lg={7} className="pe-lg-5">
            <h1 
              className="display-3 fw-bold mb-4" 
              style={{ 
                letterSpacing: "1px",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                lineHeight: "1.1"
              }}
            >
              Find what's lost.<br />
              Return what's <span className="text-success" style={{position: 'relative'}}>
                found
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
              className="lead mb-5" 
              style={{ 
                fontSize: "1.1rem", 
                fontWeight: "300",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                color: "rgba(255, 255, 255, 0.8)"
              }}
            >
              Whether you've lost something valuable or found an item that someone is missing,
              FoundPoint connects people and belongings with a simple, secure platform that works
              anywhere you go.
            </p>
            
            <div className="d-flex gap-3 mb-5">
              <Button 
                as={Link} 
                to="/postitem" 
                variant="success" 
                size="lg" 
                className="rounded-pill px-4 py-3 fw-bold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #28a745, #219a3a)',
                  border: 'none',
                  boxShadow: '0 6px 15px rgba(40, 167, 69, 0.4)'
                }}
              >
                POST A LOST ITEM
              </Button>
              
              <Button 
                as={Link} 
                to="/feed" 
                variant="outline-success" 
                size="lg" 
                className="rounded-pill px-4 py-3 fw-bold"
                style={{
                  borderWidth: '2px'
                }}
              >
                BROWSE ITEMS
              </Button>
            </div>
            
            <div className="mb-5">
              {[1, 2, 3, 4, 5].map((dot, index) => (
                <span 
                  key={index} 
                  className="me-2"
                  style={{
                    display: "inline-block",
                    width: index === 0 ? "12px" : "8px", 
                    height: index === 0 ? "12px" : "8px", 
                    borderRadius: "50%", 
                    backgroundColor: index === 0 ? "#28a745" : "rgba(40, 167, 69, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </div>
          </Col>
          
          <Col lg={5}>
            <div className="position-relative">
              <div className="position-absolute" style={{
                background: "radial-gradient(circle, rgba(40, 167, 69, 0.2) 0%, rgba(40, 167, 69, 0) 70%)",
                width: "300px",
                height: "300px",
                top: "-20px",
                right: "-20px",
                zIndex: 0
              }}></div>
              
              <div className="bg-dark bg-opacity-90 rounded-lg p-4 mb-4 position-relative" style={{
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(40, 167, 69, 0.3)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)"
              }}>
                <div className="text-center mb-4">
                  <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-10 p-3 mb-3">
                    <FaCheck className="text-success" size={30} />
                  </div>
                  <h3 className="text-success mb-1">How It Works</h3>
                  <p className="text-white-50 small">Simple, secure, and effective</p>
                </div>
                
                {features.map((feature, index) => (
                  <div key={index} className="d-flex align-items-center mb-4">
                    <div className="me-3 p-2 rounded-circle" style={{
                      background: "rgba(40, 167, 69, 0.15)",
                      color: "#28a745"
                    }}>
                      {feature.icon}
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">{feature.title}</h6>
                      <p className="mb-0 small text-white-50">{feature.description}</p>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-4">
                  <Button 
                    as={Link} 
                    to="/about" 
                    variant="link" 
                    className="text-success text-decoration-none"
                  >
                    Learn more about us →
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .floating {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NavbarPage;

