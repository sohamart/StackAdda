import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Phone,
  Info,
  Home,
  ChevronDown,
  PlayCircle,
  Tv,
  Bookmark,
} from "lucide-react";

import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/student";
  const profilePath = isAdmin ? "/admin/profile" : "/student/profile";

  const avatar =
    user?.profileImage?.url ||
    `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(user?.name || "Stack Adda")}`;

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
    setProfileOpen(false);
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
      backdrop-blur-md
      shadow-[0_10px_50px_rgba(0,0,0,.35)]
      "
    >
      <div className="h-18 flex items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="shrink-0 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
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
            to="/shorts"
            className={menuClass}
          >
            Shorts
          </NavLink>

          <NavLink
            to="/channels"
            className={menuClass}
          >
            Channels
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

          {/* More Dropdown */}
          <div 
            className="relative group cursor-pointer"
            onClick={() => setMoreOpen(!moreOpen)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <div className={`flex items-center gap-1 transition duration-300 ${moreOpen ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
              More <ChevronDown size={16} className={`transition-transform duration-300 ${moreOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
            </div>
            {/* Dropdown Menu */}
            <div className={`absolute left-0 top-full mt-2 w-48 transition-all duration-300 z-50 ${moreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0'}`}>
              <div className="bg-[#0F0F11]/95 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-xl">
                <a 
                  href="https://bangla.stackadda.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-orange-400 rounded-lg transition-colors font-medium"
                >
                  <img src="/favicon.png" className="w-4 h-4 rounded-full" alt="" />
                  Stack Adda Bangla
                </a>
                <div 
                  onClick={() => {
                    if(!user) { navigate("/login"); } else { navigate("/student/saved-videos"); }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-orange-400 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  <Bookmark size={16} />
                  My Saved Videos
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side */}

        <div className="hidden lg:flex items-center gap-4">

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
                  backdrop-blur-md
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

                    <div className="min-w-0">

                      <h2 className="truncate text-lg font-semibold text-white">
                        {user.name}
                      </h2>

                      <p className="break-all text-sm text-white/50">
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
                      to={dashboardPath}
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
                      <>
                      <Link
                        to="/student/my-courses"
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
                        <BookOpen size={20} />
                        My Courses
                      </Link>
                      
                      <Link
                        to="/student/saved-videos"
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
                        <Bookmark size={20} />
                        Saved Videos
                      </Link>
                      </>
                    )}

                    <Link
                      to={profilePath}
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
            aria-label="Toggle menu"
            className="text-white lg:hidden"
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
        <div className="border-t border-white/10 px-6 py-6 lg:hidden">

          {user && (
            <div className="mb-6 flex items-center gap-4">

              <img
                src={avatar}
                alt=""
                className="h-16 w-16 rounded-full border-2 border-orange-500 object-cover"
              />

              <div className="min-w-0">

                <h2 className="truncate text-lg font-semibold text-white">
                  {user.name}
                </h2>

                <p className="break-all text-sm text-white/50">
                  {user.email}
                </p>

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
                <PlayCircle size={20} className="text-orange-400" />
                Courses
              </div>
            </NavLink>

            <NavLink
              to="/shorts"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <PlayCircle size={20} className="text-orange-400" />
                Shorts
              </div>
            </NavLink>

            <NavLink
              to="/channels"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <div className="flex items-center gap-3">
                <Tv size={20} className="text-orange-400" />
                Channels
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

            {/* Mobile External Link */}
            <a
              href="https://bangla.stackadda.me"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-white hover:text-orange-400 transition duration-300"
            >
              <div className="flex items-center gap-3">
                <img src="/favicon.png" className="w-5 h-5 rounded-full" alt="" />
                Stack Adda Bangla
              </div>
            </a>

            {user ? (
              <>
                <NavLink
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className={menuClass}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} />
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </div>
                </NavLink>

                {!isAdmin && (
                  <>
                  <NavLink
                    to="/student/my-courses"
                    onClick={() => setOpen(false)}
                    className={menuClass}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} />
                      My Courses
                    </div>
                  </NavLink>
                  <NavLink
                    to="/student/saved-videos"
                    onClick={() => setOpen(false)}
                    className={menuClass}
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark size={20} />
                      Saved Videos
                    </div>
                  </NavLink>
                  </>
                )}

                <NavLink
                  to={profilePath}
                  onClick={() => setOpen(false)}
                  className={menuClass}
                >
                  <div className="flex items-center gap-3">
                    <User size={20} />
                    My Profile
                  </div>
                </NavLink>

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
