require('dotenv').config();
const path = require("path");
const express = require("express");
const connectMongoDB = require("./mongo_connection");

const userRouter = require("./routes/user-router");
const addBlogRouter = require("./routes/add-blog-router");
const blogRouter = require('./routes/blog-router');

const {checkAuthentication,restrictTo} = require('./middleware/auth-middleware');
const cookieParser = require('cookie-parser');
const destructureUser = require('./Util/destructureUser');

const PORT = process.env.SERVER_PORT;
const app = express();

connectMongoDB();

app.set("view engine","ejs" );
app.set("views" ,path.resolve('./views'));


app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));

app.use(checkAuthentication);

app.use('/user',userRouter);
app.use('/add-blog',restrictTo(['USER','ADMIN']),addBlogRouter);
app.use('/blog',blogRouter);
app.get('/admin', restrictTo(['ADMIN']), (req, res) => {
    res.send('<p>cooool</p>');
});

app.get('/', (req, res) => {
    const user = destructureUser(req.user);
    console.log(user);
    //console.log(`This user's full name = ${fullName}`);
    return res.render('home', { user });
});



app.listen(PORT ,()=> console.log(`Server Started at PORT ${PORT} `));


process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
})