import Home from "./pages/Home";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Register from "./pages/Register";
import TurfDetails from "./pages/TurfDetails";
import ManageTurfs from "./pages/admin/ManageTurfs";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/turfs/:id" element={<TurfDetails />} />

        {/* admin */}
        <Route path="/admin/turfs" element={<ManageTurfs />} />
      </Routes>
    </div>
  );
}

export default App;
