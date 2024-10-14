const express = require('express');
const user_route = express();

const userController = require('../controllers/userController');
const session = require('express-session');
const config = require('../config/config');

const bodyParser = require('body-parser');

// Authentication Middleware
const auth = require("../middleware/auth");
user_route.use(auth.nocache)

// Setting view engine
user_route.set('view engine','ejs');
user_route.set('views','./views/users')

// Public set
user_route.use(express.static('public'));

// Middleware to use bodyparser
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))


user_route.use(session({
    secret: config.sessionSecret,
    resave: false,             
    saveUninitialized: false,  
    cookie: { maxAge: 60000 } 
}));

// form submition get and post
user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser)

// login page
user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin);


// home page
user_route.get('/home',auth.isLogin,userController.loadhome);

// logout
user_route.get('/logout',auth.isLogin,userController.userLogout)
module.exports = user_route;