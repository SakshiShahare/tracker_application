const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email : {
            type : String ,
            required : true,
            unique : true
        },
        name : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        number : {
            type : String,
            required : true
        },
        mentor : {
            type : Boolean,
            default : false
        }
    }
    
);

const User = mongoose.model("User", userSchema);

module.exports = {User};