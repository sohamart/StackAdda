import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {

  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] lg:w-[80vw] rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl">

      <div className="flex h-18 items-center justify-between px-6">

        <Link
          to="/"
          className="text-2xl font-bold text-orange-500"
        >
          Stack Adda
        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-8 lg:text-xl text-xl uppercase text-white">

          <Link to="/">Home</Link>

          <Link to="/courses">Courses</Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>

        </div>

        {/* Desktop Button */}

        <button className="hidden md:block rounded-lg bg-orange-600 px-5 py-2 text-white transition hover:bg-orange-500">
          Login
        </button>

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

          <Link to="/courses" onClick={() => setOpen(false)}>
            Courses
          </Link>

          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <button className="rounded-lg bg-orange-600 px-6 py-2 text-white">
            Login
          </button>

        </div>
      </div>

    </nav>
  );
};

export default Navbar;