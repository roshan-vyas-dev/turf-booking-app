import api from "../api/axios.js";
import { useState, useEffect } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const response = await api.get("/api/bookings/my");
    setBookings(response.data.bookings);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h1>my bookings</h1>
      <p>Total bookings: {bookings.length}</p>

      {bookings.map((booking) => (
        <div key={booking._id}>
          <p>{booking.turf.name}</p>
          <p>{booking.bookingDate}</p>
          <p>
            {booking.startTime} - {booking.endTime}
          </p>
          <p>Payment: {booking.paymentStatus}</p>
          <p>Status: {booking.status}</p>

          {booking.status !== "cancelled" &&
            booking.paymentStatus !== "paid" && (
              <button
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
                              razorpay_payment_id: response.razorpay_payment_id,
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
      ))}
    </div>
  );
}

export default MyBookings;
