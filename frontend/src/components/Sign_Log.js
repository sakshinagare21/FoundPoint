import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import '../App.css'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from './AuthContext';

const Sign_Log = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", mob: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [img, setimage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/navbar';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", signupData.name);
    formDataToSend.append("email", signupData.email);
    formDataToSend.append("password", signupData.password);
    formDataToSend.append("mob", signupData.mob);
    if (img) {
      formDataToSend.append("image", img);
    }
    
    try {
      const response = await axios.post("http://localhost:5000/logsign/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success(response.data.message);
      
      // Use the login function from context
      login(response.data.user);
      
      setSignupData({ name: "", email: "", password: "", mob: "" });
      setimage(null);
      setIsLogin(true);
      
      // Redirect to the intended page or navbar
      const from = location.state?.from?.pathname || '/navbar';
      navigate(from, { replace: true });
      
    } catch (error) {
      toast.error(error.response?.data || "Signup failed");
      console.log(error);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/logsign/login", signinData);
      
      toast.success(response.data.message);
      
      // Use the login function from context
      login(response.data.user);
      
      setSigninData({ email: "", password: "" });
      
      // Redirect to the intended page or navbar
      const from = location.state?.from?.pathname || '/navbar';
      navigate(from, { replace: true });
      
    } catch (error) {
      toast.error(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper" style={{
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
    }}>
      <div className={`auth-container ${isLogin ? "" : "active"}`} id="container">
        <ToastContainer position="top-center" autoClose={3000} />
        
        <div className="register-page" style={{ 
          width: '500px', 
          backgroundImage: `url(${process.env.PUBLIC_URL + '/images/WlcmBackImg.jpg'})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          <div className="register-form">
            <div className="form-container sign-up-container">
              <Form className="form-box" onSubmit={handleSignup}>
                <h2>Create Account</h2>
                <span>or use your email for registration</span>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="mb-2"
                  required
                />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="mb-2"
                  required
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="mb-3"
                  required
                />
                <Form.Control
                  type="number"
                  placeholder="Mobile Number"
                  name="mob"
                  value={signupData.mob}
                  onChange={handleSignupChange}
                  className="mb-3"
                  required
                />
                <Form.Group className="mb-3">
                  <Form.Label className="custom-file-upload text-white">
                    Upload Profile Photo
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={(e) => setimage(e.target.files?.[0] || null)}
                      hidden
                    />
                  </Form.Label>
                  {img && <small className="text-success">Selected: {img.name}</small>}
                </Form.Group>
                <Button variant="success" type="submit">Sign Up</Button>
              </Form>
            </div>
          </div>
        </div>
        
        <div className="login-page" style={{ 
          width: '500px', 
          backgroundImage: `url(${process.env.PUBLIC_URL + '/images/WlcmBackImg.jpg'})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          <div className="login-form">
            <div className="form-container sign-in-container">
              <Form className="form-box" onSubmit={handleSignin}>
                <h2>Sign In</h2>
                <span>or use your email password</span>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signinData.email}
                  onChange={handleSigninChange}
                  className="mb-2"
                  required
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signinData.password}
                  onChange={handleSigninChange}
                  className="mb-3"
                  required
                />
                <a href="#">Forgot your password?</a>
                <Button variant="success" className="mt-2" type="submit">Sign In</Button>
              </Form>
            </div>
          </div>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>To keep connected with us please login</p>
              <Button onClick={() => setIsLogin(true)} className="btn-success">Sign In</Button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Hello, Friend!</h2>
              <p>Register with your personal details to use all features</p>
              <Button onClick={() => setIsLogin(false)} variant="success">Sign Up</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign_Log;

// import React, { useState } from "react";
// import { Form, Button } from "react-bootstrap";
// import axios from "axios";
// import '../App.css'
// import { ToastContainer, toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";

// const Sign_Log = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [signupData, setSignupData] = useState({ name: "", email: "", password: "",mob: "" });
//   const [signinData, setSigninData] = useState({ email: "", password: "" });
//   const [img,setimage]=useState(null)

//   const navigate = useNavigate(); // ← use navigate hook

//   const handleSignupChange = (e) => {
//     setSignupData({ ...signupData, [e.target.name]: e.target.value });
//   };
  

//   const handleSigninChange = (e) => {
//     setSigninData({ ...signinData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const formDataToSend = new FormData();
//     formDataToSend.append("name", signupData.name);
//     formDataToSend.append("email", signupData.email);
//     formDataToSend.append("password", signupData.password);
//     formDataToSend.append("mob", signupData.mob);
//     if (img) {
//         formDataToSend.append("image", img);
//     }
//     try {
//       const response = await axios.post("http://localhost:5000/logsign/register", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
//       toast.success(response.data.message);
//       localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user
//       // During login success
//       localStorage.setItem("userEmail", response.data.user.email)

//       setSignupData({ name: "", email: "", password: "",mob:"" });
//       setIsLogin(true);
//       navigate("/navbar"); // Redirect to feed
//     } catch (error) {
//       toast.error(error.response?.data || "Signup failed");
//       console.log(error)
//     }
//   };

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/logsign/login", signinData);
//       toast.success(response.data.message);
//       localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user
//       setSigninData({ email: "", password: "" });
//       localStorage.setItem("userEmail", response.data.user.email)
//       navigate("/navbar"); // Redirect to feed
//     } catch (error) {
//       toast.error(error.response?.data || "Login failed");
//     }
//   };

//   return (
//         <div className="auth-wrapper" style={{
// // position: 'relative',
//   backgroundImage: `
//     linear-gradient(rgba(0, 20, 15, 0.7), rgba(5, 30, 25, 0.7)),
//     url("WlcmBackImg.jpg") 
//   `,
//   backgroundSize: 'cover',
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'center',
//   minHeight: '100vh',
//   fontFamily: "'Poppins', sans-serif",
//   color: '#fff'}}>
//           <div className={`auth-container ${isLogin ? "" : "active"}`} id="container">
//           <ToastContainer position="top-center" autoClose={3000} />
//           <div className="register-page"style={{ 
//       width: '500px', 
//       backgroundImage: `url(${process.env.PUBLIC_URL + '/images/WlcmBackImg.jpg'})`,
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center'
//     }} >
//       <div className="register-form">
    
//           <div className="form-container sign-up-container">
//             <Form className="form-box" onSubmit={handleSignup}>
//               <h2>Create Account</h2>
//               <span>or use your email for registration</span>
//               <Form.Control
//                 type="text"
//                 placeholder="Name"
//                 name="name"
//                 value={signupData.name}
//                 onChange={handleSignupChange}
//                 className="mb-2"
//                 required
//               />
//               <Form.Control
//                 type="email"
//                 placeholder="Email"
//                 name="email"
//                 value={signupData.email}
//                 onChange={handleSignupChange}
//                 className="mb-2"
//                 required
//               />
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={signupData.password}
//                 onChange={handleSignupChange}
//                 className="mb-3"
//                 required
//               />
//               <Form.Control
//                 type="number"
//                 placeholder="Mobile Number"
//                 name="mob"
//                 value={signupData.mob}
//                 onChange={handleSignupChange}
//                 className="mb-3"
//                 required
//               />
//                <Form.Group className="mb-3">
//       <Form.Label className="custom-file-upload text-white">
//         Upload Profile Photo
//         <Form.Control
//           type="file"
//           name="image"
//           onChange={(e) => setimage(e.target.files?.[0] || null)}
//           hidden
//         />
//       </Form.Label>
//       {img && <small className="text-success">Selected: {img.name}</small>}
//     </Form.Group>
//      <Button variant="success" type="submit">Sign Up</Button>
//             </Form>
//           </div>
//           </div>
//           </div>
//           <div className="login-page" style={{ 
//       width: '500px', 
//       backgroundImage: `url(${process.env.PUBLIC_URL + '/images/WlcmBackImg.jpg'})`,
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center'
//     }}>
//       <div className="login-form">
    
//           <div className="form-container sign-in-container">
//             <Form className="form-box" onSubmit={handleSignin}>
//               <h2>Sign In</h2>
//               <span>or use your email password</span>
//               <Form.Control
//                 type="email"
//                 placeholder="Email"
//                 name="email"
//                 value={signinData.email}
//                 onChange={handleSigninChange}
//                 className="mb-2"
//                 required
//               />
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={signinData.password}
//                 onChange={handleSigninChange}
//                 className="mb-3"
//                 required
//               />
//               <a href="#">Forgot your password?</a>
//               <Button variant="success" className="mt-2" type="submit">Sign In</Button>
//             </Form>
//           </div>
//           </div></div>
    
//           <div className="overlay-container">
//             <div className="overlay">
//               <div className="overlay-panel overlay-left">
//                 <h2>Welcome Back!</h2>
//                 <p>To keep connected with us please login</p>
//                 <Button onClick={() => setIsLogin(true)} className="btn-success">Sign In</Button>
//               </div>
//               <div className="overlay-panel overlay-right">
//                 <h2>Hello, Friend!</h2>
//                 <p>Register with your personal details to use all features</p>
//                 <Button onClick={() => setIsLogin(false)} variant="success">Sign Up</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//         </div>
//   );
// };

// export default Sign_Log;
