const colors =require("colors")
const mongoose = require("mongoose");

// Method-1
const connectDB=async function(){
    mongoose.connect(process.env.MONGODB_URI)//it return promise.we handle promise with "then()" and "catch()"
    .then(function () {
        console.log('Connected to MongoDB'.bgMagenta);
    })
    .catch(function (err) {
        console.error(`Error connecting to MongoDB:${err}`.bgRed);
    }
);
}

// Method-2
// const connectDB=async function(){
//     try{
//         const conn=mongoose.connect(process.env.MONGO_URI)//it return promise.we handle promise with "then()" and "catch()"
//         console.log(`Connected to MongoDB ${conn.Connection.host}`.bgMagenta);
//         // check host through "conn.Connection.host"
//     }catch{
//         console.error(`Error connecting to MongoDB:${err}`.bgRed);
//     }
// }

module.exports=connectDB;

