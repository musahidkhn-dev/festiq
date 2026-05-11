import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import ChatPage from "./components/ChatPage";
import PrivateComponent from "./components/privateComponent";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import AdminLayout from "./pages/admin/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./components/MainLayout";
import MoodBotWidget from "./components/MoodBotWidget";
import AvatarPreview from "./components/AvatarPreview";
import CustomCursor from "./components/CustomCursor";

// Statically import Layouts and Global Containers

// Lazy load actual pages
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const BookTicket = lazy(() => import("./pages/BookTicket"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HostEvent = lazy(() => import("./pages/HostEvent"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorEditEvent = lazy(() => import("./pages/CreatorEditEvent"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminRatings = lazy(() => import("./pages/admin/AdminRatings"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const CreateEvent = lazy(() => import("./pages/admin/CreateEvent"));
const EditEvent = lazy(() => import("./pages/admin/EditEvent"));

// Lightweight fallback
const SuspenseFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#050508]">
    <div className="animate-pulse flex items-center gap-2 text-violet-400">
      <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
      <div className="w-2 h-2 bg-violet-400 rounded-full animation-delay-200"></div>
      <div className="w-2 h-2 bg-violet-400 rounded-full animation-delay-400"></div>
    </div>
  </div>
);

// eslint-disable-next-line no-unused-vars
const withSuspense = (Component) => (
  <Suspense fallback={<SuspenseFallback />}>
    <Component />
  </Suspense>
);

import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/login" element={withSuspense(LoginPage)} />
        <Route path="/register" element={withSuspense(RegisterPage)} />
        <Route path="/forgot-password" element={withSuspense(ForgotPasswordPage)} />

        {/* Seeker Protocol Routes (Wrapped in MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={withSuspense(HomePage)} />
          <Route path="/events" element={withSuspense(EventsPage)} />
          <Route path="/events/:id" element={withSuspense(EventDetail)} />
          <Route path="/about" element={withSuspense(AboutPage)} />
          <Route path="/contact" element={withSuspense(ContactPage)} />

          <Route path="/auth" element={<PrivateComponent />}>
            <Route path="book/:id" element={withSuspense(BookTicket)} />
            <Route path="tickets" element={withSuspense(MyTickets)} />
            <Route path="profile" element={withSuspense(ProfilePage)} />
          </Route>
          
          {/* Creator Routes */}
          <Route element={<PrivateComponent />}>
            <Route path="/host-event" element={withSuspense(HostEvent)} />
            <Route path="/creator/dashboard" element={withSuspense(CreatorDashboard)} />
            <Route path="/creator/edit-event/:id" element={withSuspense(CreatorEditEvent)} />
          </Route>
        </Route>

        <Route path="/chat" element={<ChatPage />} />
        
        {/* Admin layout remains static, children are lazy */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={withSuspense(AdminDashboard)} />
          <Route path="users" element={withSuspense(AdminUsers)} />
          <Route path="orders" element={withSuspense(AdminOrders)} />
          <Route path="events" element={withSuspense(AdminEvents)} />
          <Route path="events/create" element={withSuspense(CreateEvent)} />
          <Route path="events/edit/:id" element={withSuspense(EditEvent)} />
          <Route path="coupons" element={withSuspense(AdminCoupons)} />
          <Route path="ratings" element={withSuspense(AdminRatings)} />
          <Route path="settings" element={withSuspense(AdminSettings)} />
          <Route path="profile" element={withSuspense(ProfilePage)} />
        </Route>
        
        <Route path="*" element={withSuspense(NotFound)} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />

      <ToastContainer />
      <MoodBotWidget />
      <AvatarPreview />
      <CustomCursor />
    </>
  );
}
