import api from "../api/axios.js";
import { useState, useEffect, useCallback } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    const response = await api.get("/api/bookings/my");
    setBookings(response.data.bookings);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchBookings();
    });
  }, [fetchBookings]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-500">
          Manage your turf reservations and payments.
        </p>
        <div className="mt-5 rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="mt-1 text-3xl font-bold text-green-700">
            {bookings.length}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-gray-800">No bookings yet</h2>
          <p className="mt-2 text-gray-500">
            Find your favourite turf and book your first game!
          </p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-gray-900">
              {booking.turf.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {booking.turf.location}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Booking Date
                </p>
                <p className="mt-2 font-semibold text-gray-900">
                  {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Time Slot
                </p>
                <p className="mt-2 font-semibold text-gray-900">
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>

              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  booking.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : booking.paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                Payment: {booking.paymentStatus}
              </span>
            </div>

            {booking.status !== "cancelled" &&
              booking.paymentStatus !== "paid" && (
                <button
                  className="mt-5 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={async () => {
                    try {
                      const response = await api.post(
                        `/api/payments/${booking._id}/order`,
                      );
                      const order = response.data.order;

                      const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        amount: order.amount,
                        currency: order.currency,
                        order_id: order.id,

                        handler: async function (response) {
                          try {
                            const verifyResponse = await api.post(
                              `/api/payments/${booking._id}/verify`,
                              {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id:
                                  response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                              },
                            );

                            console.log(verifyResponse.data);
                            fetchBookings();
                          } catch (error) {
                            console.log(error.response?.data || error.message);
                          }
                        },
                      };
                      const razorpay = new window.Razorpay(options);

                      razorpay.open();
                    } catch (error) {
                      console.log(error.response.data);
                    }
                  }}
                >
                  Pay Now
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;
