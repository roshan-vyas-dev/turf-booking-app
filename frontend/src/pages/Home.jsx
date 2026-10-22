import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../api/axios";

function Home() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/turfs").then((response) => {
      setTurfs(response.data.turfs);
      setLoading(false);
    }).catch(()=>{
      setError("Failed to load turfs. Please try again.");
      setLoading(false);
    })
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-green-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
          Find Your Perfect Turf
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover and book the best sports turfs near you.
        </p>
        <button className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
          Find Your Turf
        </button>
      </section>

      {/* Turf Search Section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Find a Turf Near You
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Enter your location"
              className="mt-4 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 h-12"
            />
            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 sm:w-auto h-12"
            >
              Search Turfs
            </button>
          </div>
        </div>
      </section>

      {/* Featured Turfs Section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900">Featured Turfs</h2>
          {error && <p className="mt-4 text-red-600">{error}</p>}
          {loading && <p className="mt-4 text-gray-600">Loading turfs...</p>}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {turfs.map((turf) => (
              <div
                key={turf.name}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={turf.images?.[0] || "https://placehold.co/600x400"}
                  alt={turf.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {turf.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{turf.location}</p>
                  <p className="mt-3 text-lg font-semibold text-green-700">
                    ₹{turf.pricePerHour}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      / hour
                    </span>
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
