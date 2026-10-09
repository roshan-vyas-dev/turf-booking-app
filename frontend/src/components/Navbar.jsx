import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="px-6 py-6 bg-white border-b shadow-sm">
 
      <div className="max-w-7xl mx-auto px-6 flex flex-col relative">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">TurfBook</h1>

          <div className="hidden md:flex gap-4 ">
            <Link to={"/"} className="hover:text-green-600  px-4 py-2">
              Home
            </Link>
            <Link to="/bookings" className="hover:text-green-600  px-4 py-2">
              My Bookings
            </Link>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 flex flex-col gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-lg z-50">
            <Link to="/" className="block rounded-lg px-4 py-3 text-base font-medium hover:bg-green-50 hover:text-green-700">
              Home
            </Link>

            <Link to="/bookings" className="block rounded-lg px-4 py-3 text-base font-medium hover:bg-green-50 hover:text-green-700">
              My Bookings
            </Link>

            <Link
              to="/login"
              className="block rounded-lg bg-green-600 px-4 py-3 text-center text-base font-semibold text-white hover:bg-green-700"
            >
              Login
            </Link>

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
