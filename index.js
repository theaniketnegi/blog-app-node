const express = require('express');
const app = express();
const path = require('path');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

require('dotenv').config();
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/auth');

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connected to mongoDB"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.get('/', async (req,res)=>{
    const allBlogs = await Blog.find({});
    return res.render("home", {
        user:req.user,
        blogs: allBlogs,
    });
});
app.listen(PORT, ()=>console.log(`Server started at ${PORT}`));