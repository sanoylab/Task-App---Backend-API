const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User', {
    firstName: {
        type: String, 
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Invalid Email')
            }

        }
    },
    password:{
        type: String,
        trim: true,
        required: true
    },
    active: {
        type: Boolean,
    }
})

module.exports = User