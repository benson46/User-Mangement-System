const express = require('express');
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const user_Route = require('./routes/userRoutes')
const admin_Route = require('./routes/adminRoute')

app.use('/admin',admin_Route);
app.use('/',user_Route);

app.get('/hello',(req,res)=>{
    res.send("hello");
    res.status(200);
})

//setting for 404
app.set('view engine','ejs')
app.set('views','./views')

app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status=404;
    next(err);
})

app.use((err,req,res,next)=>{
    res.status(err.status);
    res.render('error',{
        message:err.message,
        error:err
    });
})

app.listen(3001,()=>console.log('http://localhost:3001'))