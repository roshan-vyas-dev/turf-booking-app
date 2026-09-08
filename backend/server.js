require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.get("/",(req,res)=>{
  res.send("Turf Booking API is running");
  
})