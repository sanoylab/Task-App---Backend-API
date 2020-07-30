const mongoose =  require('mongoose')

const taskSchema = mongoose.Schema({
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

const Task = mongoose.model('Task', taskSchema )

module.exports = Task



