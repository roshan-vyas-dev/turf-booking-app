import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

function TurfDetails() {
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    api
      .get(`/api/turfs/${id}`)
      .then((response) => {
        setTurf(response.data.turf);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load turf details.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-block font-medium text-green-700 hover:text-green-800"
      >
        ← Back to Turfs
      </Link>

      {loading && (
        <p className="py-10 text-center text-gray-500">
          Loading turf details...
        </p>
      )}

      {error && <p className="py-10 text-center text-red-600">{error}</p>}

      {turf && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <img
            src={turf.images?.[0] || "https://placehold.co/800x400"}
            alt={turf.name}
            className="h-72 w-full object-cover"
          />
          <div className="space-y-3 p-6">
            <h1 className="text-2xl font-bold text-gray-900">{turf.name}</h1>
            <p className="text-gray-600">{turf.location}</p>
            <p className="text-xl font-semibold text-green-700">
              ₹{turf.pricePerHour}/ hour
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TurfDetails;
