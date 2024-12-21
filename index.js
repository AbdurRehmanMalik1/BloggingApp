require('dotenv').config();
const path = require("path");
const express = require("express");

const PORT = process.env.SERVER_PORT;
const app = express();

app.set("view engine","ejs" );
app.set("views" ,path.resolve('./views'));

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    return res.render('home');
})

app.listen(PORT ,()=> console.log(`Server Started at PORT ${PORT} `));

