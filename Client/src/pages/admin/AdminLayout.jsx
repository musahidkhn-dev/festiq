import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function AdminLayout() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/auth/profile");
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden font-['DM_Sans']">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
