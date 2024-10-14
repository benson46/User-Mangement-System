const User = require('../models/userModel');
const bcrypt = require('bcrypt')

const securePassword = async (password) => {  
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        throw new Error('Failed to hash password');
    }
};

const loadLogin = async (req,res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

const verifyLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    return res.render('login', { message: "Email or Password is incorrect" });
                } else {
                    req.session.user_id = userData._id;
                    return res.redirect('/admin/home');
                }
            } else {
                return res.render('login', { message: "Email and Password is incorrect" });
            }
        } else {
            return res.render('login', { message: "Email or Password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
};



const loadDashboard = async (req,res) => {
    try {
       const userData = await  User.findById({_id:req.session.user_id})
        if(!userData){
            return res.redirect('/admin')
        }
        return res.render('home' , {admin:userData})
         
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {
        if(req.session){
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error in logging out');
                }
                return res.redirect('/admin');
            });
        } else {
            return res.redirect('/amdin')
        }
        
    } catch (error) {
        console.log(error.message);
    
    }
}


const adminDashboard = async(req,res)=>{
    try {
        const usersData = await User.find({is_admin:0}).sort({name:1})
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message)
    }
}

const userAddpage = async (req, res) => {
    try {
        res.render('new-user')
    } catch (error) {
        console.error(error.message)
    }
};


const addUser = async(req,res)=> {
    try {
        const hashedPassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: hashedPassword,
            is_admin: 0
        });

        const userData = await user.save();

        if(userData){
             
            res.redirect('/admin/dashboard')
        }else{
            res.render('new-user',{message:'Failed To Register , Please try later'})
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.render('new-user', { message: 'Email already exists! Please use a different email.' });
        } else {
            console.error('Error adding new user:', error.message);
            return res.render('new-user', { message: 'An error occurred while processing your request.' });
        }
    }
};


// edit user functionality

const editUserLoad = async(req,res) => {
    try {
         const id = req.query.id;
         const userData = await User.findById({_id:id});
         if(userData){
            res.render('edit-user',{user:userData})
        console.log(req.body)

         }else{
            res.redirect('/admin/dashboard')
         }
    } catch (error) {
        console.log(error.message)
    }
}


const updateUsers = async (req,res) => {
    try{
        console.log(req.body)

        const userData = await User.findByIdAndUpdate(
            {_id:req.body._id},
            {$set:{
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.contact
            }})
            if (userData) {
                return res.redirect('/admin/dashboard');
            } else {
                return res.render('edit-user', { message: 'Error occurred during the update.' });
            }
    } catch(error){
        console.error(error.message);
        if (error.code === 11000) {
            console.log(req.body)
            return res.render('edit-user', { message: 'Email already exists! Please use a different email.' ,user: req.body});
        }
    }
}

const deleteUser = async(req, res) => {
    try {
        const id = req.body.id
        await User.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
};

const searchUser = async (req, res) => {
    try {
        const search = req.body.search.trim().replace(/[^a-zA-Z0-9]/g, "");
        const searchData = await User.find({
            $and: [
                {name: {$regex: new RegExp(search, 'i') }},
                {is_admin: 0 }
            ]
        }).sort({name:1});

        if(searchData.length > 0){
            return res.render('search-user', { users: searchData });
        }
        else {
            return res.render('search-user', { message: 'No user found' ,users: []});
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    userAddpage,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    searchUser
}