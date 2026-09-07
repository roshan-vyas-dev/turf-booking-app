const app = require("./app");

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.get("/",(req,res)=>{
  res.send("Turf Booking API is running");
  
})