// NavBar.js
import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="navbar-wrapper px-4 pt-3 sticky-top">
      <Navbar 
        expand="lg" 
        variant="dark"
        className="rounded-pill shadow-lg border border-success w-100"
        style={{ 
          background: 'linear-gradient(to right, rgba(7, 43, 33, 0.92), rgba(5, 56, 43, 0.95))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 25px rgba(0, 60, 40, 0.3)'
        }}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/navbar" className="d-flex align-items-center">
            <div className="position-relative me-2">
              <div 
                className="rounded-circle bg-dark d-flex align-items-center justify-content-center text-white"
                style={{width: '36px', height: '36px', border: '2px solid rgba(40, 167, 69, 0.8)'}}
              >
                <span style={{fontSize: '16px', fontWeight: 'bold'}}>F</span>
              </div>
            </div>
            <div className="d-flex flex-column" style={{ lineHeight: '1' }}>
              <span className="fw-bold" style={{ fontFamily: "'Exo 2', sans-serif", letterSpacing: "1.5px", fontSize: '18px' }}>
                FOUND<span className="text-success">POINT</span>
              </span>
              <span style={{ fontSize: '9px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Find what matters
              </span>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto">
              {['Home', 'Post Item', 'View All', ...(isAuthenticated() ? ['Claim Items', 'My Claims'] : []), 'About Us'].map((item, index) => {
                const path = item === 'Home' ? '/navbar' : 
                             item === 'Post Item' ? '/postitem' :
                             item === 'View All' ? '/feed' :
                             item === 'Claim Items' ? '/claimitems' :
                             item === 'My Claims' ? '/myclaims' : '/about';
                             
                return (
                  <Nav.Link 
                    key={index}
                    as={Link} 
                    to={path} 
                    className="mx-1 position-relative nav-glow-effect"
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item}
                    <div className="nav-hover-line"></div>
                  </Nav.Link>
                );
              })}
            </Nav>
            
            <div className="d-flex gap-3 align-items-center">
              {isAuthenticated() ? (
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-success" 
                    id="dropdown-basic"
                    className="rounded-pill d-flex align-items-center"
                    style={{
                      background: 'rgba(20, 80, 60, 0.3)',
                      borderColor: 'rgba(40, 167, 69, 0.6)'
                    }}
                  >
                    <div 
                      className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2"
                      style={{width: '24px', height: '24px'}}
                    >
                      <FaUser size={12} className="text-dark" />
                    </div>
                    <span>{user?.email?.split('@')[0] || 'User'}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-success" style={{backgroundColor: 'rgba(7, 43, 33, 0.95)'}}>
                    <Dropdown.Item as={Link} to="/myitems" className="text-light">My Posted Items</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/myclaims" className="text-light">My Claims</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/receivedclaims" className="text-light">Received Claims</Dropdown.Item>
                    <Dropdown.Divider className="border-success" />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="outline-success" 
                  as={Link} 
                  to='/login'
                  className="rounded-pill px-4"
                  style={{
                    background: 'rgba(20, 80, 60, 0.3)',
                    borderColor: 'rgba(40, 167, 69, 0.6)'
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <style jsx>{`
        .nav-glow-effect:hover {
          background-color: rgba(40, 167, 69, 0.15);
        }
        
        .nav-hover-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #28a745;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-glow-effect:hover .nav-hover-line {
          width: 80%;
        }
        
        .search-btn-pulse {
          animation: pulse 2s infinite;
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
    </div>
  );
};

export default NavBar;

// // NavBar.js
// import React, { useState, useEffect } from 'react';
// import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Link } from 'react-router-dom';
// import { FaUser, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

// const NavBar = () => {
//   const navigate = useNavigate();
//   const [userEmail, setUserEmail] = useState(null);
  
//   useEffect(() => {
//     // Check if user is logged in on component mount
//     const email = localStorage.getItem('userEmail');
//     if (email) {
//       setUserEmail(email);
//     }
//   }, []);
  
//   const handleLogout = () => {
//     localStorage.removeItem('userEmail');
//     setUserEmail(null);
//     navigate('/login');
//   };
  
//   return (
//     <div className="navbar-wrapper px-4 pt-3 sticky-top">
//       <Navbar 
//         expand="lg" 
//         variant="dark"
//         className="rounded-pill shadow-lg border border-success w-100"
//         style={{ 
//           background: 'linear-gradient(to right, rgba(7, 43, 33, 0.92), rgba(5, 56, 43, 0.95))',
//           backdropFilter: 'blur(10px)',
//           boxShadow: '0 10px 25px rgba(0, 60, 40, 0.3)'
//         }}
//       >
//         <Container fluid>
//           <Navbar.Brand as={Link} to="/navbar" className="d-flex align-items-center">
//             <div className="position-relative me-2">
//               {/* <FaMapMarkerAlt className="text-success position-absolute" style={{fontSize: '24px', top: '-2px', left: '6px'}} /> */}
//               <div 
//                 className="rounded-circle bg-dark d-flex align-items-center justify-content-center text-white"
//                 style={{width: '36px', height: '36px', border: '2px solid rgba(40, 167, 69, 0.8)'}}
//               >
//                 <span style={{fontSize: '16px', fontWeight: 'bold'}}>F</span>
//               </div>
//             </div>
//             <div className="d-flex flex-column" style={{ lineHeight: '1' }}>
//               <span className="fw-bold" style={{ fontFamily: "'Exo 2', sans-serif", letterSpacing: "1.5px", fontSize: '18px' }}>
//                 FOUND<span className="text-success">POINT</span>
//               </span>
//               <span style={{ fontSize: '9px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
//                 Find what matters
//               </span>
//             </div>
//           </Navbar.Brand>
          
//           <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          
//           <Navbar.Collapse id="responsive-navbar-nav">
//             <Nav className="mx-auto">
//               {['Home', 'Post Item', 'View All', ...(userEmail ? ['Claim Items', 'My Claims'] : []), 'About Us'].map((item, index) => {
//                 const path = item === 'Home' ? '/navbar' : 
//                              item === 'Post Item' ? '/postitem' :
//                              item === 'View All' ? '/feed' :
//                              item === 'Claim Items' ? '/claimitems' :
//                              item === 'My Claims' ? '/myclaims' : '/about';
                             
//                 return (
//                   <Nav.Link 
//                     key={index}
//                     as={Link} 
//                     to={path} 
//                     className="mx-1 position-relative nav-glow-effect"
//                     style={{
//                       fontSize: '15px',
//                       fontWeight: '500',
//                       padding: '8px 16px',
//                       borderRadius: '4px',
//                       transition: 'all 0.3s ease'
//                     }}
//                   >
//                     {item}
//                     <div className="nav-hover-line"></div>
//                   </Nav.Link>
//                 );
//               })}
//             </Nav>
            
//             <div className="d-flex gap-3 align-items-center">
//               {/* <Button 
//                 variant="outline-success" 
//                 className="rounded-circle p-2 search-btn-pulse" 
//                 style={{
//                   width: "38px", 
//                   height: "38px",
//                   border: "2px solid"
//                 }}
//               >
//                 <FaSearch size={14} />
//               </Button> */}
              
//               {userEmail ? (
//                 <Dropdown>
//                   <Dropdown.Toggle 
//                     variant="outline-success" 
//                     id="dropdown-basic"
//                     className="rounded-pill d-flex align-items-center"
//                     style={{
//                       background: 'rgba(20, 80, 60, 0.3)',
//                       borderColor: 'rgba(40, 167, 69, 0.6)'
//                     }}
//                   >
//                     <div 
//                       className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2"
//                       style={{width: '24px', height: '24px'}}
//                     >
//                       <FaUser size={12} className="text-dark" />
//                     </div>
//                     <span>{userEmail.split('@')[0]}</span>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="shadow-lg border-success" style={{backgroundColor: 'rgba(7, 43, 33, 0.95)'}}>
//                     <Dropdown.Item as={Link} to="/myitems" className="text-light">My Posted Items</Dropdown.Item>
//                     <Dropdown.Item as={Link} to="/myclaims" className="text-light">My Claims</Dropdown.Item>
//                     <Dropdown.Item as={Link} to="/receivedclaims" className="text-light">Received Claims</Dropdown.Item>
//                     <Dropdown.Divider className="border-success" />
//                     <Dropdown.Item as ={Link} to="/login" onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               ) : (
//                 <Button 
//                   variant="outline-success" 
//                   as={Link} 
//                   to='/login'
//                   className="rounded-pill px-4"
//                   style={{
//                     background: 'rgba(20, 80, 60, 0.3)',
//                     borderColor: 'rgba(40, 167, 69, 0.6)'
//                   }}
//                 >
//                   Login
//                 </Button>
//               )}
              
//               <div 
                
//                 className="rounded-pill px-4 fw-bold"
//                 // style={{
//                 //   background: 'linear-gradient(135deg, #28a745, #219a3a)',
//                 //   border: 'none',
//                 //   boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
//                 // }}
//               >
//                 {/* Get Started */}
//               </div>
//             </div>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
      
//       <style jsx>{`
//         .nav-glow-effect:hover {
//           background-color: rgba(40, 167, 69, 0.15);
//         }
        
//         .nav-hover-line {
//           position: absolute;
//           bottom: 0;
//           left: 50%;
//           width: 0;
//           height: 2px;
//           background-color: #28a745;
//           transition: all 0.3s ease;
//           transform: translateX(-50%);
//         }
        
//         .nav-glow-effect:hover .nav-hover-line {
//           width: 80%;
//         }
        
//         .search-btn-pulse {
//           animation: pulse 2s infinite;
//         }
        
//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NavBar;