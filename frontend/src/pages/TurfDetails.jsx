import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

function TurfDetails() {
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

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

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingMessage("");

    try {
      if (!bookingDate) {
        setBookingError("Please select a booking date.");
        return;
      }

      if (!selectedSlot) {
        setBookingError("Please select a time slot.");
        return;
      }
      const [startTime, endTime] = selectedSlot.split("-");

      const bookingData = {
        turf: turf._id,
        bookingDate,
        startTime,
        endTime,
      };
      const response = await api.post("/api/bookings", bookingData);
      setBookingMessage(response.data.message);
    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

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
        <>
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

          <form
            className="mt-8 rounded-2xl bg-white p-6 shadow-lg"
            onSubmit={handleBooking}
          >
            <h2 className="text-xl font-bold text-gray-900">Book This Turf</h2>
            <label>
              <span>Booking Date</span>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </label>

            <label>
              <span>Time Slot</span>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select a time slot</option>
                {turf.availableSlots.map((slot) => (
                  <option
                    key={`${slot.start}-${slot.end}`}
                    value={`${slot.start}-${slot.end}`}
                  >
                    {slot.start} - {slot.end}
                  </option>
                ))}
              </select>
            </label>

            {bookingError && <p className="text-red-600">{bookingError}</p>}

            {bookingMessage && (
              <p className="text-green-600">{bookingMessage}</p>
            )}

            {/* booking button */}
            <button type="submit">Book Now</button>
          </form>
        </>
      )}
    </div>
  );
}

export default TurfDetails;
