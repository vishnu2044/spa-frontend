// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomBar from './components/layout/BottomBar';
import WhatsAppButton from './components/layout/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Team from './pages/Team';
import Packages from './pages/Packages';
import Offers from './pages/Offers';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminServices from './pages/admin/AdminServices';
import AdminStaff from './pages/admin/AdminStaff';
import AdminReviews from './pages/admin/AdminReviews';
import AdminOffers from './pages/admin/AdminOffers';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BottomBar />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/packages" element={<Layout><Packages /></Layout>} />
          <Route path="/offers" element={<Layout><Offers /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />

          {/* Admin routes (no public layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="offers" element={<AdminOffers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
