const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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
        unique: true,
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
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, 'myteskmanagerapp')
    //user.tokens = user.tokens.concat({token})
    user.tokens.push({token})
    user.save()
    return token
}
userSchema.statics.authenticateUser = async (email, password) => {
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user
}
userSchema.pre('save',async function(next){
   const user = this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8)
   }

   console.log('just before saving...')
   next()
})
const User = mongoose.model('User', userSchema)

module.exports = User