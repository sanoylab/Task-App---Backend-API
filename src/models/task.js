const mongoose =  require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false,
        required: false
    }
})

module.exports = Task