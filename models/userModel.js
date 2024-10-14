const mongoose = require('mongoose');

// model for database
 const userSchema = new mongoose.Schema({

    name: {
        type : String,
        require : true
    },
    mobile: {
        type : Number, 
        require : true
    },
    email: {
        type : String, 
        require : true 
    },
    password: {
        type : String, 
        require : true
    },
    is_admin : {
        type : Number,
        require : true 
    },

})

module.exports = mongoose.model('User',userSchema);