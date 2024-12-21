require('dotenv').config();
const path = require("path");
const express = require("express");
const connectMongoDB = require("./mongo_connection");
const userRouter = require("./routes/user-router");

const PORT = process.env.SERVER_PORT;
const app = express();

connectMongoDB();

app.set("view engine","ejs" );
app.set("views" ,path.resolve('./views'));


app.use(express.json()); 
app.use(express.urlencoded({extended:false}));


app.use('/user',userRouter);
app.use('/',(req,res)=>res.render('home'));


app.listen(PORT ,()=> console.log(`Server Started at PORT ${PORT} `));

