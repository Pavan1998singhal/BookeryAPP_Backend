const mongoose = require('mongoose')
require('mongoose-type-email')
//mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'


const signupSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'reader'
    },
    avatar:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('user', signupSchema)