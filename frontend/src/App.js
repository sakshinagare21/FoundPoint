import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LostAndFoundForm from './components/LostAndFoundForm';
import WelcomePage from './components/WelcomePage';
import NavbarPage from './components/NavbarPage';
import Sign_Log from './components/Sign_Log';
import Feed from './components/Feed';
import About from './components/About';
import ClaimItemsPage from './components/ClaimItemsPage';
import MyClaimsPage from './components/MyClaimsPage';
import MyItemsPage from './components/MyItemsPage';
import ReceivedClaimsPage from './components/RecievedClaimsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<WelcomePage />} />
          <Route path='/login' element={<Sign_Log />} />
          <Route path='/about' element={<About />} />
          
          {/* Protected Routes */}
          <Route path='/navbar' element={
            <ProtectedRoute>
              <NavbarPage />
            </ProtectedRoute>
          } />
          
          <Route path='/postitem' element={
            <ProtectedRoute>
              <LostAndFoundForm />
            </ProtectedRoute>
          } />
          
          <Route path='/feed' element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          
          <Route path="/claimitems" element={
            <ProtectedRoute>
              <ClaimItemsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/myclaims" element={
            <ProtectedRoute>
              <MyClaimsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/receivedclaims" element={
            <ProtectedRoute>
              <ReceivedClaimsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/myitems" element={
            <ProtectedRoute>
              <MyItemsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// import 'bootstrap/dist/css/bootstrap.min.css';
// // import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LostAndFoundForm from './components/LostAndFoundForm';
// import WelcomePage from './components/WelcomePage';
// import NavbarPage from './components/NavbarPage';
// import Sign_Log from './components/Sign_Log';
// import Feed from './components/Feed';
// import About from './components/About';
// import ClaimItemsPage from './components/ClaimItemsPage';
// import MyClaimsPage from './components/MyClaimsPage';
// // import ReceivedClaimsPage from './components/ReceivedClaimsPage';
// import MyItemsPage from './components/MyItemsPage';
// import ReceivedClaimsPage from './components/RecievedClaimsPage';

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path='/' element={<WelcomePage />} />
//           <Route path='/navbar' element={<NavbarPage />} />
//           <Route path='/login' element={<Sign_Log />} />
//           <Route path='/postitem' element={<LostAndFoundForm />} />
//           <Route path='/feed' element={<Feed />} />
//           <Route path="/claimitems" element={<ClaimItemsPage />} />
//           <Route path="/myclaims" element={<MyClaimsPage />} />
//           <Route path="/receivedclaims" element={<ReceivedClaimsPage />} />
//           <Route path="/myitems" element={<MyItemsPage />} />
//           <Route path="/about" element={<About />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;