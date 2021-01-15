//make modular sort out protection
//Proper error handlers
//validator is email
const express = require("express");
require('dotenv').config();
const api= require("./api/api");
const mongoose = require("mongoose");
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
const app = express();
const User=require("./models/user.js")
const path = require('path')
// const cors = require('cors');
// app.use(cors({origin: "http://localhost:3000"}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", api)
app.use(express.static('client/build'))
    console.log(process.env.NODE_ENV === "production")
// if(process.env.NODE_ENV === "production") {
//     //Set static folder
//     app.use(express.static('client/build'))
//     app.get('*', (req,res)=>{
//       res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
//   }
  
  const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
  app.listen(port, () => console.log(`Server up and running on port ${port} !`));