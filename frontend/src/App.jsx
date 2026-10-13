import Home from "./pages/Home";

import {Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Register from "./pages/Register";

function App() {

  return (
    <div>

     <Routes>

      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/bookings" element={<MyBookings/>}/>
      <Route path="/register" element={<Register/>}/>

     </Routes>
     
    </div>
  )
}

export default App
