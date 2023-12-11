const express = require('express');
const app = express();
const path = require('path');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Connected to mongoDB"));

app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use("/users", userRouter);
app.get('/', (req,res)=>{
    return res.render("home");
});
app.listen(PORT, ()=>console.log(`Server started at ${PORT}`));