import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App