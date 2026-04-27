import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, User,  Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, } from 'react-redux'
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import LoadingScreen from "../components/LoadingScreen";

export default function RegisterPage() {

  const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { name, email, phone, password } = formData;
  const handleChange = (e) => {
    console.log(e.target.name)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   dispatch(registerUser(formData))
  };

  useEffect(() => {

    if(user){
      navigate(user.isAdmin ? "/admin" : "/auth/profile")
    }

    if(isError && message){
      toast.error(message , {position : "top-center", theme : "dark"})
    }
 
  },[user, isError, message])

  if(isLoading){
    return(
      <LoadingScreen/>
    )
  }


  return (
    <div className="bg-[#0A0A0F] min-h-screen flex font-['DM_Sans']">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-[#0D0D15] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-1">
          <Link
            to="/"
            className="font-['Bebas_Neue'] text-2xl text-white tracking-wider"
          >
            MoodGo
          </Link>
          <span className="w-2 h-2 rounded-full bg-[#06FFA5]"></span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="font-['Bebas_Neue'] text-5xl text-white leading-tight">
            Join the
            <br />
            Experience
          </h1>
          <p className="text-gray-400 text-sm mt-4 max-w-sm">
            Create your MoodGo account and start discovering events that match
            your vibe.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">
              ✨ AI Recommendations
            </span>
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">
              🎟️ Easy Booking
            </span>
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">
              🔴 Live Events
            </span>
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-xs">
          Trusted by 15,000+ event lovers 🎉
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-[#0A0A0F] flex items-center justify-center p-8">
        <div className="bg-[#12121A] rounded-2xl border border-white/10 p-8 w-full max-w-md">
          {/* Tab Toggle */}
          <div className="flex gap-6 mb-8">
            <Link
              to="/login"
              className="text-gray-500 pb-2 text-sm font-semibold hover:text-gray-300 transition-colors"
            >
              Login
            </Link>
            <span className="text-white border-b-2 border-violet-500 pb-2 text-sm font-semibold">
              Register
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">
            Join MoodGo and discover amazing events
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                name="name"
                value={name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                name="email"
                value={email}
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm"
              />
            </div>
            <div className="relative">
              {/* <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /> */}
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                name="phone"
                value={phone}
                onChange={handleChange}
                type="phone"
                placeholder="Phone Number "
                className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                name="password"
                value={password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm"
              />
              <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
            </div>

 
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 w-full text-sm"
            >
              Register
            </button>
          </form>
             <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
