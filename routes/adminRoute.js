const express = require('express');
const admin_route = express();
const bodyParser = require('body-parser');
const adminController = require('../controllers/adminController')
const session = require('express-session');
const config  = require('../config/config');
const auth = require("../middleware/adminAuth")

admin_route.use(auth.nocache)

admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized: false,
}))


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));


admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');
admin_route.use(express.static('public'));



//routes 
admin_route.get('/',auth.isLogout,adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard)

admin_route.get('/logout',auth.isLogin,adminController.logout)

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)
admin_route.post('/dashboard',auth.isLogin,adminController.searchUser)

admin_route.get('/new-user', auth.isLogin, adminController.userAddpage)
admin_route.post('/new-user', auth.isLogin, adminController.addUser)

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);
admin_route.post('/edit-user',auth.isLogin,adminController.updateUsers);

admin_route.post('/delete-user', auth.isLogin, adminController.deleteUser);

admin_route.get('*',(req,res) =>{
    res.redirect('/admin');
})

module.exports = admin_route;