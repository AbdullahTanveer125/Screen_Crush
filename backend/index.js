const express = require("express");
const connectDB = require("./DB/database.js");
const cors = require("cors");//different URL pr route krny mey help krta hai
const axios = require('axios');

require("dotenv").config();// import and configuration of dotenv

const app = express();
app.use(express.json());// Middleware to parse JSON data

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
// Routes
// const sampleRoute = require("./routes/sampleRoute");
// app.use("/api/sample", sampleRoute);




const contact_us_router=require("./Routes/contactUs.js");
const user_router=require("./Routes/user.js");
const chat_router=require("./Routes/chat.js");


//connection of mongoDB
connectDB();



// TMDb Configuration
const TMDB_API_KEY = 'ffb541e73dda3c12b99b2d15bbd362a8'; // or use Read Access Token in headers

// Route: Get Popular Movies
app.get('/api/popular-movies', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



//to use router
// app.use("/notification", notification_router); 
app.use(contact_us_router);
app.use("/user", user_router);
app.use('/api/chat', chat_router);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
