import React from 'react';
import { FaSearch, FaBoxOpen, FaUsers } from 'react-icons/fa';

// Background style with overlay
const backgroundStyle = {
  backgroundImage: "url('/WlcmBackImg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
};

const overlayStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  minHeight: "100vh",
};

const WelcomePage = () => {
  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} className="d-flex flex-column align-items-center justify-content-center py-5 px-3 text-white">
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold text-success">Welcome to Lost & Found Platform</h1>
          <p className="lead text-light">
            Report lost or found items, connect with others, and return belongings safely and quickly.
          </p>
          <a href="/login" className="btn btn-success btn-lg mt-3 px-5">
            Get Started
          </a>
        </div>

        {/* Image Section */}
        <div className="my-4">
          <img
            src="https://img.freepik.com/free-vector/lost-found-box-concept-illustration_114360-1036.jpg"
            alt="Lost and Found"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '400px' }}
          />
        </div>

        {/* Features */}
        <div className="container mt-5">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 bg-dark text-light">
                <div className="card-body">
                  <FaSearch size={40} className="text-success mb-3" />
                  <h5 className="card-title">Search Items</h5>
                  <p className="card-text">Quickly find posted items with search filters and keywords.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 bg-dark text-light">
                <div className="card-body">
                  <FaBoxOpen size={40} className="text-success mb-3" />
                  <h5 className="card-title">Post Quickly</h5>
                  <p className="card-text">Submit details of lost or found items in a few easy steps.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 bg-dark text-light">
                <div className="card-body">
                  <FaUsers size={40} className="text-success mb-3" />
                  <h5 className="card-title">Trusted Community</h5>
                  <p className="card-text">A helpful platform promoting honesty and social responsibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-5 text-center text-light small">
          Made by Sumago InfoTech Interns using MERN Stack!
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;

