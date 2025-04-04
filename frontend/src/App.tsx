import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Footer from "./components/Footer";
import ProfilePage from "./pages/Profile";
import LoanPage from "./pages/Loan";
import ReturnPage from "./pages/Return";
import AdminDashboard from "./pages/Admin/Dashboard";
import RoleBasedRoute from "./components/RoleBaseRoute";
import AccessDenied from "./components/AccessDenied";
import InstrumentList from "./pages/Admin/Instrument";
import EditInstrument from "./pages/Admin/EditInstrument";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/profile' element={
            <RoleBasedRoute allowedRoles={['user','admin']}>
              <ProfilePage />
            </RoleBasedRoute>
          } />
          <Route path='/my-loan' element={
            <RoleBasedRoute allowedRoles={['user']}>
              <LoanPage />
            </RoleBasedRoute>
          } />
          <Route path='/my-return' element={
            <RoleBasedRoute allowedRoles={['user']}>
              <ReturnPage />
            </RoleBasedRoute>
          } />
          <Route path='/dashboard' element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          } />
          <Route path='/instrument-list' element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <InstrumentList />
            </RoleBasedRoute>
          } />
          <Route path='/edit-instrument/:id' element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <EditInstrument />
            </RoleBasedRoute>
          } />
          <Route path="/access-denied" element={<AccessDenied />}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};


export default App