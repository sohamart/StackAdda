import { useState } from "react";
import { Link } from "react-router-dom";
import { Hand, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const LoginButton = () => {
    navigate("/login");
    setOpen(false);
  };
  const { user, logout } = useAuth();
const handleLogout = async () => {
  const data = await logout();

  toast.success(data?.message || "Logout Successful");

  navigate("/login");
};
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] lg:w-[80vw] rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl">

      <div className="flex h-18 items-center justify-between px-6">

        <Link
          to="/"
          className="text-2xl  font-bold text-orange-500"
        >
          Stack Adda
        </Link>

        {/* Desktop Menu */}

        <div className="hidden  lg:mr-12 md:flex items-center gap-8 lg:text-xl text-xl uppercase text-white">

          <Link to="/">Home</Link>

          <Link to="/">Courses</Link>

          <Link to="/">About</Link>

          <Link to="/">Contact</Link>

        </div>

        {/* Desktop Button */}

        <div className="hidden md:flex items-center gap-3">

  {user ? (
    <>
      <Link
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        className="text-white hover:text-orange-400 transition"
      >
        Dashboard
      </Link>

      <Link
        to="/profile"
        className="text-white hover:text-orange-400 transition"
      >
        Profile
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={LoginButton}
      className="rounded-lg bg-orange-600 px-5 py-2 text-white hover:bg-orange-500 transition"
    >
      Login
    </button>
  )}

</div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 py-5" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-5 text-white md:hidden">

          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/" onClick={() => setOpen(false)}>
            Courses
          </Link>

          <Link to="/" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link to="/" onClick={() => setOpen(false)}>
            Contact
          </Link>

          {user ? (
  <>
    <Link
      to={user.role === "admin" ? "/admin" : "/dashboard"}
      onClick={() => setOpen(false)}
    >
      Dashboard
    </Link>

    <Link
      to="/profile"
      onClick={() => setOpen(false)}
    >
      Profile
    </Link>

    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-500 px-6 py-2 text-white"
    >
      Logout
    </button>
  </>
) : (
  <button
    onClick={LoginButton}
    className="rounded-lg bg-orange-600 px-6 py-2 text-white"
  >
    Login
  </button>
)}

        </div>
      </div>

    </nav>
  );
};

export default Navbar;