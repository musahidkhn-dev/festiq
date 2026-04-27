import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import { currentUser } from "../data/mockData";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";


export default function Navbar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth);
  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }
  return (
    <nav className="bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-['Bebas_Neue'] text-2xl text-white tracking-wider">
            MoodGo
          </span>
          <span className="w-2 h-2 rounded-full bg-[#06FFA5]"></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white text-sm transition-colors">
            Home
          </Link>
          <Link
            to="/events"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Events
          </Link>
          <Link
            to="/auth/tickets"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            My Tickets
          </Link>
          <Link
            to="/chat"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Chat
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors hidden md:block" />
          <div className="relative hidden md:block">
            <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {user ? (
            <button onClick={handleLogout} className="hidden cursor-pointer sm:flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center justify-center px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link to={user?.isAdmin ? "/admin" : "/auth/profile"} className="hidden sm:block ml-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-white/10 object-cover"
            />
          </Link>
          <Menu className="w-5 h-5 text-gray-400 md:hidden cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}
