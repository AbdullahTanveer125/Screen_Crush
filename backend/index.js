const express = require("express");
const connectDB=require("./DB/database.js");
const cors = require("cors");//different URL pr route krny mey help krta hai

require("dotenv").config();// import and configuration of dotenv

const app = express();
app.use(cors());
app.use(express.json());// Middleware to parse JSON data

// Routes
// const sampleRoute = require("./routes/sampleRoute");
// app.use("/api/sample", sampleRoute);




//connection of mongoDB
connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
