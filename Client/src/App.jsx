import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import BookTicket from "./pages/BookTicket";
import MyTickets from "./pages/MyTickets";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./components/ChatPage";
// import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import PrivateComponent from "./components/privateComponent";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminEvents from "./pages/admin/AdminEvents"
import AdminCoupons from "./pages/admin/AdminCoupons"
import AdminRatings from "./pages/admin/AdminRatings"
import AdminSettings from "./pages/admin/AdminSettings"
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* Auth Routes */}

        <Route path="/auth" element={<PrivateComponent />}>
          <Route path="book/:id" element={<BookTicket />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/chat" element={<ChatPage />} />
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="ratings" element={<AdminRatings />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* {!isAdmin && <Footer/>}
      {!isAdmin && <ChatPage/>} */}

      <ToastContainer />
    </>
  );
}
