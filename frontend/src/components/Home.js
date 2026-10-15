import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1581092580505-1c75f5d5c0f4')`, // Replace with your server bg
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white'
      }}
    >
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">
            <span style={{ color: '#00ffff' }}>Cloud</span>
            <span style={{ color: '#33ff99' }}>83</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-center">
            <Nav className="me-auto gap-3">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">About us</Nav.Link>
              <Nav.Link href="#">Services</Nav.Link>
              <Nav.Link href="#">News</Nav.Link>
              <Nav.Link href="#">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex gap-2">
            <Button variant="secondary" size="sm">
              Support <div style={{ fontSize: '10px' }}>24/7</div>
            </Button>
            <Button variant="primary" size="sm">Login</Button>
            <Button variant="success" size="sm">Register</Button>
          </div>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container
        className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{ height: '85vh' }}
      >
        <h1 className="display-4 fw-bold">The Best Hosting</h1>
        <p
          className="mt-3 px-3"
          style={{
            backgroundColor: '#00ff95',
            color: 'black',
            borderRadius: '5px',
            maxWidth: '700px',
            padding: '10px',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem
          maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien.
          Suspendisse cursus faucibus finibus.
        </p>
        <Button variant="secondary" className="mt-4">Read More</Button>
      </Container>
      {/* Features Section */}
<section className="py-5 bg-white text-center text-dark">
  <Container>
    <div className="row">
      <div className="col-md-4 mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="Worldwide Support" width="80" />
        <h5 className="mt-3 fw-bold">Worldwide Support</h5>
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem
          maximus mauris scelerisque, at rutrum nulla dictum.
        </p>
      </div>
      <div className="col-md-4 mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/4139/4139981.png" alt="Safe & Secure" width="80" />
        <h5 className="mt-3 fw-bold">Safe & Secure</h5>
        <p className="text-muted">
          Ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris
          scelerisque, at rutrum nulla dictum.
        </p>
      </div>
      <div className="col-md-4 mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/2733/2733829.png" alt="Cloud Hosting" width="80" />
        <h5 className="mt-3 fw-bold">Cloud Hosting</h5>
        <p className="text-muted">
          Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien.
          Suspendisse cursus faucibus finibus.
        </p>
      </div>
    </div>
  </Container>
</section>
{/* Best Services Section */}
<section className="best-services py-5 text-white text-center" style={{ backgroundColor: '#081828' }}>
  <Container>
    <h6 className="text-uppercase">The only ones</h6>
    <h2 className="fw-bold mb-5">Our Best Services</h2>
    <div className="position-relative d-flex justify-content-center align-items-center">
      <img src="https://cdn-icons-png.flaticon.com/512/4149/4149757.png" alt="Center Server" className="position-absolute" style={{ width: '200px', zIndex: 1 }} />
      <div className="circle-wrapper position-relative" style={{ width: '500px', height: '500px' }}>
        <div className="service-item position-absolute top-0 start-50 translate-middle-x">
          <img src="https://cdn-icons-png.flaticon.com/512/1042/1042396.png" width="50" alt="Free Domains" />
          <h5 className="mt-2 fw-bold">Free Domains</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="service-item position-absolute top-25 end-0 translate-middle-y">
          <img src="https://cdn-icons-png.flaticon.com/512/1055/1055644.png" width="50" alt="VPS Hosting" />
          <h5 className="mt-2 fw-bold">VPS Hosting</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="service-item position-absolute top-50 end-0 translate-middle-y">
          <img src="https://cdn-icons-png.flaticon.com/512/2733/2733829.png" width="50" alt="Dedicated Hosting" />
          <h5 className="mt-2 fw-bold">Dedicated Hosting</h5>
          <p>Consectetur adipiscing elit. Donec malesuada.</p>
        </div>
        <div className="service-item position-absolute bottom-0 end-50 translate-middle-x">
          <img src="https://cdn-icons-png.flaticon.com/512/1808/1808740.png" width="50" alt="Cloud Hosting" />
          <h5 className="mt-2 fw-bold">Cloud Hosting</h5>
          <p>Donec malesuada lorem maximus mauris scelerisque.</p>
        </div>
        <div className="service-item position-absolute bottom-0 start-50 translate-middle-x">
          <img src="https://cdn-icons-png.flaticon.com/512/786/786342.png" width="50" alt="Reseller Hosting" />
          <h5 className="mt-2 fw-bold">Reseller Hosting</h5>
          <p>Donec malesuada lorem maximus mauris scelerisque.</p>
        </div>
        <div className="service-item position-absolute top-50 start-0 translate-middle-y">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174878.png" width="50" alt="Shared Hosting" />
          <h5 className="mt-2 fw-bold">Shared Hosting</h5>
          <p>Donec malesuada lorem maximus mauris scelerisque.</p>
        </div>
      </div>
    </div>
  </Container>
</section>


    </div>
  );
};

export default Home;
