import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  GraduationCap,
  Shield,
  Settings,
  BookOpen,
  Phone,
  Info,
  Home,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin";

  const avatar =
    user?.profileImage?.url ||
    `https://ui-avatars.com/api/?background=f97316&color=fff&name=${user?.name}`;

  const handleLogout = async () => {
  try {
    setLogoutLoading(true);

    await logout();

    navigate("/login");
  } catch (error) {
    console.error(error);
  } finally {
    setLogoutLoading(false);
    setOpen(false);
  }
};
  const menuClass = ({ isActive }) =>
  `transition duration-300 ${
    isActive
      ? "text-orange-400"
      : "text-white hover:text-orange-400"
  }`;
      return (
    <nav
      className="
      fixed
      top-5
      left-1/2
      -translate-x-1/2
      z-50
      w-[95%]
      md:w-[90%]
      lg:w-[82%]
      rounded-2xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-3xl
      shadow-[0_10px_50px_rgba(0,0,0,.35)]
      "
    >
      <div className="h-18 flex items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
        >
          Stack Adda
        </Link>

        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center gap-10">

          <NavLink
            to="/"
            className={menuClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/courses"
            className={menuClass}
          >
            Courses
          </NavLink>

          <NavLink
            to="/about"
            className={menuClass}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={menuClass}
          >
            Contact
          </NavLink>

        </div>

        {/* Right Side */}

        <div className="hidden md:flex items-center gap-4">

          {!user ? (

            <button
              onClick={() => navigate("/login")}
              className="
              rounded-xl
              bg-orange-600
              px-6
              py-2
              text-white
              font-semibold
              transition
              hover:bg-orange-500
              hover:shadow-[0_0_25px_rgba(249,115,22,.45)]
              "
            >
              Login
            </button>

          ) : (

            <>
              {/* User */}

              <button
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-orange-500/50
                bg-white/5
                px-3
                py-2
                hover:bg-white/10
                transition
                "
              >

                <img
                  src={avatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-500"
                />

                <div className="text-left hidden lg:block">

                  <p className="text-xs text-white/50">
                    Welcome
                  </p>

                  <h3 className="font-semibold text-white">
                    {user.name}
                  </h3>

                </div>

                <ChevronDown
                  className={`text-white duration-300 ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  size={18}
                />

              </button>
                            {/* Profile Dropdown */}

              {profileOpen && (
                <div
                  className="
                  absolute
                  right-6
                  top-20
                  w-72
                  rounded-2xl
                  border
                  border-orange-500/10
                  bg-[#0F0F11]/95
                  backdrop-blur-3xl
                  shadow-[0_20px_60px_rgba(0,0,0,.45)]
                  overflow-hidden
                  "
                >
                  {/* User Info */}

                  <div className="flex items-center gap-4 p-5 border-b border-white/10">

                    <img
                      src={avatar}
                      alt=""
                      className="w-16 h-16 rounded-full border-2 border-orange-500 object-cover"
                    />

                    <div>

                      <h2 className="text-white font-semibold text-lg">
                        {user.name}
                      </h2>

                      <p className="text-white/50 text-sm">
                        {user.email}
                      </p>

                      <div className="mt-1 gap-2 flex">
                <span className="mt-1 inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-400">
                  {isAdmin ? "Administrator" : "Student"}
                </span>
                

                  <span
                    className={`mt-1 inline-block rounded-full  px-3 py-1 text-xs  ${
                      user?.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {user?.isVerified
                      ? "Verified"
                      : "Pending "}
                  </span>

                </div>

                    </div>

                  </div>

                  {/* Menu */}

                  <div className="p-3 space-y-2">

                    <Link
                      to={isAdmin ? "/admin" : "/student"}
                      onClick={() => setProfileOpen(false)}
                      className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-white
                      hover:bg-white/5
                      transition
                      "
                    >
                      <LayoutDashboard size={20} />

                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </Link>

                    {!isAdmin && (

                      <Link
                        to="/student/profile"
                        onClick={() => setProfileOpen(false)}
                        className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        hover:bg-white/5
                        transition
                        "
                      >
                        <User size={20} />

                        My Profile
                      </Link>

                    )}

                    {isAdmin && (

                      <Link
                        to="/admin/students"
                        onClick={() => setProfileOpen(false)}
                        className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        hover:bg-white/5
                        transition
                        "
                      >
                        <GraduationCap size={20} />

                        Students
                      </Link>

                    )}

                    <Link
                      to="/admin/profile"
                      onClick={() => setProfileOpen(false)}
                      className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-white
                      hover:bg-white/5
                      transition
                      "
                    >
                      <User size={20} />

                      My Profile
                    </Link>

                    <button
  onClick={handleLogout}
  disabled={logoutLoading}
  className="
    mt-2
    flex
    w-full
    items-center
    justify-center
    gap-3
    rounded-xl
    bg-red-500
    px-4
    py-3
    text-white
    transition
    hover:bg-red-600
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {logoutLoading ? (
    <>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      Logging out...
    </>
  ) : (
    <>
      <LogOut size={20} />
      Logout
    </>
  )}
</button>

                  </div>
                </div>
              )}
            </>
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
          open ? "max-h-[700px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 px-6 py-6 md:hidden">

          {user && (
            <div className="mb-6 flex items-center gap-4">

              <img
                src={avatar}
                alt=""
                className="h-16 w-16 rounded-full border-2 border-orange-500 object-cover"
              />

              <div>

                <h2 className="text-lg font-semibold text-white">
                  {user.name}
                </h2>

                <p className="text-sm text-white/50">
                  {user.email}
                </p>
                <div className="mt-1 gap-2 flex">
                <span className="mt-1 inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-400">
                  {isAdmin ? "Administrator" : "Student"}
                </span>
                

                  <span
                    className={`mt-1 inline-block rounded-full  px-3 py-1 text-xs  ${
                      user?.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {user?.isVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </span>

                </div>

              </div>

            </div>
          )}

          <div className="flex flex-col gap-4">

            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <Home size={20} />
                Home
              </div>
            </NavLink>

            <NavLink
              to="/courses"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                Courses
              </div>
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <Info size={20} />
                About
              </div>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <Phone size={20} />
                Contact
              </div>
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to={isAdmin ? "/admin" : "/student"}
                  onClick={() => setOpen(false)}
                  className={menuClass}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} />
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </div>
                </NavLink>

                {!isAdmin && (
                  <NavLink
                    to="/student/profile"
                    onClick={() => setOpen(false)}
                    className={menuClass}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      My Profile
                    </div>
                  </NavLink>
                )}
                {isAdmin && (
                  <NavLink
                    to="/admin/profile"
                    onClick={() => setOpen(false)}
                    className={menuClass}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      My Profile
                    </div>
                  </NavLink>
                )}

                {isAdmin && (
                  <NavLink
                    to="/admin/students"
                    onClick={() => setOpen(false)}
                    className={menuClass}
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap size={20} />
                      Students
                    </div>
                  </NavLink>
                  
                )}
<button
  onClick={handleLogout}
  disabled={logoutLoading}
  className="
    mt-4
    flex
    w-full
    items-center
    justify-center
    gap-3
    rounded-xl
    bg-red-500
    py-3
    font-medium
    text-white
    transition
    hover:bg-red-600
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {logoutLoading ? (
    <>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      Logging out...
    </>
  ) : (
    <>
      <LogOut size={20} />
      Logout
    </>
  )}
</button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="
                mt-4
                w-full
                rounded-xl
                bg-orange-600
                py-3
                font-semibold
                text-white
                transition
                hover:bg-orange-500
                "
              >
                Login
              </button>
            )}

          </div>

        </div>
      </div>

    </nav>
  );
};

export default Navbar;
