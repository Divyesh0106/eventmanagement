const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/api/user");
const eventRoutes = require("./routes/api/event");

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({"path" : __dirname+`/env${process.env.NODE_ENV.trim()}.env`})

const app = express();

mongoose.connect(process.env.DB_CONFIGRATION, {
    useNewUrlParser: true
}, function (err) {
    if (err) console.log("db connection error : " + err);
    else console.log("Mongodb connected.....");
})
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/event',eventRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server listening on port:",process.env.PORT)
})